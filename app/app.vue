<script setup lang="ts">
import { IonApp } from '@ionic/vue';

const appStore = useAppStore();

onMounted(async () => {
  await appStore.initializeApp();
});
</script>

<template>
  <IonApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </IonApp>
</template>