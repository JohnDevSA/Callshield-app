<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { checkmarkCircle, alertCircle, helpCircle, call, ban } from 'ionicons/icons';
import type { SpamClassification } from '~/types';

const props = defineProps<{
  classification: SpamClassification;
  size?: 'sm' | 'md';
}>();

const classMap = {
  verified: { bg: 'bg-green-100 text-green-700', icon: checkmarkCircle, label: 'Verified' },
  safe: { bg: 'bg-green-100 text-green-700', icon: checkmarkCircle, label: 'Safe' },
  contact: { bg: 'bg-blue-100 text-blue-700', icon: call, label: 'Contact' },
  low_spam: { bg: 'bg-amber-100 text-amber-700', icon: alertCircle, label: 'Suspected Spam' },
  high_spam: { bg: 'bg-red-100 text-red-700', icon: alertCircle, label: 'Spam' },
  unknown: { bg: 'bg-gray-100 text-gray-600', icon: helpCircle, label: 'Unknown' },
  blocked: { bg: 'bg-gray-100 text-gray-600', icon: ban, label: 'Blocked' }
};

const config = computed(() => classMap[props.classification] || classMap.unknown);
</script>

<template>
  <div
    class="rounded-full flex items-center gap-1 font-medium"
    :class="[
      config.bg,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-4 py-2 text-sm'
    ]"
  >
    <IonIcon :icon="config.icon" />
    {{ config.label }}
  </div>
</template>
