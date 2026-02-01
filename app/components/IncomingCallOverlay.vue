<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
  call,
  callOutline,
  close,
  ban,
  shieldCheckmark,
  alertCircle,
  warning,
  lockClosed,
  business,
  personCircle,
  helpCircle
} from 'ionicons/icons';
import type { IncomingCallContext, SpamClassification } from '~/types';
import { formatPhoneNumber } from '~/composables/useDatabase';

const props = defineProps<{
  context: IncomingCallContext;
}>();

const emit = defineEmits<{
  answer: [];
  decline: [];
  block: [];
}>();

// Determine call type from context
type CallType = 'spam_high' | 'spam_low' | 'verified' | 'contact' | 'no_data' | 'private' | 'blocked';

const callType = computed<CallType>(() => {
  if (props.context.isBlocked) return 'blocked';
  if (props.context.isContact) return 'contact';
  if (!props.context.phoneNumber || props.context.phoneNumber === 'Private') return 'private';

  if (props.context.lookup) {
    const { classification, verifiedBusiness } = props.context.lookup;
    if (classification === 'high_spam') return 'spam_high';
    if (classification === 'low_spam') return 'spam_low';
    if (classification === 'verified' || verifiedBusiness) return 'verified';
    if (classification === 'safe') return 'verified';
    if (classification === 'contact') return 'contact';
  }

  return 'no_data';
});

// Get background gradient based on call type
const bgGradient = computed(() => {
  switch (callType.value) {
    case 'spam_high':
      return 'from-red-600 to-red-700';
    case 'spam_low':
      return 'from-amber-500 to-amber-600';
    case 'verified':
      return 'from-emerald-500 to-emerald-600';
    case 'contact':
      return 'from-blue-500 to-blue-600';
    case 'blocked':
      return 'from-gray-600 to-gray-700';
    default:
      return 'from-slate-700 to-slate-800';
  }
});

// Show block button for spam calls
const showBlockButton = computed(() => {
  return callType.value === 'spam_high' || callType.value === 'spam_low' || callType.value === 'no_data';
});

// Get caller name to display
const displayName = computed(() => {
  if (props.context.isContact && props.context.lookup?.name) {
    return props.context.lookup.name;
  }
  if (props.context.lookup?.name) {
    return props.context.lookup.name;
  }
  if (callType.value === 'private') {
    return 'Private Number';
  }
  return formatPhoneNumber(props.context.phoneNumber);
});

// Get first letter for contact avatar
const avatarLetter = computed(() => {
  if (props.context.lookup?.name) {
    return props.context.lookup.name.charAt(0).toUpperCase();
  }
  return '?';
});

// Get banner config based on call type
const banner = computed(() => {
  switch (callType.value) {
    case 'spam_high':
      return {
        show: true,
        icon: alertCircle,
        title: 'Likely Spam',
        subtitle: props.context.lookup?.reportCount
          ? `${props.context.lookup.reportCount} people reported this number`
          : 'High spam score'
      };
    case 'spam_low':
      return {
        show: true,
        icon: warning,
        title: 'Possible Spam',
        subtitle: props.context.lookup?.reportCount
          ? `${props.context.lookup.reportCount} spam reports - Use caution`
          : 'Exercise caution'
      };
    case 'verified':
      return {
        show: true,
        icon: shieldCheckmark,
        title: 'Verified Business',
        subtitle: props.context.lookup?.category || 'Trusted caller'
      };
    case 'blocked':
      return {
        show: true,
        icon: ban,
        title: 'Blocked Number',
        subtitle: 'This number is in your block list'
      };
    default:
      return { show: false, icon: helpCircle, title: '', subtitle: '' };
  }
});

// Get icon for main avatar
const avatarIcon = computed(() => {
  switch (callType.value) {
    case 'verified':
      return business;
    case 'private':
      return lockClosed;
    case 'blocked':
      return ban;
    default:
      return call;
  }
});

// Category tag for spam calls
const categoryTag = computed(() => {
  if ((callType.value === 'spam_high' || callType.value === 'spam_low') && props.context.lookup?.category) {
    const categoryLabels: Record<string, string> = {
      telemarketer: 'Telemarketer',
      debt_collector: 'Debt Collector',
      scam: 'Scam',
      bank: 'Bank',
      government: 'Government',
      delivery: 'Delivery',
      healthcare: 'Healthcare',
      telecoms: 'Telecoms',
      business: 'Business',
      personal: 'Personal',
      unknown: 'Unknown'
    };
    return categoryLabels[props.context.lookup.category] || props.context.lookup.category;
  }
  return null;
});
</script>

<template>
  <div
    class="fixed inset-0 flex flex-col z-50 bg-gradient-to-b"
    :class="bgGradient"
  >
    <!-- Banner for spam/verified/blocked -->
    <div
      v-if="banner.show"
      class="bg-white/20 backdrop-blur-sm mx-4 mt-12 rounded-2xl p-4 flex items-center gap-3"
    >
      <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
        <IonIcon :icon="banner.icon" class="text-white text-xl" />
      </div>
      <div class="min-w-0">
        <div class="text-white font-semibold">{{ banner.title }}</div>
        <div class="text-white/80 text-sm truncate">{{ banner.subtitle }}</div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col items-center justify-center px-6">
      <!-- Avatar/Icon -->
      <div
        class="w-28 h-28 rounded-full flex items-center justify-center mb-6"
        :class="callType === 'contact' ? 'bg-white/20' : 'bg-white/10'"
      >
        <span
          v-if="callType === 'contact'"
          class="text-5xl font-bold text-white"
        >
          {{ avatarLetter }}
        </span>
        <IonIcon
          v-else
          :icon="avatarIcon"
          class="text-white/80"
          style="font-size: 48px;"
        />
      </div>

      <!-- Caller info -->
      <h1 class="text-3xl font-bold text-white mb-2 text-center">
        {{ displayName }}
      </h1>

      <!-- Phone number (if we have a name) -->
      <p
        v-if="context.lookup?.name && callType !== 'private'"
        class="text-white/70 text-lg font-mono mb-2"
      >
        {{ formatPhoneNumber(context.phoneNumber) }}
      </p>

      <!-- Private number hint -->
      <p v-if="callType === 'private'" class="text-white/70">
        Caller ID withheld
      </p>

      <!-- No data hint -->
      <p v-if="callType === 'no_data'" class="text-white/60 text-sm mt-2">
        No data available for this number
      </p>

      <!-- Category tag for spam -->
      <div
        v-if="categoryTag"
        class="mt-2 px-4 py-1.5 bg-white/20 rounded-full"
      >
        <span class="text-white/90 text-sm font-medium">{{ categoryTag }}</span>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="px-6 pb-12 pt-6 safe-area-bottom">
      <!-- Block button for spam/unknown -->
      <button
        v-if="showBlockButton"
        class="w-full mb-4 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
        @click="emit('block')"
      >
        <IonIcon :icon="ban" class="text-xl" />
        Block & Report
      </button>

      <!-- Answer/Decline buttons -->
      <div class="flex gap-4">
        <button
          class="flex-1 py-5 bg-red-500 hover:bg-red-600 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-lg shadow-red-500/30 active:scale-95"
          @click="emit('decline')"
        >
          <IonIcon :icon="close" class="text-white text-3xl" />
          <span class="text-white font-medium">Decline</span>
        </button>

        <button
          class="flex-1 py-5 bg-emerald-500 hover:bg-emerald-600 rounded-2xl flex flex-col items-center gap-2 transition-all shadow-lg shadow-emerald-500/30 active:scale-95"
          @click="emit('answer')"
        >
          <IonIcon :icon="callOutline" class="text-white text-3xl" />
          <span class="text-white font-medium">Answer</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: max(env(safe-area-inset-bottom, 0px), 12px);
}
</style>
