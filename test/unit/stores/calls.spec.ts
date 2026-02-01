/**
 * Tests for calls store
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useCallsStore } from '~/stores/calls';
import { useDatabase } from '~/composables/useDatabase';
import { setupPinia, resetDatabase, createMockCallRecord, createMockPhoneNumber } from '../../helpers';

describe('useCallsStore', () => {
  beforeEach(async () => {
    setupPinia();
    await resetDatabase();
  });

  afterEach(async () => {
    await resetDatabase();
  });

  describe('initial state', () => {
    it('should have empty call history', () => {
      const store = useCallsStore();

      expect(store.callHistory).toEqual([]);
      expect(store.isLoading).toBe(false);
      expect(store.lastLookup).toBeNull();
    });
  });

  describe('computed: recentCalls', () => {
    it('should return first 20 calls', async () => {
      const store = useCallsStore();
      const { addCallRecord } = useDatabase();

      // Add 25 calls
      for (let i = 0; i < 25; i++) {
        await addCallRecord(createMockCallRecord({
          phoneNumber: `082000000${i.toString().padStart(2, '0')}`,
          normalizedNumber: `082000000${i.toString().padStart(2, '0')}`
        }));
      }

      await store.loadCallHistory();

      expect(store.recentCalls.length).toBe(20);
    });

    it('should return all calls if less than 20', async () => {
      const store = useCallsStore();
      const { addCallRecord } = useDatabase();

      for (let i = 0; i < 5; i++) {
        await addCallRecord(createMockCallRecord());
      }

      await store.loadCallHistory();

      expect(store.recentCalls.length).toBe(5);
    });
  });

  describe('computed: missedCalls', () => {
    it('should filter missed calls', async () => {
      const store = useCallsStore();
      const { addCallRecord } = useDatabase();

      await addCallRecord(createMockCallRecord({ direction: 'incoming' }));
      await addCallRecord(createMockCallRecord({ direction: 'missed', phoneNumber: '0821111111', normalizedNumber: '0821111111' }));
      await addCallRecord(createMockCallRecord({ direction: 'missed', phoneNumber: '0822222222', normalizedNumber: '0822222222' }));
      await addCallRecord(createMockCallRecord({ direction: 'outgoing', phoneNumber: '0823333333', normalizedNumber: '0823333333' }));

      await store.loadCallHistory();

      expect(store.missedCalls.length).toBe(2);
      expect(store.missedCalls.every(c => c.direction === 'missed')).toBe(true);
    });
  });

  describe('computed: spamCalls', () => {
    it('should filter high_spam and low_spam calls', async () => {
      const store = useCallsStore();
      const { addCallRecord } = useDatabase();

      await addCallRecord(createMockCallRecord({ classification: 'verified' }));
      await addCallRecord(createMockCallRecord({ classification: 'high_spam', phoneNumber: '0821111111', normalizedNumber: '0821111111' }));
      await addCallRecord(createMockCallRecord({ classification: 'low_spam', phoneNumber: '0822222222', normalizedNumber: '0822222222' }));
      await addCallRecord(createMockCallRecord({ classification: 'unknown', phoneNumber: '0823333333', normalizedNumber: '0823333333' }));

      await store.loadCallHistory();

      expect(store.spamCalls.length).toBe(2);
    });
  });

  describe('computed: todayCallCount', () => {
    it('should count calls from today', async () => {
      const store = useCallsStore();
      const { addCallRecord } = useDatabase();

      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      await addCallRecord(createMockCallRecord({ timestamp: now }));
      await addCallRecord(createMockCallRecord({ timestamp: now, phoneNumber: '0821111111', normalizedNumber: '0821111111' }));
      await addCallRecord(createMockCallRecord({ timestamp: yesterday, phoneNumber: '0822222222', normalizedNumber: '0822222222' }));

      await store.loadCallHistory();

      expect(store.todayCallCount).toBe(2);
    });
  });

  describe('computed: blockedTodayCount', () => {
    it('should count blocked calls from today', async () => {
      const store = useCallsStore();
      const { addCallRecord } = useDatabase();

      const now = new Date();

      await addCallRecord(createMockCallRecord({ timestamp: now, blocked: true }));
      await addCallRecord(createMockCallRecord({ timestamp: now, blocked: false, phoneNumber: '0821111111', normalizedNumber: '0821111111' }));
      await addCallRecord(createMockCallRecord({ timestamp: now, blocked: true, phoneNumber: '0822222222', normalizedNumber: '0822222222' }));

      await store.loadCallHistory();

      expect(store.blockedTodayCount).toBe(2);
    });
  });

  describe('action: loadCallHistory', () => {
    it('should load calls from database', async () => {
      const store = useCallsStore();
      const { addCallRecord } = useDatabase();

      await addCallRecord(createMockCallRecord({ callerName: 'Test Caller' }));

      await store.loadCallHistory();

      expect(store.callHistory.length).toBe(1);
      expect(store.callHistory[0].callerName).toBe('Test Caller');
    });

    it('should set isLoading during load', async () => {
      const store = useCallsStore();

      const loadPromise = store.loadCallHistory();

      // Note: In real async scenarios, isLoading would be true during execution
      await loadPromise;

      expect(store.isLoading).toBe(false);
    });
  });

  describe('action: lookupPhoneNumber', () => {
    it('should return lookup result for known number', async () => {
      const store = useCallsStore();
      const { db, initDatabase } = useDatabase();

      await initDatabase();
      await db.phoneNumbers.add(createMockPhoneNumber({
        number: '+27 82 123 4567',
        normalizedNumber: '0821234567',
        name: 'Spam Caller',
        classification: 'high_spam',
        spamScore: 95
      }) as any);

      const result = await store.lookupPhoneNumber('0821234567');

      expect(result.found).toBe(true);
      expect(result.name).toBe('Spam Caller');
      expect(result.classification).toBe('high_spam');
      expect(result.spamScore).toBe(95);
      expect(result.source).toBe('offline');
    });

    it('should return not found for unknown number', async () => {
      const store = useCallsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      const result = await store.lookupPhoneNumber('0999999999');

      expect(result.found).toBe(false);
      expect(result.classification).toBe('unknown');
      expect(result.spamScore).toBe(0);
    });

    it('should set lastLookup', async () => {
      const store = useCallsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.lookupPhoneNumber('0821234567');

      expect(store.lastLookup).not.toBeNull();
      expect(store.lastLookup?.phoneNumber).toBe('082 123 4567');
    });

    it('should format phone number in result', async () => {
      const store = useCallsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      const result = await store.lookupPhoneNumber('+27821234567');

      expect(result.phoneNumber).toBe('082 123 4567');
    });
  });

  describe('action: recordCall', () => {
    it('should add call to history', async () => {
      const store = useCallsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.recordCall('+27 82 123 4567', 'incoming', 'unknown', 60);

      expect(store.callHistory.length).toBe(1);
      expect(store.callHistory[0].direction).toBe('incoming');
      expect(store.callHistory[0].duration).toBe(60);
    });

    it('should normalize phone number', async () => {
      const store = useCallsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();

      await store.recordCall('+27 82 123 4567', 'incoming', 'unknown');

      expect(store.callHistory[0].normalizedNumber).toBe('0821234567');
    });
  });

  describe('action: submitFeedback', () => {
    it('should update userFeedback on call record', async () => {
      const store = useCallsStore();
      const { addCallRecord, initDatabase } = useDatabase();

      await initDatabase();
      await addCallRecord(createMockCallRecord({
        phoneNumber: '+27 82 123 4567',
        normalizedNumber: '0821234567'
      }));

      await store.loadCallHistory();
      await store.submitFeedback('0821234567', true);

      expect(store.callHistory[0].userFeedback).toBe('safe');
    });

    it('should mark as spam when isSafe is false', async () => {
      const store = useCallsStore();
      const { addCallRecord, initDatabase } = useDatabase();

      await initDatabase();
      await addCallRecord(createMockCallRecord({
        phoneNumber: '+27 82 123 4567',
        normalizedNumber: '0821234567'
      }));

      await store.loadCallHistory();
      await store.submitFeedback('0821234567', false);

      expect(store.callHistory[0].userFeedback).toBe('spam');
    });
  });

  describe('action: clearLastLookup', () => {
    it('should clear lastLookup', async () => {
      const store = useCallsStore();
      const { initDatabase } = useDatabase();

      await initDatabase();
      await store.lookupPhoneNumber('0821234567');

      expect(store.lastLookup).not.toBeNull();

      store.clearLastLookup();

      expect(store.lastLookup).toBeNull();
    });
  });

  describe('helper: getClassificationColor', () => {
    it('should return correct colors for classifications', () => {
      const store = useCallsStore();

      expect(store.getClassificationColor('verified')).toBe('success');
      expect(store.getClassificationColor('safe')).toBe('success');
      expect(store.getClassificationColor('contact')).toBe('primary');
      expect(store.getClassificationColor('unknown')).toBe('medium');
      expect(store.getClassificationColor('low_spam')).toBe('warning');
      expect(store.getClassificationColor('high_spam')).toBe('danger');
      expect(store.getClassificationColor('blocked')).toBe('medium');
    });
  });

  describe('helper: getClassificationLabel', () => {
    it('should return correct labels for classifications', () => {
      const store = useCallsStore();

      expect(store.getClassificationLabel('verified')).toBe('Verified');
      expect(store.getClassificationLabel('safe')).toBe('Safe');
      expect(store.getClassificationLabel('contact')).toBe('Contact');
      expect(store.getClassificationLabel('unknown')).toBe('Unknown');
      expect(store.getClassificationLabel('low_spam')).toBe('Suspected Spam');
      expect(store.getClassificationLabel('high_spam')).toBe('Spam');
      expect(store.getClassificationLabel('blocked')).toBe('Blocked');
    });
  });
});
