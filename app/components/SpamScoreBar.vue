<script setup lang="ts">

defineProps<{
  score: number;
  label?: string;
}>();
</script>

<template>
  <div class="mt-3">
    <div class="flex justify-between text-sm mb-1">
      <span class="text-secondary">{{ label || 'Spam Score' }}</span>
      <span class="font-medium">{{ score }}%</span>
    </div>
    <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full transition-all"
        :class="{
          'bg-green-500': score < 30,
          'bg-amber-500': score >= 30 && score < 70,
          'bg-red-500': score >= 70
        }"
        :style="{ width: `${score}%` }"
      />
    </div>
  </div>
</template>
