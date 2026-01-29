# CallShield Project Commands

Reference for all available project commands and workflows.

## Development

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Nuxt dev server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm generate` | Generate static SPA to `dist/` |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript type checking |

## Mobile (Capacitor)

| Command | Description |
|---------|-------------|
| `pnpm mobile:build` | Build SPA + sync to native platforms |
| `pnpm mobile:android` | Build + open Android Studio |
| `pnpm mobile:ios` | Build + open Xcode |
| `pnpm cap:sync` | Sync web assets to native |
| `pnpm cap:run:android` | Run on connected Android device |
| `pnpm cap:run:ios` | Run on iOS simulator |
| `pnpm cap:open:android` | Open project in Android Studio |
| `pnpm cap:open:ios` | Open project in Xcode |

## Project Structure

```
app/
├── assets/css/main.css        # Design system & global styles
├── composables/               # Auto-imported composables
│   ├── useDatabase.ts         # Dexie DB + phone formatting
│   └── useMockData.ts         # Mock data for development
├── layouts/default.vue        # Tab navigation layout
├── pages/                     # File-based routing
│   ├── index.vue              # Home (call history)
│   ├── lookup.vue             # Phone number lookup
│   ├── blocked.vue            # Blocked numbers list
│   └── settings.vue           # User settings
├── plugins/
│   ├── ionic.client.ts        # Ionic Vue setup
│   └── capacitor.client.ts    # DB init + mock data seeding
└── stores/                    # Pinia stores (auto-imported)
    ├── app.ts                 # App state, platform, sync
    ├── calls.ts               # Call history, lookups
    ├── blocked.ts             # Blocked number management
    └── settings.ts            # User preferences
types/index.ts                 # Shared TypeScript interfaces
```

## Tech Stack

- **Nuxt 4** (SPA mode, `ssr: false`)
- **Vue 3** (Composition API, `<script setup>`)
- **Capacitor 7** (Android & iOS)
- **Ionic Vue 8.5** (UI components)
- **Pinia 3** (state management)
- **Dexie 4** (IndexedDB / offline database)
- **Tailwind CSS** (utility-first styling)
- **TypeScript** (strict mode)
- **pnpm** (package manager)

## Auto-Imports (No explicit imports needed)

- **Composables**: `useDatabase()`, `useMockData()`, `formatPhoneNumber()`, `normalizePhoneNumber()`
- **Stores**: `useAppStore()`, `useCallsStore()`, `useBlockedStore()`, `useSettingsStore()`
- **Vue**: `ref`, `computed`, `onMounted`, `watch`, etc.
- **Nuxt**: `useHead()`, `navigateTo()`, `useRoute()`, `useRouter()`
- **Components**: Any `.vue` file in `app/components/` (no path prefix)

## Locale & Region

- **Locale**: `en-ZA` (South African English)
- **Phone format**: `0XX XXX XXXX` (South African)
- **Date format**: `D MMM YYYY`
- **Time format**: 24-hour `HH:mm`
- **Languages**: 11 official SA languages supported
