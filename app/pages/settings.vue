<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonToggle,
  IonSelect,
  IonSelectOption,
  IonNote
} from '@ionic/vue';
import {
  ban,
  notifications,
  wifi,
  chatbubble,
  moon,
  language,
  informationCircle,
  cloudDownload,
  shield,
  speedometer
} from 'ionicons/icons';

const settingsStore = useSettingsStore();
const appStore = useAppStore();

onMounted(async () => {
  await settingsStore.loadSettings();
});

useHead({
  title: 'Settings - CallShield'
});
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Settings</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent :fullscreen="true">
      <!-- Call Protection -->
      <div class="px-4 pt-4 pb-2">
        <h2 class="text-sm font-semibold text-secondary uppercase tracking-wide">
          Call Protection
        </h2>
      </div>

      <IonList lines="none" class="mx-4 rounded-xl overflow-hidden mb-4">
        <IonItem>
          <IonIcon :icon="ban" slot="start" color="danger" />
          <IonLabel>
            <h3>Auto-Block Spam</h3>
            <p>Automatically block high-confidence spam</p>
          </IonLabel>
          <IonToggle
            slot="end"
            :checked="settingsStore.settings.autoBlockSpam"
            @ionChange="settingsStore.toggleSetting('autoBlockSpam')"
          />
        </IonItem>

        <IonItem v-if="settingsStore.settings.autoBlockSpam">
          <IonIcon :icon="speedometer" slot="start" color="warning" />
          <IonLabel>
            <h3>Block Threshold</h3>
          </IonLabel>
          <IonSelect
            slot="end"
            :value="settingsStore.settings.autoBlockThreshold"
            interface="popover"
            @ionChange="(e: CustomEvent) => settingsStore.setSetting('autoBlockThreshold', e.detail.value)"
          >
            <IonSelectOption :value="60">60%</IonSelectOption>
            <IonSelectOption :value="70">70%</IonSelectOption>
            <IonSelectOption :value="80">80%</IonSelectOption>
            <IonSelectOption :value="90">90%</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonIcon :icon="shield" slot="start" color="primary" />
          <IonLabel>
            <h3>Caller ID Overlay</h3>
            <p>Show caller info during calls</p>
          </IonLabel>
          <IonToggle
            slot="end"
            :checked="settingsStore.settings.showCallOverlay"
            @ionChange="settingsStore.toggleSetting('showCallOverlay')"
          />
        </IonItem>

        <IonItem>
          <IonIcon :icon="chatbubble" slot="start" color="success" />
          <IonLabel>
            <h3>Post-Call Prompt</h3>
            <p>Ask to report unknown callers</p>
          </IonLabel>
          <IonToggle
            slot="end"
            :checked="settingsStore.settings.postCallPrompt"
            @ionChange="settingsStore.toggleSetting('postCallPrompt')"
          />
        </IonItem>
      </IonList>

      <!-- Data & Sync -->
      <div class="px-4 pt-2 pb-2">
        <h2 class="text-sm font-semibold text-secondary uppercase tracking-wide">
          Data & Sync
        </h2>
      </div>

      <IonList lines="none" class="mx-4 rounded-xl overflow-hidden mb-4">
        <IonItem>
          <IonIcon :icon="wifi" slot="start" color="primary" />
          <IonLabel>
            <h3>Wi-Fi Only Sync</h3>
            <p>Only sync on Wi-Fi</p>
          </IonLabel>
          <IonToggle
            slot="end"
            :checked="settingsStore.settings.wifiOnlySync"
            @ionChange="settingsStore.toggleSetting('wifiOnlySync')"
          />
        </IonItem>

        <IonItem button @click="appStore.syncDatabase">
          <IonIcon :icon="cloudDownload" slot="start" color="tertiary" />
          <IonLabel>
            <h3>Sync Database Now</h3>
            <p v-if="appStore.syncStatus.lastSync">
              Last: {{ new Date(appStore.syncStatus.lastSync).toLocaleString() }}
            </p>
            <p v-else>Never synced</p>
          </IonLabel>
        </IonItem>
      </IonList>

      <!-- Notifications -->
      <div class="px-4 pt-2 pb-2">
        <h2 class="text-sm font-semibold text-secondary uppercase tracking-wide">
          Notifications
        </h2>
      </div>

      <IonList lines="none" class="mx-4 rounded-xl overflow-hidden mb-4">
        <IonItem>
          <IonIcon :icon="notifications" slot="start" color="warning" />
          <IonLabel>
            <h3>Push Notifications</h3>
            <p>Alerts for blocked calls</p>
          </IonLabel>
          <IonToggle
            slot="end"
            :checked="settingsStore.settings.enableNotifications"
            @ionChange="settingsStore.toggleSetting('enableNotifications')"
          />
        </IonItem>
      </IonList>

      <!-- Appearance -->
      <div class="px-4 pt-2 pb-2">
        <h2 class="text-sm font-semibold text-secondary uppercase tracking-wide">
          Appearance
        </h2>
      </div>

      <IonList lines="none" class="mx-4 rounded-xl overflow-hidden mb-4">
        <IonItem>
          <IonIcon :icon="moon" slot="start" color="medium" />
          <IonLabel>Theme</IonLabel>
          <IonSelect
            slot="end"
            :value="settingsStore.settings.darkMode"
            interface="popover"
            @ionChange="(e: CustomEvent) => settingsStore.setSetting('darkMode', e.detail.value)"
          >
            <IonSelectOption value="system">System</IonSelectOption>
            <IonSelectOption value="light">Light</IonSelectOption>
            <IonSelectOption value="dark">Dark</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonIcon :icon="language" slot="start" color="tertiary" />
          <IonLabel>Language</IonLabel>
          <IonSelect
            slot="end"
            :value="settingsStore.settings.language"
            interface="action-sheet"
            @ionChange="(e: CustomEvent) => settingsStore.setSetting('language', e.detail.value)"
          >
            <IonSelectOption
              v-for="lang in settingsStore.availableLanguages"
              :key="lang.code"
              :value="lang.code"
            >
              {{ lang.name }}
            </IonSelectOption>
          </IonSelect>
        </IonItem>
      </IonList>

      <!-- About -->
      <div class="px-4 pt-2 pb-2">
        <h2 class="text-sm font-semibold text-secondary uppercase tracking-wide">
          About
        </h2>
      </div>

      <IonList lines="none" class="mx-4 rounded-xl overflow-hidden mb-8">
        <IonItem>
          <IonIcon :icon="informationCircle" slot="start" color="primary" />
          <IonLabel>Version</IonLabel>
          <IonNote slot="end">{{ appStore.appVersion }}</IonNote>
        </IonItem>

        <IonItem button>
          <IonLabel>
            <h3>Privacy Policy</h3>
            <p>POPIA compliant</p>
          </IonLabel>
        </IonItem>

        <IonItem button>
          <IonLabel>Terms of Service</IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
</template>