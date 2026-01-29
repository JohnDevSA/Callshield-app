# CallShield Design Patterns

Consistent UI/UX patterns used across the app. Follow these when building new features or pages.

## Page Structure

Every page follows this structure:

```vue
<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
// Only import from @ionic/vue and ionicons - composables/stores are auto-imported

useHead({ title: 'Page Title - CallShield' });
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Page Title</IonTitle>
        <!-- Optional: slot="end" for action buttons -->
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <!-- Optional: Pull-to-refresh -->
      <!-- Content sections with p-4 / px-4 spacing -->
    </IonContent>
  </IonPage>
</template>
```

## Pull-to-Refresh

```vue
<IonRefresher slot="fixed" @ionRefresh="handleRefresh">
  <IonRefresherContent />
</IonRefresher>
```

```ts
async function handleRefresh(event: CustomEvent) {
  await store.loadData();
  (event.target as HTMLIonRefresherElement).complete();
}
```

## Card Pattern

The `.card` class provides the standard card surface:

```html
<div class="card">
  <!-- Content with default 16px padding -->
</div>
```

For stat cards in a grid:

```html
<div class="px-4 grid grid-cols-3 gap-3">
  <div class="card text-center">
    <div class="text-xl font-bold text-primary">{{ value }}</div>
    <div class="text-xs text-secondary">Label</div>
  </div>
</div>
```

For list item cards:

```html
<div class="card flex items-center gap-3">
  <!-- Icon (left) -->
  <IonIcon :icon="iconName" />
  <!-- Content (middle, flex-1) -->
  <div class="flex-1 min-w-0">
    <div class="font-medium truncate">Title</div>
    <div class="text-xs text-secondary">Subtitle</div>
  </div>
  <!-- Metadata (right) -->
  <div class="text-right text-xs text-secondary whitespace-nowrap">
    Extra info
  </div>
</div>
```

## Empty State

Show when a list has no items:

```html
<div class="text-center py-12 text-secondary">
  <IonIcon :icon="relevantIcon" class="text-5xl mb-3 opacity-50" />
  <p>Primary message</p>
  <p class="text-sm">Helper text explaining what will appear</p>
</div>
```

## Loading State

```html
<div v-if="isLoading" class="flex justify-center py-12">
  <IonSpinner name="crescent" />
</div>
```

## Classification Badge

Color-coded pill showing caller classification:

```html
<div
  class="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
  :class="{
    'bg-green-100 text-green-700': classification === 'verified' || classification === 'safe',
    'bg-red-100 text-red-700': classification === 'high_spam',
    'bg-amber-100 text-amber-700': classification === 'low_spam',
    'bg-gray-100 text-gray-600': classification === 'unknown' || classification === 'blocked',
    'bg-blue-100 text-blue-700': classification === 'contact'
  }"
>
  <IonIcon :icon="classificationIcon" />
  {{ classificationLabel }}
</div>
```

## Classification Icon Circle

Used in list items for visual classification:

```html
<div
  class="w-10 h-10 rounded-full flex items-center justify-center"
  :class="{
    'bg-green-100 text-green-600': classification === 'verified' || classification === 'safe',
    'bg-red-100 text-red-600': classification === 'high_spam',
    'bg-amber-100 text-amber-600': classification === 'low_spam',
    'bg-blue-100 text-blue-600': classification === 'contact',
    'bg-gray-100 text-gray-500': classification === 'unknown'
  }"
>
  <IonIcon :icon="getCallIcon(classification)" />
</div>
```

## Phone Number Display

Always use `font-mono` for phone numbers:

```html
<div class="font-mono font-medium">
  {{ formatPhoneNumber(phoneNumber) }}
</div>
```

`formatPhoneNumber` is auto-imported and outputs: `0XX XXX XXXX`

## Confirmation Alerts

Use Ionic's alertController for destructive actions:

```ts
import { alertController } from '@ionic/vue';

async function confirmAction() {
  const alert = await alertController.create({
    header: 'Action Title',
    message: 'Are you sure you want to do this?',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Confirm',
        role: 'destructive',
        handler: async () => {
          await performAction();
        }
      }
    ]
  });
  await alert.present();
}
```

## Search Pattern

Real-time filtering with IonSearchbar:

```html
<div class="px-4">
  <IonSearchbar v-model="searchQuery" placeholder="Search..." />
</div>
```

```ts
const searchQuery = ref('');
const filteredItems = computed(() => {
  return store.searchItems(searchQuery.value);
});
```

## Progress/Score Bar

For displaying spam scores or progress:

```html
<div class="mt-3">
  <div class="flex justify-between text-sm mb-1">
    <span class="text-secondary">Label</span>
    <span class="font-medium">{{ value }}%</span>
  </div>
  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
    <div
      class="h-full rounded-full transition-all"
      :class="{
        'bg-green-500': value < 30,
        'bg-amber-500': value >= 30 && value < 70,
        'bg-red-500': value >= 70
      }"
      :style="{ width: `${value}%` }"
    />
  </div>
</div>
```

## Hero/Status Card (Gradient)

For prominent status displays:

```html
<div class="p-4">
  <div class="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white">
    <div class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <IonIcon :icon="shieldCheckmark" class="text-lg" />
          <span class="font-medium text-blue-100">Status Label</span>
        </div>
        <div class="text-3xl font-bold mb-1">{{ mainValue }}</div>
        <div class="text-sm text-blue-200">description</div>
      </div>
      <div class="text-right text-sm text-blue-200">
        <!-- Secondary info -->
      </div>
    </div>
  </div>
</div>
```

## Settings Section

Group related settings in bordered lists:

```html
<div class="mx-4 mb-4">
  <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
    Section Title
  </p>
  <IonList lines="none" class="rounded-xl overflow-hidden">
    <IonItem>
      <IonIcon :icon="iconName" slot="start" color="primary" />
      <IonLabel>Setting Name</IonLabel>
      <IonToggle v-model="settingsStore.settingName" slot="end" />
    </IonItem>
  </IonList>
</div>
```

## Network/Alert Banner

Inline alert for status messages:

```html
<div class="mx-4 mb-3 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm flex items-center gap-2">
  <IonIcon :icon="alertCircle" />
  Alert message text
</div>
```

## Date/Time Formatting

```ts
// Time (24h format)
function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Relative date
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

// Full date
function formatFullDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
```

## Action Buttons

For primary actions (full width):

```html
<IonButton expand="block" color="danger" @click="action">
  <IonIcon :icon="iconName" slot="start" />
  Button Label
</IonButton>
```

For secondary/outline actions in a grid:

```html
<div class="grid grid-cols-2 gap-2 mt-4">
  <IonButton expand="block" fill="outline" color="success" @click="markSafe">
    <IonIcon :icon="checkmarkCircle" slot="start" />
    Safe
  </IonButton>
  <IonButton expand="block" fill="outline" color="danger" @click="markSpam">
    <IonIcon :icon="alertCircle" slot="start" />
    Spam
  </IonButton>
</div>
```

## Auto-Blocked Badge

Small inline indicator:

```html
<div
  v-if="item.autoBlocked"
  class="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs flex items-center gap-1"
>
  <IonIcon :icon="flash" />
  Auto
</div>
```

## Spacing Conventions

- **Page padding**: `p-4` (16px all sides) or `px-4` (16px horizontal)
- **Section gaps**: `mb-2` to `mb-4` between sections
- **List item gaps**: `space-y-2` for card lists
- **Stat grid gaps**: `gap-3`
- **Inner card content**: Inherits from `.card` (16px padding)
- **Empty state vertical padding**: `py-12`
