/**
 * Tests for app store
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '~/stores/app';
import { setupPinia } from '../../helpers';
import type { IncomingCallContext } from '~/types';

describe('useAppStore', () => {
  beforeEach(() => {
    setupPinia();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const store = useAppStore();

      expect(store.isInitialized).toBe(false);
      expect(store.isOnline).toBe(true);
      expect(store.isNativePlatform).toBe(false);
      expect(store.currentPlatform).toBe('web');
      expect(store.appVersion).toBe('0.1.0');
      expect(store.incomingCall).toBeNull();
      expect(store.showCallOverlay).toBe(false);
    });

    it('should have initial sync status', () => {
      const store = useAppStore();

      expect(store.syncStatus.lastSync).toBeNull();
      expect(store.syncStatus.databaseVersion).toBe(0);
      expect(store.syncStatus.totalNumbers).toBe(0);
      expect(store.syncStatus.pendingReports).toBe(0);
      expect(store.syncStatus.isOnline).toBe(true);
    });
  });

  describe('computed: isOfflineCapable', () => {
    it('should return false when totalNumbers is 0', () => {
      const store = useAppStore();

      expect(store.isOfflineCapable).toBe(false);
    });

    it('should return true when totalNumbers > 0', () => {
      const store = useAppStore();
      store.updateSyncStatus({ totalNumbers: 100 });

      expect(store.isOfflineCapable).toBe(true);
    });
  });

  describe('action: initializeApp', () => {
    it('should set isInitialized to true', async () => {
      const store = useAppStore();

      await store.initializeApp();

      expect(store.isInitialized).toBe(true);
    });

    it('should detect web platform from Capacitor mock', async () => {
      const store = useAppStore();

      await store.initializeApp();

      expect(store.currentPlatform).toBe('web');
      expect(store.isNativePlatform).toBe(false);
    });
  });

  describe('action: showIncomingCallOverlay', () => {
    it('should set incoming call context and show overlay', () => {
      const store = useAppStore();
      const context: IncomingCallContext = {
        phoneNumber: '+27 82 123 4567',
        isContact: false,
        isBlocked: false
      };

      store.showIncomingCallOverlay(context);

      expect(store.incomingCall).toEqual(context);
      expect(store.showCallOverlay).toBe(true);
    });

    it('should include lookup result if provided', () => {
      const store = useAppStore();
      const context: IncomingCallContext = {
        phoneNumber: '+27 82 123 4567',
        lookup: {
          phoneNumber: '082 123 4567',
          found: true,
          name: 'Spammer',
          category: 'telemarketer',
          classification: 'high_spam',
          spamScore: 95,
          reportCount: 500,
          verifiedBusiness: false,
          source: 'offline'
        },
        isContact: false,
        isBlocked: false
      };

      store.showIncomingCallOverlay(context);

      expect(store.incomingCall?.lookup?.spamScore).toBe(95);
      expect(store.incomingCall?.lookup?.classification).toBe('high_spam');
    });
  });

  describe('action: hideIncomingCallOverlay', () => {
    it('should clear incoming call context and hide overlay', () => {
      const store = useAppStore();

      // First show overlay
      store.showIncomingCallOverlay({
        phoneNumber: '+27 82 123 4567',
        isContact: false,
        isBlocked: false
      });

      // Then hide it
      store.hideIncomingCallOverlay();

      expect(store.showCallOverlay).toBe(false);
      expect(store.incomingCall).toBeNull();
    });
  });

  describe('action: syncDatabase', () => {
    it('should return false when offline', async () => {
      const store = useAppStore();
      store.isOnline = false;

      const result = await store.syncDatabase();

      expect(result).toBe(false);
    });

    it('should return true and update lastSync when online', async () => {
      const store = useAppStore();
      store.isOnline = true;

      const result = await store.syncDatabase();

      expect(result).toBe(true);
      expect(store.syncStatus.lastSync).toBeInstanceOf(Date);
    });
  });

  describe('action: updateSyncStatus', () => {
    it('should merge updates into sync status', () => {
      const store = useAppStore();

      store.updateSyncStatus({
        totalNumbers: 5000,
        databaseVersion: 2
      });

      expect(store.syncStatus.totalNumbers).toBe(5000);
      expect(store.syncStatus.databaseVersion).toBe(2);
      expect(store.syncStatus.pendingReports).toBe(0); // Unchanged
    });

    it('should update lastSync', () => {
      const store = useAppStore();
      const syncDate = new Date();

      store.updateSyncStatus({ lastSync: syncDate });

      expect(store.syncStatus.lastSync).toBe(syncDate);
    });
  });
});
