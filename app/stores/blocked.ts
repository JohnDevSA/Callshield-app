import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BlockedNumber } from '~/types';
import { useDatabase, normalizePhoneNumber } from '~/composables/useDatabase';

export const useBlockedStore = defineStore('blocked', () => {
  const {
    getBlockedNumbers,
    blockNumber,
    unblockNumber,
    isNumberBlocked
  } = useDatabase();

  // State
  const blockedNumbers = ref<BlockedNumber[]>([]);
  const isLoading = ref(false);

  // Computed
  const blockedCount = computed(() => blockedNumbers.value.length);

  const autoBlockedCount = computed(() =>
    blockedNumbers.value.filter(b => b.autoBlocked).length
  );

  const manuallyBlockedCount = computed(() =>
    blockedNumbers.value.filter(b => !b.autoBlocked).length
  );

  // Actions
  async function loadBlockedNumbers() {
    isLoading.value = true;
    try {
      blockedNumbers.value = await getBlockedNumbers();
    } catch (error) {
      console.error('[CallShield] Failed to load blocked numbers:', error);
    } finally {
      isLoading.value = false;
    }
  }

  async function addBlockedNumber(
    phoneNumber: string,
    name?: string,
    reason?: string,
    autoBlocked = false
  ): Promise<boolean> {
    try {
      await blockNumber(phoneNumber, name, reason, autoBlocked);
      await loadBlockedNumbers();
      console.log(`[CallShield] Blocked: ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error('[CallShield] Failed to block number:', error);
      return false;
    }
  }

  async function removeBlockedNumber(phoneNumber: string): Promise<boolean> {
    try {
      await unblockNumber(phoneNumber);
      await loadBlockedNumbers();
      console.log(`[CallShield] Unblocked: ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error('[CallShield] Failed to unblock number:', error);
      return false;
    }
  }

  async function checkIfBlocked(phoneNumber: string): Promise<boolean> {
    return await isNumberBlocked(phoneNumber);
  }

  function searchBlockedNumbers(query: string): BlockedNumber[] {
    if (!query.trim()) return blockedNumbers.value;

    const normalized = normalizePhoneNumber(query);
    const lowerQuery = query.toLowerCase();

    return blockedNumbers.value.filter(blocked => {
      const matchesNumber = blocked.normalizedNumber.includes(normalized) ||
                           blocked.phoneNumber.includes(query);
      const matchesName = blocked.name?.toLowerCase().includes(lowerQuery);
      return matchesNumber || matchesName;
    });
  }

  async function clearAllBlocked(): Promise<void> {
    for (const blocked of blockedNumbers.value) {
      await unblockNumber(blocked.phoneNumber);
    }
    blockedNumbers.value = [];
    console.log('[CallShield] All blocked numbers cleared');
  }

  async function clearAutoBlocked(): Promise<void> {
    const autoBlocked = blockedNumbers.value.filter(b => b.autoBlocked);
    for (const blocked of autoBlocked) {
      await unblockNumber(blocked.phoneNumber);
    }
    await loadBlockedNumbers();
    console.log('[CallShield] Auto-blocked numbers cleared');
  }

  return {
    // State
    blockedNumbers,
    isLoading,

    // Computed
    blockedCount,
    autoBlockedCount,
    manuallyBlockedCount,

    // Actions
    loadBlockedNumbers,
    addBlockedNumber,
    removeBlockedNumber,
    checkIfBlocked,
    searchBlockedNumbers,
    clearAllBlocked,
    clearAutoBlocked
  };
});