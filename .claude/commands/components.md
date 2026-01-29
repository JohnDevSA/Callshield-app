# CallShield Component Patterns

Guidelines for creating and using components in this project.

## Component Organization

Components live in `app/components/` and are auto-imported by Nuxt (no import statements needed).
Prefix components with their domain for clarity.

## Ionic Vue Components (External)

These must be explicitly imported from `@ionic/vue`:

```ts
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonList, IonItem, IonLabel,
  IonToggle, IonSelect, IonSelectOption, IonNote,
  IonSearchbar, IonSpinner, IonRefresher, IonRefresherContent,
  alertController, toastController
} from '@ionic/vue';
```

Icons are imported from `ionicons/icons`:

```ts
import { call, ban, search, settings, home, alertCircle, checkmarkCircle, helpCircle, flash, time, shieldCheckmark, wifi, moon, language, notifications, speedometer, chatbubble, shield, cloudDownload, informationCircle } from 'ionicons/icons';
```

## Recommended Custom Components

When creating reusable components, follow these patterns:

### CallClassificationBadge

For displaying caller classification inline:

```vue
<!-- app/components/CallClassificationBadge.vue -->
<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { checkmarkCircle, alertCircle, helpCircle, call, ban } from 'ionicons/icons';
import type { SpamClassification } from '~/types';

const props = defineProps<{
  classification: SpamClassification;
  size?: 'sm' | 'md';
}>();

const classMap = {
  verified: { bg: 'bg-green-100 text-green-700', icon: checkmarkCircle, label: 'Verified' },
  safe: { bg: 'bg-green-100 text-green-700', icon: checkmarkCircle, label: 'Safe' },
  contact: { bg: 'bg-blue-100 text-blue-700', icon: call, label: 'Contact' },
  low_spam: { bg: 'bg-amber-100 text-amber-700', icon: alertCircle, label: 'Suspected Spam' },
  high_spam: { bg: 'bg-red-100 text-red-700', icon: alertCircle, label: 'Spam' },
  unknown: { bg: 'bg-gray-100 text-gray-600', icon: helpCircle, label: 'Unknown' },
  blocked: { bg: 'bg-gray-100 text-gray-600', icon: ban, label: 'Blocked' }
};

const config = computed(() => classMap[props.classification] || classMap.unknown);
</script>

<template>
  <div
    class="rounded-full flex items-center gap-1 font-medium"
    :class="[
      config.bg,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-4 py-2 text-sm'
    ]"
  >
    <IonIcon :icon="config.icon" />
    {{ config.label }}
  </div>
</template>
```

### CallListItem

For displaying a call record in a list:

```vue
<!-- app/components/CallListItem.vue -->
<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { call, checkmarkCircle, alertCircle, helpCircle } from 'ionicons/icons';
import type { CallRecord } from '~/types';

const props = defineProps<{
  record: CallRecord;
}>();

function getCallIcon(classification: string) {
  if (classification === 'verified' || classification === 'safe') return checkmarkCircle;
  if (classification === 'contact') return call;
  if (classification.includes('spam')) return alertCircle;
  return helpCircle;
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d >= today) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d >= yesterday) return 'Yesterday';
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}
</script>

<template>
  <div class="card flex items-center gap-3">
    <div
      class="w-10 h-10 rounded-full flex items-center justify-center"
      :class="{
        'bg-green-100 text-green-600': record.classification === 'verified' || record.classification === 'safe',
        'bg-red-100 text-red-600': record.classification === 'high_spam',
        'bg-amber-100 text-amber-600': record.classification === 'low_spam',
        'bg-blue-100 text-blue-600': record.classification === 'contact',
        'bg-gray-100 text-gray-500': record.classification === 'unknown'
      }"
    >
      <IonIcon :icon="getCallIcon(record.classification)" />
    </div>

    <div class="flex-1 min-w-0">
      <div class="font-medium truncate"
        :class="record.classification === 'high_spam' ? 'text-red-600' : ''"
      >
        {{ record.callerName || formatPhoneNumber(record.phoneNumber) }}
      </div>
      <div class="text-xs text-secondary flex items-center gap-1">
        <IonIcon :icon="call" />
        <span class="capitalize">{{ record.direction }}</span>
        <span v-if="record.duration">&middot; {{ Math.floor(record.duration / 60) }}m {{ record.duration % 60 }}s</span>
      </div>
    </div>

    <div class="text-right text-xs text-secondary whitespace-nowrap">
      <div>{{ formatTime(record.timestamp) }}</div>
      <div>{{ formatDate(record.timestamp) }}</div>
    </div>
  </div>
</template>
```

### SpamScoreBar

For displaying a spam confidence score:

```vue
<!-- app/components/SpamScoreBar.vue -->
<script setup lang="ts">

const props = defineProps<{
  score: number; // 0-100
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
```

### EmptyState

For consistent empty state displays:

```vue
<!-- app/components/EmptyState.vue -->
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
```

### StatCard

For stat display in grids:

```vue
<!-- app/components/StatCard.vue -->
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
```

## Component Conventions

1. **Script setup**: Always use `<script setup lang="ts">`
2. **Props**: Use `defineProps<T>()` with TypeScript interfaces
3. **Emits**: Use `defineEmits<T>()` with typed events
4. **No explicit imports** for composables, stores, or Vue utilities (auto-imported)
5. **Ionic imports**: Must be explicit from `@ionic/vue`
6. **Icon imports**: Must be explicit from `ionicons/icons`
7. **Types**: Import from `~/types` when needed
8. **Phone numbers**: Always display with `formatPhoneNumber()` and `font-mono` class
9. **Dates/Times**: Use `en-ZA` locale, 24-hour time format
10. **Classification colors**: Follow the classification color map consistently

## Types Reference

```typescript
type SpamClassification = 'verified' | 'contact' | 'safe' | 'unknown' | 'low_spam' | 'high_spam' | 'blocked';
type CallerCategory = 'business' | 'bank' | 'government' | 'delivery' | 'healthcare' | 'telecoms' | 'telemarketer' | 'debt_collector' | 'scam' | 'personal' | 'unknown';
type CallDirection = 'incoming' | 'outgoing' | 'missed';

interface CallRecord {
  id?: number;
  phoneNumber: string;
  normalizedNumber: string;
  callerName?: string;
  direction: CallDirection;
  timestamp: Date;
  duration?: number; // seconds
  classification: SpamClassification;
  spamScore?: number; // 0-100
  userFeedback?: 'safe' | 'spam';
  blocked?: boolean;
  notes?: string;
}

interface BlockedNumber {
  id?: number;
  phoneNumber: string;
  normalizedNumber: string;
  name?: string;
  blockedAt: Date;
  reason?: string;
  autoBlocked: boolean;
}

interface LookupResult {
  phoneNumber: string;
  found: boolean;
  name?: string;
  category?: CallerCategory;
  classification: SpamClassification;
  spamScore?: number;
  reportCount?: number;
  verifiedBusiness?: boolean;
  source: 'offline' | 'online' | 'contact';
}
```

## Store Usage (Auto-imported)

```ts
const appStore = useAppStore();       // Platform, sync, online status
const callsStore = useCallsStore();   // Call history, lookups
const blockedStore = useBlockedStore(); // Blocked numbers
const settingsStore = useSettingsStore(); // User preferences
```

## File Naming

- Components: `PascalCase.vue` (e.g., `CallListItem.vue`, `SpamScoreBar.vue`)
- Composables: `camelCase.ts` with `use` prefix (e.g., `useDatabase.ts`)
- Stores: `camelCase.ts` (e.g., `calls.ts`, `blocked.ts`)
- Pages: `kebab-case.vue` (e.g., `index.vue`, `blocked.vue`)
