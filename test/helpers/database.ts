/**
 * Database test helpers for CallShield
 */
import Dexie from 'dexie';
import type { PhoneNumber, CallRecord, BlockedNumber, UserSettings } from '~/types';

/**
 * Reset all database tables and clear any cached instances
 */
export async function resetDatabase(): Promise<void> {
  await Dexie.delete('CallShieldDB');
}

/**
 * Create a mock phone number record
 */
export function createMockPhoneNumber(overrides: Partial<PhoneNumber> = {}): Omit<PhoneNumber, 'id'> {
  return {
    number: '+27 82 123 4567',
    normalizedNumber: '0821234567',
    name: undefined,
    classification: 'unknown',
    category: 'unknown',
    spamScore: 0,
    reportCount: 0,
    verifiedBusiness: false,
    ...overrides
  };
}

/**
 * Create a mock call record
 */
export function createMockCallRecord(overrides: Partial<CallRecord> = {}): Omit<CallRecord, 'id'> {
  return {
    phoneNumber: '+27 82 123 4567',
    normalizedNumber: '0821234567',
    direction: 'incoming',
    timestamp: new Date(),
    classification: 'unknown',
    blocked: false,
    ...overrides
  };
}

/**
 * Create a mock blocked number record
 */
export function createMockBlockedNumber(overrides: Partial<BlockedNumber> = {}): Omit<BlockedNumber, 'id'> {
  return {
    phoneNumber: '+27 82 123 4567',
    normalizedNumber: '0821234567',
    name: undefined,
    blockedAt: new Date(),
    reason: undefined,
    autoBlocked: false,
    ...overrides
  };
}

/**
 * Create mock user settings
 */
export function createMockSettings(overrides: Partial<UserSettings> = {}): UserSettings {
  return {
    autoBlockSpam: false,
    autoBlockThreshold: 80,
    showCallOverlay: true,
    postCallPrompt: true,
    wifiOnlySync: true,
    enableNotifications: true,
    darkMode: 'system',
    language: 'en',
    ...overrides
  };
}

/**
 * Seed database with test data
 */
export async function seedTestData(db: Dexie): Promise<{
  phoneNumbers: number[];
  callRecords: number[];
  blockedNumbers: number[];
}> {
  const phoneNumbersTable = db.table('phoneNumbers');
  const callHistoryTable = db.table('callHistory');
  const blockedNumbersTable = db.table('blockedNumbers');
  const settingsTable = db.table('settings');

  // Seed phone numbers
  const phoneNumbers = await phoneNumbersTable.bulkAdd([
    createMockPhoneNumber({ number: '+27 11 234 5678', normalizedNumber: '0112345678', classification: 'high_spam', spamScore: 92 }),
    createMockPhoneNumber({ number: '+27 87 575 9404', normalizedNumber: '0875759404', name: 'FNB', classification: 'verified', spamScore: 0, verifiedBusiness: true }),
    createMockPhoneNumber({ number: '+27 82 333 4444', normalizedNumber: '0823334444', name: 'Mom', classification: 'contact', category: 'personal' })
  ] as PhoneNumber[], { allKeys: true });

  // Seed call history
  const callRecords = await callHistoryTable.bulkAdd([
    createMockCallRecord({ phoneNumber: '+27 82 333 4444', normalizedNumber: '0823334444', callerName: 'Mom', direction: 'incoming', classification: 'contact', duration: 300 }),
    createMockCallRecord({ phoneNumber: '+27 11 234 5678', normalizedNumber: '0112345678', direction: 'missed', classification: 'high_spam', blocked: true }),
    createMockCallRecord({ phoneNumber: '+27 87 575 9404', normalizedNumber: '0875759404', callerName: 'FNB', direction: 'incoming', classification: 'verified', duration: 180 })
  ] as CallRecord[], { allKeys: true });

  // Seed blocked numbers
  const blockedNumbers = await blockedNumbersTable.bulkAdd([
    createMockBlockedNumber({ phoneNumber: '+27 11 234 5678', normalizedNumber: '0112345678', reason: 'Telemarketer', autoBlocked: true }),
    createMockBlockedNumber({ phoneNumber: '+27 21 555 6789', normalizedNumber: '0215556789', reason: 'Scam', autoBlocked: false })
  ] as BlockedNumber[], { allKeys: true });

  // Seed default settings
  await settingsTable.add(createMockSettings());

  return {
    phoneNumbers: phoneNumbers as number[],
    callRecords: callRecords as number[],
    blockedNumbers: blockedNumbers as number[]
  };
}
