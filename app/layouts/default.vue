<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { home, search, ban, settings } from 'ionicons/icons';

const route = useRoute();

const tabs = [
  { path: '/', label: 'Calls', icon: home },
  { path: '/lookup', label: 'Lookup', icon: search },
  { path: '/blocked', label: 'Blocked', icon: ban },
  { path: '/settings', label: 'Settings', icon: settings }
];
</script>

<template>
  <div class="flex flex-col h-screen">
    <div class="flex-1 overflow-auto">
      <slot />
    </div>

    <!-- Custom tab bar (Ionic IonTabBar requires IonTabs which conflicts with Nuxt routing) -->
    <nav class="flex border-t border-gray-200 bg-white safe-area-bottom">
      <button
        v-for="tab in tabs"
        :key="tab.path"
        class="flex-1 flex flex-col items-center py-2 px-1 text-xs transition-colors"
        :class="route.path === tab.path ? 'text-primary' : 'text-gray-400'"
        @click="navigateTo(tab.path)"
      >
        <IonIcon :icon="tab.icon" class="text-xl mb-0.5" />
        <span>{{ tab.label }}</span>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
</style>