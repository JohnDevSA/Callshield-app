import Dexie, { type Table } from 'dexie';
import type { PhoneNumber, CallRecord, BlockedNumber, UserSettings } from '~/types';

// CallShield offline database using Dexie (IndexedDB wrapper)
class CallShieldDatabase extends Dexie {
  phoneNumbers!: Table<PhoneNumber, number>;
  callHistory!: Table<CallRecord, number>;
  blockedNumbers!: Table<BlockedNumber, number>;
  settings!: Table<UserSettings, number>;

  constructor() {
    super('CallShieldDB');

    this.version(1).stores({
      // Indexed fields for fast lookups
      phoneNumbers: '++id, number, normalizedNumber, classification, category, spamScore',
      callHistory: '++id, phoneNumber, normalizedNumber, timestamp, direction, classification',
      blockedNumbers: '++id, phoneNumber, normalizedNumber, blockedAt',
      settings: '++id'
    });
  }
}

// Singleton database instance
let db: CallShieldDatabase | null = null;

function getDatabase(): CallShieldDatabase {
  if (!db) {
    db = new CallShieldDatabase();
  }
  return db;
}

// Normalize SA phone numbers to a consistent format
export function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // Handle SA country code
  if (digits.startsWith('27')) {
    digits = '0' + digits.substring(2);
  } else if (digits.startsWith('+27')) {
    digits = '0' + digits.substring(3);
  }

  // Ensure 10 digits for SA numbers
  if (digits.length === 9 && !digits.startsWith('0')) {
    digits = '0' + digits;
  }

  return digits;
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const normalized = normalizePhoneNumber(phone);

  if (normalized.length === 10) {
    // Format as 0XX XXX XXXX
    return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
  }

  return phone;
}

// Composable for database operations
export function useDatabase() {
  const database = getDatabase();

  // Initialize database with default settings
  async function initDatabase(): Promise<void> {
    try {
      const existingSettings = await database.settings.toArray();

      if (existingSettings.length === 0) {
        await database.settings.add({
          autoBlockSpam: false,
          autoBlockThreshold: 80,
          showCallOverlay: true,
          postCallPrompt: true,
          wifiOnlySync: true,
          enableNotifications: true,
          darkMode: 'system',
          language: 'en'
        });
      }

      console.log('[CallShield] Database initialized successfully');
    } catch (error) {
      console.error('[CallShield] Database initialization failed:', error);
      throw error;
    }
  }

  // Phone number lookup
  async function lookupNumber(phoneNumber: string): Promise<PhoneNumber | undefined> {
    const normalized = normalizePhoneNumber(phoneNumber);

    let result = await database.phoneNumbers
      .where('normalizedNumber')
      .equals(normalized)
      .first();

    if (!result) {
      result = await database.phoneNumbers
        .where('number')
        .equals(phoneNumber)
        .first();
    }

    return result;
  }

  // Call history functions
  async function addCallRecord(record: Omit<CallRecord, 'id'>): Promise<number> {
    return await database.callHistory.add(record as CallRecord);
  }

  async function getRecentCalls(limit = 50): Promise<CallRecord[]> {
    return await database.callHistory
      .orderBy('timestamp')
      .reverse()
      .limit(limit)
      .toArray();
  }

  // Blocked numbers functions
  async function blockNumber(
    phoneNumber: string,
    name?: string,
    reason?: string,
    autoBlocked = false
  ): Promise<number> {
    const normalized = normalizePhoneNumber(phoneNumber);

    const existing = await database.blockedNumbers
      .where('normalizedNumber')
      .equals(normalized)
      .first();

    if (existing) {
      return existing.id!;
    }

    return await database.blockedNumbers.add({
      phoneNumber,
      normalizedNumber: normalized,
      name,
      blockedAt: new Date(),
      reason,
      autoBlocked
    });
  }

  async function unblockNumber(phoneNumber: string): Promise<void> {
    const normalized = normalizePhoneNumber(phoneNumber);
    await database.blockedNumbers
      .where('normalizedNumber')
      .equals(normalized)
      .delete();
  }

  async function isNumberBlocked(phoneNumber: string): Promise<boolean> {
    const normalized = normalizePhoneNumber(phoneNumber);
    const blocked = await database.blockedNumbers
      .where('normalizedNumber')
      .equals(normalized)
      .first();
    return !!blocked;
  }

  async function getBlockedNumbers(): Promise<BlockedNumber[]> {
    return await database.blockedNumbers
      .orderBy('blockedAt')
      .reverse()
      .toArray();
  }

  // Settings functions
  async function getSettings(): Promise<UserSettings> {
    const settings = await database.settings.toArray();
    return settings[0] || {
      autoBlockSpam: false,
      autoBlockThreshold: 80,
      showCallOverlay: true,
      postCallPrompt: true,
      wifiOnlySync: true,
      enableNotifications: true,
      darkMode: 'system',
      language: 'en'
    };
  }

  async function updateSettings(updates: Partial<UserSettings>): Promise<void> {
    const settings = await database.settings.toArray();
    const firstSetting = settings[0];
    if (firstSetting?.id !== undefined) {
      await database.settings.update(firstSetting.id, updates);
    }
  }

  // Database statistics
  async function getDatabaseStats() {
    const [phoneCount, callCount, blockedCount] = await Promise.all([
      database.phoneNumbers.count(),
      database.callHistory.count(),
      database.blockedNumbers.count()
    ]);

    return {
      phoneNumbers: phoneCount,
      callHistory: callCount,
      blockedNumbers: blockedCount
    };
  }

  return {
    db: database,
    initDatabase,
    lookupNumber,
    addCallRecord,
    getRecentCalls,
    blockNumber,
    unblockNumber,
    isNumberBlocked,
    getBlockedNumbers,
    getSettings,
    updateSettings,
    getDatabaseStats
  };
}