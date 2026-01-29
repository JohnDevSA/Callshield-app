<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  alertController
} from '@ionic/vue';
import { ban, flash, time } from 'ionicons/icons';

const blockedStore = useBlockedStore();

const searchQuery = ref('');
const isLoading = ref(true);

const filteredNumbers = computed(() => {
  return blockedStore.searchBlockedNumbers(searchQuery.value);
});

onMounted(async () => {
  await blockedStore.loadBlockedNumbers();
  isLoading.value = false;
});

async function handleRefresh(event: CustomEvent) {
  await blockedStore.loadBlockedNumbers();
  (event.target as HTMLIonRefresherElement).complete();
}

async function unblockNumber(phoneNumber: string) {
  const alert = await alertController.create({
    header: 'Unblock Number',
    message: `Are you sure you want to unblock ${formatPhoneNumber(phoneNumber)}?`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Unblock',
        role: 'destructive',
        handler: async () => {
          await blockedStore.removeBlockedNumber(phoneNumber);
        }
      }
    ]
  });
  await alert.present();
}

async function clearAllBlocked() {
  const alert = await alertController.create({
    header: 'Clear All Blocked',
    message: `This will unblock all ${blockedStore.blockedCount} numbers. Are you sure?`,
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Clear All',
        role: 'destructive',
        handler: async () => {
          await blockedStore.clearAllBlocked();
        }
      }
    ]
  });
  await alert.present();
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

useHead({
  title: 'Blocked - CallShield'
});
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Blocked Numbers</IonTitle>
        <IonButton
          v-if="blockedStore.blockedCount > 0"
          slot="end"
          fill="clear"
          color="danger"
          @click="clearAllBlocked"
        >
          Clear All
        </IonButton>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <IonRefresher slot="fixed" @ionRefresh="handleRefresh">
        <IonRefresherContent />
      </IonRefresher>

      <!-- Stats -->
      <div class="p-4 flex gap-3">
        <div class="flex-1 card text-center">
          <div class="text-xl font-bold">{{ blockedStore.blockedCount }}</div>
          <div class="text-xs text-secondary">Total</div>
        </div>
        <div class="flex-1 card text-center">
          <div class="text-xl font-bold text-primary">{{ blockedStore.autoBlockedCount }}</div>
          <div class="text-xs text-secondary">Auto</div>
        </div>
        <div class="flex-1 card text-center">
          <div class="text-xl font-bold">{{ blockedStore.manuallyBlockedCount }}</div>
          <div class="text-xs text-secondary">Manual</div>
        </div>
      </div>

      <!-- Search -->
      <div class="px-4">
        <IonSearchbar v-model="searchQuery" placeholder="Search blocked numbers" />
      </div>

      <!-- Empty State -->
      <div
        v-if="!isLoading && blockedStore.blockedCount === 0"
        class="text-center py-12 text-secondary"
      >
        <IonIcon :icon="ban" class="text-5xl mb-3 opacity-50" />
        <p>No blocked numbers</p>
        <p class="text-sm">Numbers you block will appear here</p>
      </div>

      <!-- Blocked List -->
      <div v-else class="px-4 space-y-2">
        <div
          v-for="blocked in filteredNumbers"
          :key="blocked.id"
          class="card flex items-center justify-between"
          @click="unblockNumber(blocked.phoneNumber)"
        >
          <div class="flex items-center gap-3">
            <IonIcon :icon="ban" color="medium" />
            <div>
              <div class="font-mono font-medium">
                {{ blocked.name || formatPhoneNumber(blocked.phoneNumber) }}
              </div>
              <div class="text-xs text-secondary flex items-center gap-1">
                <IonIcon :icon="time" />
                {{ formatDate(blocked.blockedAt) }}
              </div>
            </div>
          </div>

          <div
            v-if="blocked.autoBlocked"
            class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
          >
            <IonIcon :icon="flash" />
            Auto
          </div>
        </div>
      </div>
    </IonContent>
  </IonPage>
</template>