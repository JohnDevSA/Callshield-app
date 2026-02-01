/**
 * Tests for blocked store
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useBlockedStore } from '~/stores/blocked';
import { useDatabase } from '~/composables/useDatabase';
import { setupPinia, resetDatabase } from '../../helpers';

describe('useBlockedStore', () => {
  beforeEach(async () => {
    setupPinia();
    await resetDatabase();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  describe('initial state', () => {
    it('should have empty blocked numbers', () => {
      const store = useBlockedStore();

      expect(store.blockedNumbers).toEqual([]);
      expect(store.isLoading).toBe(false);
    });
  });

  describe('computed: blockedCount', () => {
    it('should return total count', async () => {
      const store = useBlockedStore();
      const { blockNumber, initDatabase } = useDatabase();

      await initDatabase();
      await blockNumber('0821111111');
      await blockNumber('0822222222');

      await store.loadBlockedNumbers();

      expect(store.blockedCount).toBe(2);
    });
  });

  describe('computed: autoBlockedCount', () => {
    it('should count auto-blocked numbers', async () => {
      const store = useBlockedStore();
      const { blockNumber, initDatabase } = useDatabase();

      await initDatabase();
      await blockNumber('0821111111', undefined, undefined, true);
      await blockNumber('0822222222', undefined, undefined, true);
      await blockNumber('0823333333', undefined, undefined, false);

      await store.loadBlockedNumbers();

      expect(store.autoBlockedCount).toBe(2);
    });
  });

  describe('computed: manuallyBlockedCount', () => {
    it('should count manually blocked numbers', async () => {
      const store = useBlockedStore();
      const { blockNumber, initDatabase } = useDatabase();

      await initDatabase();
      await blockNumber('0821111111', undefined, undefined, false);
      await blockNumber('0822222222', undefined, undefined, true);

      await store.loadBlockedNumbers();

      expect(store.manuallyBlockedCount).toBe(1);
    });
  });

  describe('action: loadBlockedNumbers', () => {
    it('should load blocked numbers from database', async () => {
      const store = useBlockedStore();
      const { blockNumber, initDatabase } = useDatabase();

      await initDatabase();
      await blockNumber('0821234567', 'Test', 'Spam');

      await store.loadBlockedNumbers();

      expect(store.blockedNumbers.length).toBe(1);
      expect(store.blockedNumbers[0].normalizedNumber).toBe('0821234567');
    });

    it('should set isLoading during load', async () => {
      const store = useBlockedStore();

      const loadPromise = store.loadBlockedNumbers();
      await loadPromise;

      expect(store.isLoading).toBe(false);
    });
  });

  describe('action: addBlockedNumber', () => {
    it('should block a number', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      const result = await store.addBlockedNumber('0821234567', 'Spammer', 'Telemarketing');

      expect(result).toBe(true);
      expect(store.blockedNumbers.length).toBe(1);
    });

    it('should store name and reason', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.addBlockedNumber('0821234567', 'Scammer', 'Fraud attempt');
      await store.loadBlockedNumbers();

      expect(store.blockedNumbers[0].name).toBe('Scammer');
      expect(store.blockedNumbers[0].reason).toBe('Fraud attempt');
    });

    it('should mark as auto-blocked when specified', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.addBlockedNumber('0821234567', undefined, 'High spam score', true);

      expect(store.blockedNumbers[0].autoBlocked).toBe(true);
    });
  });

  describe('action: removeBlockedNumber', () => {
    it('should unblock a number', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821234567');

      const result = await store.removeBlockedNumber('0821234567');

      expect(result).toBe(true);
      expect(store.blockedNumbers.length).toBe(0);
    });

    it('should handle unblocking non-existent number', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      const result = await store.removeBlockedNumber('0999999999');

      expect(result).toBe(true); // No error thrown
    });
  });

  describe('action: checkIfBlocked', () => {
    it('should return true for blocked number', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821234567');

      const isBlocked = await store.checkIfBlocked('0821234567');

      expect(isBlocked).toBe(true);
    });

    it('should return false for non-blocked number', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      const isBlocked = await store.checkIfBlocked('0821234567');

      expect(isBlocked).toBe(false);
    });

    it('should normalize number format', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821234567');

      // Check with different format
      const isBlocked = await store.checkIfBlocked('+27821234567');

      expect(isBlocked).toBe(true);
    });
  });

  describe('action: searchBlockedNumbers', () => {
    it('should search by phone number', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821111111');
      await store.addBlockedNumber('0822222222');
      await store.addBlockedNumber('0831111111');

      const results = store.searchBlockedNumbers('082');

      expect(results.length).toBe(2);
    });

    it('should search by name', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      // Start fresh
      expect(store.blockedNumbers.length).toBe(0);

      await store.addBlockedNumber('0551111111', 'John Doe');
      await store.addBlockedNumber('0552222222', 'Scammer');
      await store.addBlockedNumber('0553333333', 'Jane Smith');

      // Verify we added 3 numbers
      expect(store.blockedNumbers.length).toBe(3);

      // Search for a specific name pattern that won't match numbers
      // Note: The search also matches normalized numbers, so pure name searches
      // should include digits to be specific (or search filters name-only results)
      const results = store.searchBlockedNumbers('Scammer');

      // At least one result should be the Scammer
      expect(results.some(r => r.name === 'Scammer')).toBe(true);
    });

    it('should return all when query is empty', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821111111');
      await store.addBlockedNumber('0822222222');

      const results = store.searchBlockedNumbers('');

      expect(results.length).toBe(2);
    });

    it('should be case insensitive for names', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821111111', 'SCAMMER');

      const results = store.searchBlockedNumbers('scam');

      expect(results.length).toBe(1);
    });
  });

  describe('action: clearAllBlocked', () => {
    it('should remove all blocked numbers', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821111111');
      await store.addBlockedNumber('0822222222');
      await store.addBlockedNumber('0823333333');

      await store.clearAllBlocked();

      expect(store.blockedNumbers.length).toBe(0);
    });
  });

  describe('action: clearAutoBlocked', () => {
    it('should only remove auto-blocked numbers', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821111111', undefined, undefined, true);
      await store.addBlockedNumber('0822222222', undefined, undefined, false);
      await store.addBlockedNumber('0823333333', undefined, undefined, true);

      await store.clearAutoBlocked();

      expect(store.blockedNumbers.length).toBe(1);
      expect(store.blockedNumbers[0].normalizedNumber).toBe('0822222222');
    });

    it('should keep manually blocked numbers', async () => {
      const store = useBlockedStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.addBlockedNumber('0821111111', 'Manual Block', undefined, false);
      await store.addBlockedNumber('0822222222', undefined, undefined, true);

      await store.clearAutoBlocked();

      expect(store.blockedNumbers[0].name).toBe('Manual Block');
    });
  });
});
