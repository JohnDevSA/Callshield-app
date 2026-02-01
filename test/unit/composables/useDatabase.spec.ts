/**
 * Tests for useDatabase composable
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useDatabase, normalizePhoneNumber, formatPhoneNumber } from '~/composables/useDatabase';
import { resetDatabase, createMockCallRecord, createMockPhoneNumber } from '../../helpers';

describe('useDatabase', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  describe('normalizePhoneNumber', () => {
    it('should normalize +27 country code to 0 prefix', () => {
      expect(normalizePhoneNumber('+27821234567')).toBe('0821234567');
    });

    it('should normalize 27 country code to 0 prefix', () => {
      expect(normalizePhoneNumber('27821234567')).toBe('0821234567');
    });

    it('should keep 0 prefix as-is', () => {
      expect(normalizePhoneNumber('0821234567')).toBe('0821234567');
    });

    it('should strip non-digit characters', () => {
      expect(normalizePhoneNumber('+27 82 123 4567')).toBe('0821234567');
      expect(normalizePhoneNumber('082-123-4567')).toBe('0821234567');
      expect(normalizePhoneNumber('(082) 123 4567')).toBe('0821234567');
    });

    it('should add leading 0 for 9-digit numbers', () => {
      expect(normalizePhoneNumber('821234567')).toBe('0821234567');
    });

    it('should handle landline numbers', () => {
      expect(normalizePhoneNumber('+27112345678')).toBe('0112345678');
      expect(normalizePhoneNumber('0112345678')).toBe('0112345678');
    });
  });

  describe('formatPhoneNumber', () => {
    it('should format 10-digit number as 0XX XXX XXXX', () => {
      expect(formatPhoneNumber('0821234567')).toBe('082 123 4567');
    });

    it('should normalize then format +27 numbers', () => {
      expect(formatPhoneNumber('+27821234567')).toBe('082 123 4567');
    });

    it('should normalize then format spaced numbers', () => {
      expect(formatPhoneNumber('+27 82 123 4567')).toBe('082 123 4567');
    });

    it('should return original if not 10 digits after normalization', () => {
      expect(formatPhoneNumber('12345')).toBe('12345');
    });

    it('should format landline numbers correctly', () => {
      expect(formatPhoneNumber('0112345678')).toBe('011 234 5678');
    });
  });

  describe('initDatabase', () => {
    it('should create default settings on first init', async () => {
      const { initDatabase, getSettings } = useDatabase();

      await initDatabase();
      const settings = await getSettings();

      expect(settings.autoBlockSpam).toBe(false);
      expect(settings.autoBlockThreshold).toBe(80);
      expect(settings.showCallOverlay).toBe(true);
      expect(settings.postCallPrompt).toBe(true);
      expect(settings.wifiOnlySync).toBe(true);
      expect(settings.enableNotifications).toBe(true);
      expect(settings.darkMode).toBe('system');
      expect(settings.language).toBe('en');
    });

    it('should not overwrite existing settings on subsequent init', async () => {
      const { initDatabase, getSettings, updateSettings } = useDatabase();

      await initDatabase();
      await updateSettings({ language: 'af' });

      await initDatabase();
      const settings = await getSettings();

      expect(settings.language).toBe('af');
    });
  });

  describe('lookupNumber', () => {
    it('should find number by normalized number', async () => {
      const { db, lookupNumber, initDatabase } = useDatabase();
      await initDatabase();

      await db.phoneNumbers.add(createMockPhoneNumber({
        number: '+27 82 123 4567',
        normalizedNumber: '0821234567',
        name: 'Test Contact',
        classification: 'contact'
      }) as any);

      const result = await lookupNumber('0821234567');

      expect(result).toBeDefined();
      expect(result?.name).toBe('Test Contact');
      expect(result?.classification).toBe('contact');
    });

    it('should find number with different input formats', async () => {
      const { db, lookupNumber, initDatabase } = useDatabase();
      await initDatabase();

      await db.phoneNumbers.add(createMockPhoneNumber({
        number: '+27 82 123 4567',
        normalizedNumber: '0821234567',
        name: 'Test',
        classification: 'verified'
      }) as any);

      // Search with +27 format
      const result1 = await lookupNumber('+27821234567');
      expect(result1?.name).toBe('Test');

      // Search with spaces
      const result2 = await lookupNumber('+27 82 123 4567');
      expect(result2?.name).toBe('Test');
    });

    it('should return undefined for unknown numbers', async () => {
      const { lookupNumber, initDatabase } = useDatabase();
      await initDatabase();

      const result = await lookupNumber('0999999999');
      expect(result).toBeUndefined();
    });
  });

  describe('blockNumber / unblockNumber', () => {
    it('should block a phone number', async () => {
      const { blockNumber, isNumberBlocked, initDatabase } = useDatabase();
      await initDatabase();

      await blockNumber('+27 82 123 4567', 'Spammer', 'Telemarketing');

      const isBlocked = await isNumberBlocked('0821234567');
      expect(isBlocked).toBe(true);
    });

    it('should not duplicate when blocking same number twice', async () => {
      const { blockNumber, getBlockedNumbers, initDatabase } = useDatabase();
      await initDatabase();

      const id1 = await blockNumber('0821234567');
      const id2 = await blockNumber('+27 82 123 4567'); // Same number, different format

      expect(id1).toBe(id2);

      const blocked = await getBlockedNumbers();
      expect(blocked.length).toBe(1);
    });

    it('should unblock a phone number', async () => {
      const { blockNumber, unblockNumber, isNumberBlocked, initDatabase } = useDatabase();
      await initDatabase();

      await blockNumber('0821234567');
      await unblockNumber('0821234567');

      const isBlocked = await isNumberBlocked('0821234567');
      expect(isBlocked).toBe(false);
    });

    it('should store auto-blocked flag', async () => {
      const { blockNumber, getBlockedNumbers, initDatabase } = useDatabase();
      await initDatabase();

      await blockNumber('0821234567', undefined, 'High spam score', true);

      const blocked = await getBlockedNumbers();
      expect(blocked[0].autoBlocked).toBe(true);
    });
  });

  describe('isNumberBlocked', () => {
    it('should return true for blocked numbers', async () => {
      const { blockNumber, isNumberBlocked, initDatabase } = useDatabase();
      await initDatabase();

      await blockNumber('0821234567');

      expect(await isNumberBlocked('0821234567')).toBe(true);
      expect(await isNumberBlocked('+27821234567')).toBe(true); // Different format
    });

    it('should return false for non-blocked numbers', async () => {
      const { isNumberBlocked, initDatabase } = useDatabase();
      await initDatabase();

      expect(await isNumberBlocked('0821234567')).toBe(false);
    });
  });

  describe('addCallRecord / getRecentCalls', () => {
    it('should add a call record', async () => {
      const { addCallRecord, getRecentCalls, initDatabase } = useDatabase();
      await initDatabase();

      await addCallRecord(createMockCallRecord({
        phoneNumber: '+27 82 123 4567',
        normalizedNumber: '0821234567',
        direction: 'incoming',
        classification: 'unknown'
      }));

      const calls = await getRecentCalls();
      expect(calls.length).toBe(1);
      expect(calls[0].normalizedNumber).toBe('0821234567');
    });

    it('should return calls in reverse chronological order', async () => {
      const { addCallRecord, getRecentCalls, initDatabase } = useDatabase();
      await initDatabase();

      const now = Date.now();
      await addCallRecord(createMockCallRecord({
        phoneNumber: '0821111111',
        normalizedNumber: '0821111111',
        timestamp: new Date(now - 3600000) // 1 hour ago
      }));
      await addCallRecord(createMockCallRecord({
        phoneNumber: '0822222222',
        normalizedNumber: '0822222222',
        timestamp: new Date(now) // now
      }));

      const calls = await getRecentCalls();
      expect(calls[0].normalizedNumber).toBe('0822222222'); // Most recent first
      expect(calls[1].normalizedNumber).toBe('0821111111');
    });

    it('should limit results', async () => {
      const { addCallRecord, getRecentCalls, initDatabase } = useDatabase();
      await initDatabase();

      for (let i = 0; i < 10; i++) {
        await addCallRecord(createMockCallRecord({
          phoneNumber: `082000000${i}`,
          normalizedNumber: `082000000${i}`
        }));
      }

      const calls = await getRecentCalls(5);
      expect(calls.length).toBe(5);
    });
  });

  describe('getSettings / updateSettings', () => {
    it('should return default settings when none exist', async () => {
      const { getSettings } = useDatabase();

      const settings = await getSettings();
      expect(settings.autoBlockSpam).toBe(false);
      expect(settings.language).toBe('en');
    });

    it('should update settings', async () => {
      const { initDatabase, updateSettings, getSettings } = useDatabase();
      await initDatabase();

      await updateSettings({ autoBlockSpam: true, language: 'zu' });

      const settings = await getSettings();
      expect(settings.autoBlockSpam).toBe(true);
      expect(settings.language).toBe('zu');
    });

    it('should preserve other settings when updating', async () => {
      const { initDatabase, updateSettings, getSettings } = useDatabase();
      await initDatabase();

      await updateSettings({ autoBlockSpam: true });
      await updateSettings({ language: 'af' });

      const settings = await getSettings();
      expect(settings.autoBlockSpam).toBe(true);
      expect(settings.language).toBe('af');
    });
  });

  describe('getDatabaseStats', () => {
    it('should return counts for all tables', async () => {
      const { db, getDatabaseStats, initDatabase } = useDatabase();
      await initDatabase();

      await db.phoneNumbers.add(createMockPhoneNumber() as any);
      await db.callHistory.add(createMockCallRecord() as any);
      await db.blockedNumbers.add({
        phoneNumber: '0821234567',
        normalizedNumber: '0821234567',
        blockedAt: new Date(),
        autoBlocked: false
      });

      const stats = await getDatabaseStats();

      expect(stats.phoneNumbers).toBe(1);
      expect(stats.callHistory).toBe(1);
      expect(stats.blockedNumbers).toBe(1);
    });

    it('should return zeros for empty database', async () => {
      const { getDatabaseStats } = useDatabase();

      const stats = await getDatabaseStats();

      expect(stats.phoneNumbers).toBe(0);
      expect(stats.callHistory).toBe(0);
      expect(stats.blockedNumbers).toBe(0);
    });
  });
});
