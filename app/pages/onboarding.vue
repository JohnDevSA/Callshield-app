<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon } from '@ionic/vue';
import {
  shield,
  lockClosed,
  call,
  notifications,
  checkmarkCircle,
  chevronForward
} from 'ionicons/icons';

definePageMeta({
  layout: false
});

const currentStep = ref(0);
const totalSteps = 4;

// Permission states (simulated for now)
const permissions = ref({
  phone: false,
  callLog: false,
  contacts: false,
  notifications: false
});

function nextStep() {
  if (currentStep.value < totalSteps - 1) {
    currentStep.value++;
  } else {
    completeOnboarding();
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

async function requestPermission(type: keyof typeof permissions.value) {
  // In real app, this would use Capacitor permissions API
  // For now, just toggle the state
  permissions.value[type] = !permissions.value[type];
}

async function grantAllPermissions() {
  // Simulate granting permissions
  permissions.value.phone = true;
  permissions.value.callLog = true;
  permissions.value.notifications = true;
  // Note: contacts remains optional
  nextStep();
}

function completeOnboarding() {
  // Mark onboarding as complete in localStorage
  if (import.meta.client) {
    localStorage.setItem('callshield_onboarding_complete', 'true');
  }
  navigateTo('/');
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Step 1: Welcome -->
    <div v-if="currentStep === 0" class="flex-1 flex flex-col items-center justify-center px-8 py-12">
      <div class="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-8">
        <IonIcon :icon="shield" class="text-primary text-6xl" />
      </div>

      <h1 class="text-2xl font-bold text-gray-800 text-center mb-4">
        Block spam calls<br />before they disturb you
      </h1>

      <p class="text-gray-500 text-center mb-12">
        Know who's calling — even when you're offline
      </p>

      <button
        class="w-full max-w-xs bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors active:scale-95"
        @click="nextStep"
      >
        Get Started
      </button>
    </div>

    <!-- Step 2: Privacy Promise -->
    <div v-else-if="currentStep === 1" class="flex-1 flex flex-col items-center px-8 py-12">
      <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <IonIcon :icon="lockClosed" class="text-emerald-600 text-4xl" />
      </div>

      <h1 class="text-2xl font-bold text-gray-800 text-center mb-6">
        Your privacy matters
      </h1>

      <div class="w-full max-w-sm space-y-4 mb-12">
        <div class="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
          <IonIcon :icon="checkmarkCircle" class="text-emerald-500 text-xl mt-0.5" />
          <div>
            <p class="font-medium text-gray-800">We never upload your contacts</p>
            <p class="text-sm text-gray-500">Your phonebook stays on your device</p>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
          <IonIcon :icon="checkmarkCircle" class="text-emerald-500 text-xl mt-0.5" />
          <div>
            <p class="font-medium text-gray-800">Your call history stays private</p>
            <p class="text-sm text-gray-500">We only sync spam reports, not your calls</p>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-gray-50 p-4 rounded-xl">
          <IonIcon :icon="checkmarkCircle" class="text-emerald-500 text-xl mt-0.5" />
          <div>
            <p class="font-medium text-gray-800">POPIA compliant by design</p>
            <p class="text-sm text-gray-500">Built with South African privacy law in mind</p>
          </div>
        </div>
      </div>

      <button
        class="w-full max-w-xs bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors active:scale-95"
        @click="nextStep"
      >
        Continue
      </button>
    </div>

    <!-- Step 3: Permissions -->
    <div v-else-if="currentStep === 2" class="flex-1 flex flex-col px-8 py-12">
      <h1 class="text-2xl font-bold text-gray-800 text-center mb-2">
        We need a few permissions
      </h1>
      <p class="text-gray-500 text-center mb-8">
        To protect you from spam calls
      </p>

      <div class="space-y-4 mb-8">
        <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <IonIcon :icon="call" class="text-primary text-xl" />
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-800">Phone</p>
            <p class="text-sm text-gray-500">To identify incoming calls</p>
          </div>
          <button
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="permissions.phone ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
            @click="requestPermission('phone')"
          >
            {{ permissions.phone ? 'Granted' : 'Grant' }}
          </button>
        </div>

        <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <IonIcon :icon="call" class="text-primary text-xl" />
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-800">Call Log</p>
            <p class="text-sm text-gray-500">To show your call history</p>
          </div>
          <button
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="permissions.callLog ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
            @click="requestPermission('callLog')"
          >
            {{ permissions.callLog ? 'Granted' : 'Grant' }}
          </button>
        </div>

        <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
          <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <IonIcon :icon="lockClosed" class="text-gray-500 text-xl" />
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-800">Contacts <span class="text-gray-400">(Optional)</span></p>
            <p class="text-sm text-gray-500">To show contact names locally</p>
          </div>
          <button
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="permissions.contacts ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
            @click="requestPermission('contacts')"
          >
            {{ permissions.contacts ? 'Granted' : 'Skip' }}
          </button>
        </div>

        <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <IonIcon :icon="notifications" class="text-primary text-xl" />
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-800">Notifications</p>
            <p class="text-sm text-gray-500">For spam alerts</p>
          </div>
          <button
            class="px-4 py-2 rounded-lg font-medium transition-colors"
            :class="permissions.notifications ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'"
            @click="requestPermission('notifications')"
          >
            {{ permissions.notifications ? 'Granted' : 'Grant' }}
          </button>
        </div>
      </div>

      <div class="mt-auto">
        <button
          class="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors active:scale-95"
          @click="grantAllPermissions"
        >
          Grant Permissions
        </button>
      </div>
    </div>

    <!-- Step 4: Ready -->
    <div v-else class="flex-1 flex flex-col items-center justify-center px-8 py-12">
      <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <IonIcon :icon="checkmarkCircle" class="text-emerald-500 text-5xl" />
      </div>

      <h1 class="text-2xl font-bold text-gray-800 text-center mb-4">
        You're all set!
      </h1>

      <p class="text-gray-500 text-center mb-4">
        CallShield is now protecting you from spam calls
      </p>

      <div class="bg-blue-50 p-4 rounded-xl mb-12 max-w-sm">
        <p class="text-blue-700 text-sm text-center">
          We're downloading the spam database for offline protection. This only happens once.
        </p>
      </div>

      <button
        class="w-full max-w-xs bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-95"
        @click="completeOnboarding"
      >
        Start Using CallShield
        <IonIcon :icon="chevronForward" class="text-xl" />
      </button>
    </div>

    <!-- Page indicators -->
    <div class="flex justify-center gap-2 pb-8">
      <button
        v-for="i in totalSteps"
        :key="i"
        class="w-2 h-2 rounded-full transition-colors"
        :class="currentStep === i - 1 ? 'bg-primary' : 'bg-gray-300'"
        @click="currentStep = i - 1"
      />
    </div>
  </div>
</template>
