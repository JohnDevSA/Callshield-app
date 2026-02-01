<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { checkmarkCircle, alertCircle, close } from 'ionicons/icons';
import { formatPhoneNumber } from '~/composables/useDatabase';

const props = defineProps<{
  phoneNumber: string;
}>();

const emit = defineEmits<{
  safe: [];
  spam: [];
  dismiss: [];
}>();
</script>

<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
    <div class="bg-white w-full rounded-t-3xl p-6 pb-10 animate-slide-up">
      <!-- Drag handle -->
      <div class="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

      <!-- Title -->
      <h2 class="text-xl font-bold text-gray-800 text-center mb-2">
        How was that call?
      </h2>

      <!-- Phone number -->
      <p class="text-gray-500 text-center mb-6 font-mono">
        {{ formatPhoneNumber(phoneNumber) }}
      </p>

      <!-- Safe/Spam buttons -->
      <div class="flex gap-3 mb-4">
        <button
          class="flex-1 py-4 bg-emerald-50 hover:bg-emerald-100 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 border-transparent hover:border-emerald-200 active:scale-95"
          @click="emit('safe')"
        >
          <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <IonIcon :icon="checkmarkCircle" class="text-emerald-600 text-2xl" />
          </div>
          <span class="text-emerald-700 font-semibold">Safe</span>
        </button>

        <button
          class="flex-1 py-4 bg-red-50 hover:bg-red-100 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 border-transparent hover:border-red-200 active:scale-95"
          @click="emit('spam')"
        >
          <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <IonIcon :icon="alertCircle" class="text-red-600 text-2xl" />
          </div>
          <span class="text-red-700 font-semibold">Spam</span>
        </button>
      </div>

      <!-- Dismiss button -->
      <button
        class="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
        @click="emit('dismiss')"
      >
        Dismiss
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
