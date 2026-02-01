<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import {
  checkmarkCircle,
  alertCircle,
  warning,
  informationCircle,
  close
} from 'ionicons/icons';
import { useToast, type ToastType } from '~/composables/useToast';

const { toasts, remove } = useToast();

function getIcon(type: ToastType) {
  switch (type) {
    case 'success':
      return checkmarkCircle;
    case 'error':
      return alertCircle;
    case 'warning':
      return warning;
    default:
      return informationCircle;
  }
}

function getStyles(type: ToastType) {
  switch (type) {
    case 'success':
      return 'bg-emerald-500 text-white';
    case 'error':
      return 'bg-red-500 text-white';
    case 'warning':
      return 'bg-amber-500 text-white';
    default:
      return 'bg-gray-800 text-white';
  }
}
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 flex flex-col items-center gap-2 p-4 pointer-events-none safe-area-top">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 max-w-sm w-full pointer-events-auto"
        :class="getStyles(toast.type)"
      >
        <IonIcon :icon="getIcon(toast.type)" class="text-xl flex-shrink-0" />
        <span class="flex-1 text-sm font-medium">{{ toast.message }}</span>
        <button
          class="p-1 hover:bg-white/20 rounded-full transition-colors"
          @click="remove(toast.id)"
        >
          <IonIcon :icon="close" class="text-lg" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.safe-area-top {
  padding-top: max(env(safe-area-inset-top, 0px), 16px);
}

.toast-enter-active {
  animation: toastIn 0.3s ease-out;
}

.toast-leave-active {
  animation: toastOut 0.2s ease-in;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toastOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}
</style>
