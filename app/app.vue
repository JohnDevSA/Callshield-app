<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonApp } from '@ionic/vue';

const appStore = useAppStore();
const route = useRoute();

const showSplash = ref(true);
const isReady = ref(false);

onMounted(async () => {
  // Initialize app
  await appStore.initializeApp();

  // Check if onboarding is complete
  const onboardingComplete = localStorage.getItem('callshield_onboarding_complete');

  // Hide splash after a brief delay
  setTimeout(() => {
    showSplash.value = false;
    isReady.value = true;

    // Redirect to onboarding if not complete (and not already there)
    if (!onboardingComplete && route.path !== '/onboarding') {
      navigateTo('/onboarding');
    }
  }, 1500);
});
</script>

<template>
  <IonApp>
    <!-- Splash screen -->
    <SplashScreen v-if="showSplash" :loading="true" />

    <!-- Toast notifications -->
    <ToastContainer />

    <!-- Main app content -->
    <NuxtLayout v-if="isReady">
      <NuxtPage />
    </NuxtLayout>
  </IonApp>
</template>