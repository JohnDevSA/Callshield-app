<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { call, checkmarkCircle, alertCircle, helpCircle } from 'ionicons/icons';
import type { CallRecord } from '~/types';
import { formatPhoneNumber } from '~/composables/useDatabase';

defineProps<{
  record: CallRecord;
}>();

function getCallIcon(classification: string) {
  if (classification === 'verified' || classification === 'safe') return checkmarkCircle;
  if (classification === 'contact') return call;
  if (classification.includes('spam')) return alertCircle;
  return helpCircle;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d >= today) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d >= yesterday) return 'Yesterday';
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}
</script>

<template>
  <div class="card flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-full flex items-center justify-center"
      :class="{
        'bg-green-100 text-green-600': record.classification === 'verified' || record.classification === 'safe',
        'bg-red-100 text-red-600': record.classification === 'high_spam',
        'bg-amber-100 text-amber-600': record.classification === 'low_spam',
        'bg-blue-100 text-blue-600': record.classification === 'contact',
        'bg-gray-100 text-gray-500': record.classification === 'unknown'
      }"
    >
      <IonIcon :icon="getCallIcon(record.classification)" />
    </div>

    <div class="flex-1 min-w-0">
      <div
        class="font-medium truncate"
        :class="record.classification === 'high_spam' ? 'text-red-600' : ''"
      >
        {{ record.callerName || formatPhoneNumber(record.phoneNumber) }}
      </div>
      <div class="text-xs text-secondary flex items-center gap-1">
        <IonIcon :icon="call" />
        <span class="capitalize">{{ record.direction }}</span>
        <span v-if="record.duration">&middot; {{ Math.floor(record.duration / 60) }}m {{ record.duration % 60 }}s</span>
      </div>
    </div>

    <div class="text-right text-xs text-secondary whitespace-nowrap">
      <div>{{ formatTime(record.timestamp) }}</div>
      <div>{{ formatDate(record.timestamp) }}</div>
    </div>
  </div>
</template>
