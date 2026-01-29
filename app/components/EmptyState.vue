<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

defineProps<{
  icon: string;
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="text-center py-12 text-secondary">
    <IonIcon :icon="icon" class="text-5xl mb-3 opacity-50" />
    <p>{{ title }}</p>
    <p v-if="subtitle" class="text-sm">{{ subtitle }}</p>
  </div>
</template>
