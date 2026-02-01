/**
 * Tests for useMockData composable
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useMockData } from '~/composables/useMockData';
import { useDatabase } from '~/composables/useDatabase';
import { resetDatabase } from '../../helpers';

describe('useMockData', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  describe('seedDatabase', () => {
    it('should seed phone numbers', async () => {
      const { seedDatabase } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();

      const phoneNumbers = await db.phoneNumbers.toArray();
      expect(phoneNumbers.length).toBeGreaterThan(0);
    });

    it('should seed call history', async () => {
      const { seedDatabase } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();

      const callHistory = await db.callHistory.toArray();
      expect(callHistory.length).toBeGreaterThan(0);
    });

    it('should seed blocked numbers', async () => {
      const { seedDatabase } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();

      const blockedNumbers = await db.blockedNumbers.toArray();
      expect(blockedNumbers.length).toBeGreaterThan(0);
    });

    it('should seed settings', async () => {
      const { seedDatabase } = useMockData();
      const { getSettings } = useDatabase();

      await seedDatabase();

      const settings = await getSettings();
      expect(settings).toBeDefined();
      expect(settings.language).toBe('en');
    });

    it('should return true on first seed', async () => {
      const { seedDatabase } = useMockData();

      const result = await seedDatabase();
      expect(result).toBe(true);
    });

    it('should return false if already seeded', async () => {
      const { seedDatabase } = useMockData();

      await seedDatabase();
      const result = await seedDatabase();

      expect(result).toBe(false);
    });

    it('should include verified businesses in phone numbers', async () => {
      const { seedDatabase } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();

      const verified = await db.phoneNumbers
        .where('classification')
        .equals('verified')
        .toArray();

      expect(verified.length).toBeGreaterThan(0);
      expect(verified.some(p => p.verifiedBusiness === true)).toBe(true);
    });

    it('should include spam numbers', async () => {
      const { seedDatabase } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();

      const spam = await db.phoneNumbers
        .where('classification')
        .equals('high_spam')
        .toArray();

      expect(spam.length).toBeGreaterThan(0);
      expect(spam.some(p => p.spamScore >= 70)).toBe(true);
    });
  });

  describe('clearMockData', () => {
    it('should clear phone numbers', async () => {
      const { seedDatabase, clearMockData } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();
      await clearMockData();

      const phoneNumbers = await db.phoneNumbers.toArray();
      expect(phoneNumbers.length).toBe(0);
    });

    it('should clear call history', async () => {
      const { seedDatabase, clearMockData } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();
      await clearMockData();

      const callHistory = await db.callHistory.toArray();
      expect(callHistory.length).toBe(0);
    });

    it('should clear blocked numbers', async () => {
      const { seedDatabase, clearMockData } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();
      await clearMockData();

      const blockedNumbers = await db.blockedNumbers.toArray();
      expect(blockedNumbers.length).toBe(0);
    });

    it('should not clear settings', async () => {
      const { seedDatabase, clearMockData } = useMockData();
      const { getSettings } = useDatabase();

      await seedDatabase();
      await clearMockData();

      const settings = await getSettings();
      expect(settings).toBeDefined();
    });

    it('should allow re-seeding after clear', async () => {
      const { seedDatabase, clearMockData } = useMockData();
      const { db } = useDatabase();

      await seedDatabase();
      await clearMockData();

      // clearMockData doesn't clear settings, and seedDatabase checks callHistory
      // So we need to verify we can add data again
      const result = await seedDatabase();
      expect(result).toBe(true);

      const phoneNumbers = await db.phoneNumbers.toArray();
      expect(phoneNumbers.length).toBeGreaterThan(0);
    });
  });
});
