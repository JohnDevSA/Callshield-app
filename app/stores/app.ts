import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { SyncStatus, IncomingCallContext } from '~/types';

export const useAppStore = defineStore('app', () => {
  // State
  const isInitialized = ref(false);
  const isOnline = ref(true);
  const isNativePlatform = ref(false);
  const currentPlatform = ref<'web' | 'ios' | 'android'>('web');
  const appVersion = ref('0.1.0');

  // Incoming call overlay state
  const incomingCall = ref<IncomingCallContext | null>(null);
  const showCallOverlay = ref(false);

  // Post-call feedback state
  const postCallFeedbackNumber = ref<string | null>(null);
  const showPostCallFeedback = ref(false);

  // Sync status
  const syncStatus = ref<SyncStatus>({
    lastSync: null,
    databaseVersion: 0,
    totalNumbers: 0,
    pendingReports: 0,
    isOnline: true
  });

  // Computed
  const isOfflineCapable = computed(() => syncStatus.value.totalNumbers > 0);

  // Actions
  async function initializeApp() {
    // Only run on client side
    if (import.meta.server) return;

    try {
      // Dynamically import Capacitor (only available on client)
      const { Capacitor } = await import('@capacitor/core');

      isNativePlatform.value = Capacitor.isNativePlatform();
      currentPlatform.value = Capacitor.getPlatform() as 'web' | 'ios' | 'android';

      if (isNativePlatform.value) {
        await setupNativeFeatures();
      } else {
        setupWebFallback();
      }

      isInitialized.value = true;
      console.log(`[CallShield] App initialized on ${currentPlatform.value}`);
    } catch (error) {
      console.error('[CallShield] App initialization error:', error);
      // Fallback to web mode
      isNativePlatform.value = false;
      currentPlatform.value = 'web';
      setupWebFallback();
      isInitialized.value = true;
    }
  }

  async function setupNativeFeatures() {
    const { App } = await import('@capacitor/app');
    const { Network } = await import('@capacitor/network');
    const { StatusBar, Style } = await import('@capacitor/status-bar');

    // Status bar
    try {
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#2563EB' });
    } catch (error) {
      console.warn('[CallShield] StatusBar setup failed:', error);
    }

    // Network listener
    const status = await Network.getStatus();
    isOnline.value = status.connected;
    syncStatus.value.isOnline = status.connected;

    Network.addListener('networkStatusChange', (status) => {
      isOnline.value = status.connected;
      syncStatus.value.isOnline = status.connected;
    });

    // App state listeners
    App.addListener('appStateChange', ({ isActive }) => {
      console.log(`[CallShield] App state: ${isActive ? 'foreground' : 'background'}`);
    });

    App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.minimizeApp();
      }
    });
  }

  function setupWebFallback() {
    isOnline.value = navigator.onLine;
    window.addEventListener('online', () => {
      isOnline.value = true;
      syncStatus.value.isOnline = true;
    });
    window.addEventListener('offline', () => {
      isOnline.value = false;
      syncStatus.value.isOnline = false;
    });
  }

  // Incoming call handling
  function showIncomingCallOverlay(context: IncomingCallContext) {
    incomingCall.value = context;
    showCallOverlay.value = true;
  }

  function hideIncomingCallOverlay() {
    showCallOverlay.value = false;
    incomingCall.value = null;
  }

  // Post-call feedback handling
  function showPostCallFeedbackModal(phoneNumber: string) {
    postCallFeedbackNumber.value = phoneNumber;
    showPostCallFeedback.value = true;
  }

  function hidePostCallFeedbackModal() {
    showPostCallFeedback.value = false;
    postCallFeedbackNumber.value = null;
  }

  // Sync functions
  async function syncDatabase() {
    if (!isOnline.value) {
      console.log('[CallShield] Cannot sync: offline');
      return false;
    }

    try {
      // TODO: Implement API sync
      syncStatus.value.lastSync = new Date();
      return true;
    } catch (error) {
      console.error('[CallShield] Sync failed:', error);
      return false;
    }
  }

  function updateSyncStatus(updates: Partial<SyncStatus>) {
    syncStatus.value = { ...syncStatus.value, ...updates };
  }

  return {
    // State
    isInitialized,
    isOnline,
    isNativePlatform,
    currentPlatform,
    appVersion,
    incomingCall,
    showCallOverlay,
    postCallFeedbackNumber,
    showPostCallFeedback,
    syncStatus,

    // Computed
    isOfflineCapable,

    // Actions
    initializeApp,
    showIncomingCallOverlay,
    hideIncomingCallOverlay,
    showPostCallFeedbackModal,
    hidePostCallFeedbackModal,
    syncDatabase,
    updateSyncStatus
  };
});