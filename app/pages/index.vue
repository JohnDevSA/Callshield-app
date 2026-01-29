<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSpinner
} from '@ionic/vue';
import { call, alertCircle, checkmarkCircle, helpCircle, shieldCheckmark, wifi } from 'ionicons/icons';

const callsStore = useCallsStore();
const appStore = useAppStore();
const blockedStore = useBlockedStore();

const isLoading = ref(true);

onMounted(async () => {
  await Promise.all([
    callsStore.loadCallHistory(),
    blockedStore.loadBlockedNumbers()
  ]);
  isLoading.value = false;
});

async function handleRefresh(event: CustomEvent) {
  await callsStore.loadCallHistory();
  (event.target as HTMLIonRefresherElement).complete();
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit'
  });
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

function getCallIcon(classification: string) {
  if (classification === 'verified' || classification === 'safe') return checkmarkCircle;
  if (classification === 'contact') return call;
  if (classification.includes('spam')) return alertCircle;
  return helpCircle;
}

useHead({
  title: 'CallShield'
});
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>CallShield</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <IonRefresher slot="fixed" @ionRefresh="handleRefresh">
        <IonRefresherContent />
      </IonRefresher>

      <!-- Protection Status Card -->
      <div class="p-4">
        <div class="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <IonIcon :icon="shieldCheckmark" class="text-lg" />
                <span class="font-medium text-blue-100">Protected</span>
              </div>
              <div class="text-3xl font-bold mb-1">{{ blockedStore.blockedCount }}</div>
              <div class="text-sm text-blue-200">spam calls blocked</div>
            </div>
            <div class="text-right text-sm text-blue-200">
              <div class="flex items-center gap-1 justify-end">
                <IonIcon :icon="wifi" class="text-xs" />
                <span>{{ appStore.isOnline ? 'Online' : 'Offline' }}</span>
              </div>
              <div v-if="appStore.syncStatus.lastSync" class="mt-0.5">
                {{ new Date(appStore.syncStatus.lastSync).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="px-4 grid grid-cols-3 gap-3 mb-2">
        <div class="card text-center">
          <div class="text-xl font-bold text-primary">{{ callsStore.todayCallCount }}</div>
          <div class="text-xs text-secondary">Today</div>
        </div>
        <div class="card text-center">
          <div class="text-xl font-bold text-red-500">{{ callsStore.spamCalls.length }}</div>
          <div class="text-xs text-secondary">Spam</div>
        </div>
        <div class="card text-center">
          <div class="text-xl font-bold text-amber-500">{{ callsStore.missedCalls.length }}</div>
          <div class="text-xs text-secondary">Missed</div>
        </div>
      </div>

      <!-- Network Status -->
      <div
        v-if="!appStore.isOnline"
        class="mx-4 mb-3 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm flex items-center gap-2"
      >
        <IonIcon :icon="alertCircle" />
        Offline - using local database
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <IonSpinner name="crescent" />
      </div>

      <!-- Empty State -->
      <div
        v-else-if="callsStore.callHistory.length === 0"
        class="text-center py-12 text-secondary"
      >
        <IonIcon :icon="call" class="text-5xl mb-3 opacity-50" />
        <p>No calls yet</p>
        <p class="text-sm">Your call history will appear here</p>
      </div>

      <!-- Call History -->
      <div v-else class="px-4 pb-4">
        <div class="flex items-center justify-between mb-3 px-1">
          <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Calls</p>
        </div>
        <div class="space-y-2">
          <div
            v-for="callRecord in callsStore.recentCalls"
            :key="callRecord.id"
            class="card flex items-center gap-3"
          >
            <!-- Classification Icon -->
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="{
                'bg-green-100 text-green-600': callRecord.classification === 'verified' || callRecord.classification === 'safe',
                'bg-red-100 text-red-600': callRecord.classification === 'high_spam',
                'bg-amber-100 text-amber-600': callRecord.classification === 'low_spam',
                'bg-blue-100 text-blue-600': callRecord.classification === 'contact',
                'bg-gray-100 text-gray-500': callRecord.classification === 'unknown'
              }"
            >
              <IonIcon :icon="getCallIcon(callRecord.classification)" />
            </div>

            <!-- Call Info -->
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate"
                :class="callRecord.classification === 'high_spam' ? 'text-red-600' : ''"
              >
                {{ callRecord.callerName || formatPhoneNumber(callRecord.phoneNumber) }}
              </div>
              <div class="text-xs text-secondary flex items-center gap-1">
                <IonIcon :icon="call" />
                <span class="capitalize">{{ callRecord.direction }}</span>
                <span v-if="callRecord.duration">&middot; {{ Math.floor(callRecord.duration / 60) }}m {{ callRecord.duration % 60 }}s</span>
              </div>
            </div>

            <!-- Time -->
            <div class="text-right text-xs text-secondary whitespace-nowrap">
              <div>{{ formatTime(callRecord.timestamp) }}</div>
              <div>{{ formatDate(callRecord.timestamp) }}</div>
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>