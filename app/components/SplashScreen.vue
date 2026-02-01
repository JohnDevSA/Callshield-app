<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { shield } from 'ionicons/icons';

defineProps<{
  loading?: boolean;
}>();
</script>

<template>
  <div class="fixed inset-0 bg-gradient-to-b from-primary to-blue-700 flex flex-col items-center justify-center z-50">
    <!-- Logo -->
    <div class="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mb-6 animate-pulse-slow">
      <IonIcon :icon="shield" class="text-white text-5xl" />
    </div>

    <!-- App name -->
    <h1 class="text-3xl font-bold text-white mb-2">CallShield</h1>

    <!-- Tagline -->
    <p class="text-blue-200 text-center px-8 mb-12">
      Protecting South Africa<br />from spam calls
    </p>

    <!-- Loading indicator -->
    <div v-if="loading" class="flex gap-2">
      <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce-1" />
      <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce-2" />
      <div class="w-2 h-2 bg-white/60 rounded-full animate-bounce-3" />
    </div>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.animate-bounce-1 {
  animation: bounce 1s ease-in-out infinite;
}

.animate-bounce-2 {
  animation: bounce 1s ease-in-out infinite 0.1s;
}

.animate-bounce-3 {
  animation: bounce 1s ease-in-out infinite 0.2s;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
