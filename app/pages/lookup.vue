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
  IonSpinner
} from '@ionic/vue';
import { search, checkmarkCircle, alertCircle, ban, helpCircle } from 'ionicons/icons';
import type { LookupResult } from '~/types';

const callsStore = useCallsStore();
const blockedStore = useBlockedStore();

const searchQuery = ref('');
const isSearching = ref(false);
const result = ref<LookupResult | null>(null);
const hasSearched = ref(false);

async function handleSearch() {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;
  hasSearched.value = true;

  try {
    result.value = await callsStore.lookupPhoneNumber(searchQuery.value);
  } catch (error) {
    console.error('Lookup failed:', error);
  } finally {
    isSearching.value = false;
  }
}

async function blockNumber() {
  if (result.value) {
    await blockedStore.addBlockedNumber(result.value.phoneNumber);
    result.value = { ...result.value, classification: 'blocked' };
  }
}

function clearSearch() {
  searchQuery.value = '';
  result.value = null;
  hasSearched.value = false;
}

useHead({
  title: 'Lookup - CallShield'
});
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Lookup Number</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true" class="ion-padding">
      <!-- Search Input -->
      <div class="mb-6">
        <IonSearchbar
          v-model="searchQuery"
          placeholder="Enter phone number"
          inputmode="tel"
          type="tel"
          :debounce="0"
          @keyup.enter="handleSearch"
          @ionClear="clearSearch"
          class="mb-3"
        />

        <IonButton
          expand="block"
          :disabled="!searchQuery.trim() || isSearching"
          @click="handleSearch"
        >
          <IonSpinner v-if="isSearching" name="crescent" class="mr-2" />
          <IonIcon v-else :icon="search" slot="start" />
          Search
        </IonButton>
      </div>

      <!-- Result Card -->
      <div v-if="result" class="card p-6">
        <!-- Number Display -->
        <div class="text-center mb-6">
          <div class="font-mono text-2xl font-bold mb-2">
            {{ result.phoneNumber }}
          </div>
          <div v-if="result.name" class="text-lg text-secondary">
            {{ result.name }}
          </div>
        </div>

        <!-- Classification Badge -->
        <div class="flex justify-center mb-6">
          <div
            class="px-4 py-2 rounded-full flex items-center gap-2"
            :class="{
              'bg-green-100 text-green-700': result.classification === 'verified' || result.classification === 'safe',
              'bg-red-100 text-red-700': result.classification === 'high_spam',
              'bg-amber-100 text-amber-700': result.classification === 'low_spam',
              'bg-gray-100 text-gray-700': result.classification === 'unknown' || result.classification === 'blocked'
            }"
          >
            <IonIcon
              :icon="result.classification === 'unknown' ? helpCircle : result.classification.includes('spam') ? alertCircle : checkmarkCircle"
            />
            {{ callsStore.getClassificationLabel(result.classification) }}
          </div>
        </div>

        <!-- Spam Score -->
        <div v-if="result.found" class="mb-6">
          <div class="flex justify-between text-sm text-secondary mb-1">
            <span>Spam Score</span>
            <span>{{ result.spamScore }}%</span>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all"
              :class="{
                'bg-green-500': result.spamScore < 30,
                'bg-amber-500': result.spamScore >= 30 && result.spamScore < 70,
                'bg-red-500': result.spamScore >= 70
              }"
              :style="{ width: `${result.spamScore}%` }"
            />
          </div>
        </div>

        <!-- Not Found -->
        <div v-if="!result.found" class="text-center text-secondary mb-6">
          <IonIcon :icon="helpCircle" class="text-4xl mb-2" />
          <p>No information found for this number</p>
        </div>

        <!-- Actions -->
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <IonButton expand="block" color="success" fill="outline">
              <IonIcon :icon="checkmarkCircle" slot="start" />
              Safe
            </IonButton>
            <IonButton expand="block" color="danger" fill="outline">
              <IonIcon :icon="alertCircle" slot="start" />
              Spam
            </IonButton>
          </div>

          <IonButton
            v-if="result.classification !== 'blocked'"
            expand="block"
            color="medium"
            @click="blockNumber"
          >
            <IonIcon :icon="ban" slot="start" />
            Block This Number
          </IonButton>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!hasSearched" class="text-center py-12 text-secondary">
        <IonIcon :icon="search" class="text-5xl mb-3 opacity-50" />
        <p>Enter a phone number to look up</p>
        <p class="text-sm">Check if a number is safe or spam</p>
      </div>
    </IonContent>
  </IonPage>
</template>