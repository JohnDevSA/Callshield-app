<script setup lang="ts">

defineProps<{
  value: number | string;
  label: string;
  color?: 'primary' | 'danger' | 'warning' | 'success';
}>();
</script>

<template>
  <div class="card text-center">
    <div
      class="text-xl font-bold"
      :class="{
        'text-primary': color === 'primary',
        'text-red-500': color === 'danger',
        'text-amber-500': color === 'warning',
        'text-green-500': color === 'success'
      }"
    >
      {{ value }}
    </div>
    <div class="text-xs text-secondary">{{ label }}</div>
  </div>
</template>
