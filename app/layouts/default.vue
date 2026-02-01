<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { home, search, ban, settings } from 'ionicons/icons';
import { useAppStore } from '~/stores/app';
import { useBlockedStore } from '~/stores/blocked';
import { useCallsStore } from '~/stores/calls';
import { useToast } from '~/composables/useToast';

const route = useRoute();
const appStore = useAppStore();
const blockedStore = useBlockedStore();
const callsStore = useCallsStore();
const toast = useToast();

// Handle incoming call overlay actions
async function handleAnswer() {
  const phoneNumber = appStore.incomingCall?.phoneNumber;
  appStore.hideIncomingCallOverlay();
  // Native call answering would be handled by the platform
  // After call ends, show post-call feedback (simulated here)
  if (phoneNumber && !appStore.incomingCall?.isContact) {
    // In real app, this would be triggered when call ends
    setTimeout(() => {
      appStore.showPostCallFeedbackModal(phoneNumber);
    }, 2000);
  }
}

function handleDecline() {
  appStore.hideIncomingCallOverlay();
  // Native call declining would be handled by the platform
}

async function handleBlock() {
  if (appStore.incomingCall) {
    await blockedStore.addBlockedNumber(
      appStore.incomingCall.phoneNumber,
      appStore.incomingCall.lookup?.name,
      'Blocked during incoming call'
    );
    toast.success('Number blocked successfully');
  }
  appStore.hideIncomingCallOverlay();
}

// Handle post-call feedback actions
async function handleFeedbackSafe() {
  if (appStore.postCallFeedbackNumber) {
    await callsStore.submitFeedback(appStore.postCallFeedbackNumber, true);
    toast.success('Marked as safe');
  }
  appStore.hidePostCallFeedbackModal();
}

async function handleFeedbackSpam() {
  if (appStore.postCallFeedbackNumber) {
    await callsStore.submitFeedback(appStore.postCallFeedbackNumber, false);
    // Optionally block the number
    await blockedStore.addBlockedNumber(
      appStore.postCallFeedbackNumber,
      undefined,
      'Reported as spam'
    );
    toast.warning('Reported as spam and blocked');
  }
  appStore.hidePostCallFeedbackModal();
}

function handleFeedbackDismiss() {
  appStore.hidePostCallFeedbackModal();
}

const tabs = [
  { path: '/', label: 'Calls', icon: home },
  { path: '/lookup', label: 'Lookup', icon: search },
  { path: '/blocked', label: 'Blocked', icon: ban },
  { path: '/settings', label: 'Settings', icon: settings }
];
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Incoming call overlay -->
    <IncomingCallOverlay
      v-if="appStore.showCallOverlay && appStore.incomingCall"
      :context="appStore.incomingCall"
      @answer="handleAnswer"
      @decline="handleDecline"
      @block="handleBlock"
    />

    <!-- Post-call feedback modal -->
    <PostCallFeedback
      v-if="appStore.showPostCallFeedback && appStore.postCallFeedbackNumber"
      :phone-number="appStore.postCallFeedbackNumber"
      @safe="handleFeedbackSafe"
      @spam="handleFeedbackSpam"
      @dismiss="handleFeedbackDismiss"
    />

    <div class="flex-1 overflow-auto">
      <slot />
    </div>

    <!-- Custom tab bar (Ionic IonTabBar requires IonTabs which conflicts with Nuxt routing) -->
    <nav class="flex border-t border-gray-200 bg-white safe-area-bottom">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        class="flex-1 flex flex-col items-center py-2 px-1 text-xs transition-colors"
        :class="route.path === tab.path ? 'text-primary' : 'text-gray-400'"
        @click="navigateTo(tab.path)"
      >
        <IonIcon :icon="tab.icon" class="text-xl mb-0.5" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>