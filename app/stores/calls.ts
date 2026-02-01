import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CallRecord, LookupResult, SpamClassification } from '~/types';
import { useDatabase, normalizePhoneNumber, formatPhoneNumber } from '~/composables/useDatabase';

export const useCallsStore = defineStore('calls', () => {
  const { getRecentCalls, addCallRecord, lookupNumber } = useDatabase();

  // State
  const callHistory = ref<CallRecord[]>([]);
  const isLoading = ref(false);
  const lastLookup = ref<LookupResult | null>(null);

  // Computed
  const recentCalls = computed(() => callHistory.value.slice(0, 20));

  const missedCalls = computed(() =>
    callHistory.value.filter(call => call.direction === 'missed')
  );

  const spamCalls = computed(() =>
    callHistory.value.filter(call =>
      call.classification === 'high_spam' || call.classification === 'low_spam'
    )
  );

  const todayCallCount = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return callHistory.value.filter(call =>
      new Date(call.timestamp) >= today
    ).length;
  });

  const blockedTodayCount = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return callHistory.value.filter(call =>
      new Date(call.timestamp) >= today && call.blocked
    ).length;
  });

  // Actions
  async function loadCallHistory() {
    isLoading.value = true;
    try {
      callHistory.value = await getRecentCalls(100);
    } catch (error) {
      console.error('[CallShield] Failed to load call history:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function lookupPhoneNumber(phoneNumber: string): Promise<LookupResult> {
    const offlineResult = await lookupNumber(phoneNumber);

    if (offlineResult) {
      const result: LookupResult = {
        phoneNumber: formatPhoneNumber(phoneNumber),
        found: true,
        name: offlineResult.name,
        category: offlineResult.category,
        classification: offlineResult.classification,
        spamScore: offlineResult.spamScore,
        reportCount: offlineResult.reportCount,
        verifiedBusiness: offlineResult.verifiedBusiness || false,
        source: 'offline'
      };
      lastLookup.value = result;
      return result;
    }

    // TODO: Check online API if offline not found
    const result: LookupResult = {
      phoneNumber: formatPhoneNumber(phoneNumber),
      found: false,
      category: 'unknown',
      classification: 'unknown',
      spamScore: 0,
      reportCount: 0,
      verifiedBusiness: false,
      source: 'offline'
    };

    lastLookup.value = result;
    return result;
  }

  async function recordCall(
    phoneNumber: string,
    direction: CallRecord['direction'],
    classification: SpamClassification,
    duration?: number
  ): Promise<void> {
    const normalized = normalizePhoneNumber(phoneNumber);

    const record: Omit<CallRecord, 'id'> = {
      phoneNumber,
      normalizedNumber: normalized,
      direction,
      timestamp: new Date(),
      duration,
      classification,
      blocked: false
    };

    await addCallRecord(record);
    await loadCallHistory();
  }

  async function submitFeedback(phoneNumber: string, isSafe: boolean): Promise<void> {
    // TODO: Submit to API
    console.log(`[CallShield] Feedback submitted: ${phoneNumber} is ${isSafe ? 'safe' : 'spam'}`);

    const normalized = normalizePhoneNumber(phoneNumber);
    const index = callHistory.value.findIndex(
      call => call.normalizedNumber === normalized
    );

    if (index !== -1) {
      const call = callHistory.value[index];
      if (call) {
        call.userFeedback = isSafe ? 'safe' : 'spam';
      }
    }
  }

  function clearLastLookup() {
    lastLookup.value = null;
  }

  // Helper to get classification color
  function getClassificationColor(classification: SpamClassification): string {
    const colors: Record<SpamClassification, string> = {
      verified: 'success',
      contact: 'primary',
      safe: 'success',
      unknown: 'medium',
      low_spam: 'warning',
      high_spam: 'danger',
      blocked: 'medium'
    };
    return colors[classification] || 'medium';
  }

  // Helper to get classification label
  function getClassificationLabel(classification: SpamClassification): string {
    const labels: Record<SpamClassification, string> = {
      verified: 'Verified',
      contact: 'Contact',
      safe: 'Safe',
      unknown: 'Unknown',
      low_spam: 'Suspected Spam',
      high_spam: 'Spam',
      blocked: 'Blocked'
    };
    return labels[classification] || 'Unknown';
  }

  return {
    // State
    callHistory,
    isLoading,
    lastLookup,

    // Computed
    recentCalls,
    missedCalls,
    spamCalls,
    todayCallCount,
    blockedTodayCount,

    // Actions
    loadCallHistory,
    lookupPhoneNumber,
    recordCall,
    submitFeedback,
    clearLastLookup,

    // Helpers
    getClassificationColor,
    getClassificationLabel
  };
});