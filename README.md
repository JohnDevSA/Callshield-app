# CallShield

Privacy-first caller ID and spam protection app for South Africa.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3, SPA mode)
- **Mobile**: [Capacitor](https://capacitorjs.com/) (Android & iOS)
- **UI Components**: [Ionic Vue](https://ionicframework.com/docs/vue/overview) (selective usage)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Offline Database**: [Dexie.js](https://dexie.org/) (IndexedDB wrapper)
- **Package Manager**: pnpm

## Features

- Caller ID lookup (offline + online)
- Spam call detection and blocking
- Call history with classification
- POPIA-compliant privacy architecture
- 11 South African language support
- Works offline with local database

## Project Structure

```
callshield/
├── app/                    # Nuxt app entry
│   └── app.vue
├── assets/
│   └── css/
│       └── main.css        # Global styles
├── components/             # Vue components
├── composables/
│   └── useDatabase.ts      # Dexie database composable
├── docs/
│   └── NATIVE_PLUGINS.md   # Native plugin documentation
├── layouts/
│   └── default.vue         # Tab-based layout
├── pages/                  # Nuxt pages (file-based routing)
│   ├── index.vue           # Home (call history)
│   ├── lookup.vue          # Number lookup
│   ├── blocked.vue         # Blocked numbers
│   └── settings.vue        # App settings
├── plugins/
│   ├── ionic.client.ts     # Ionic Vue setup
│   └── capacitor.client.ts # Capacitor initialization
├── public/                 # Static assets
├── stores/                 # Pinia stores
│   ├── app.ts              # App state & Capacitor
│   ├── calls.ts            # Call history
│   ├── blocked.ts          # Blocked numbers
│   └── settings.ts         # User settings
├── types/
│   └── index.ts            # TypeScript definitions
├── capacitor.config.ts     # Capacitor configuration
├── nuxt.config.ts          # Nuxt configuration
└── package.json
```

## Setup

### Prerequisites

- Node.js 20+
- pnpm 10+
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
# Start Nuxt dev server
pnpm dev

# The app runs at http://localhost:3000
```

### Build for Production

```bash
# Generate static SPA
pnpm generate

# Preview production build
pnpm preview
```

## Mobile Development

### Initial Capacitor Setup

After first install, add native platforms:

```bash
# Add Android platform
pnpm cap:add:android

# Add iOS platform (macOS only)
pnpm cap:add:ios
```

### Build & Sync

```bash
# Build web app and sync to native projects
pnpm mobile:build

# Or separately:
pnpm generate      # Build Nuxt
pnpm cap:sync      # Sync to native
```

### Open in IDE

```bash
# Open Android Studio
pnpm cap:open:android

# Open Xcode
pnpm cap:open:ios
```

### Run on Device

```bash
# Run on connected Android device
pnpm cap:run:android

# Run on iOS simulator/device
pnpm cap:run:ios
```

## Native Plugins

CallShield uses Capacitor plugins for native functionality:

| Plugin | Purpose |
|--------|---------|
| `@capacitor/app` | App lifecycle |
| `@capacitor/network` | Network status |
| `@capacitor/local-notifications` | Blocked call alerts |
| `@capacitor/push-notifications` | Server notifications |
| `@capacitor/preferences` | Local storage |
| `@capacitor/status-bar` | Status bar styling |
| `@capawesome/capacitor-background-task` | Background processing |

### Call Detection

Call detection requires custom native code. See [docs/NATIVE_PLUGINS.md](docs/NATIVE_PLUGINS.md) for:
- Android CallScreeningService implementation
- iOS CallKit / Call Directory Extension
- Required permissions

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for SSR (not used) |
| `pnpm generate` | Generate static SPA |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm mobile:build` | Build and sync to mobile |
| `pnpm cap:sync` | Sync web to native |
| `pnpm cap:open:android` | Open Android Studio |
| `pnpm cap:open:ios` | Open Xcode |

## Environment Variables

Create `.env` file:

```env
# API base URL (for backend integration)
NUXT_PUBLIC_API_BASE_URL=https://api.callshield.co.za
```

## Database

CallShield uses Dexie.js (IndexedDB) for offline-first data storage:

- **phoneNumbers**: Spam database (synced from server)
- **callHistory**: Local call records
- **blockedNumbers**: User-blocked numbers
- **settings**: User preferences

See `composables/useDatabase.ts` for the schema.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run `pnpm lint` and `pnpm typecheck`
5. Submit a pull request

## License

Proprietary - All rights reserved.

## Related

- [API Documentation](../callshield-api) - Backend API (separate repo)
- [Market Research](sa_caller_id_market_research.md) - SA market analysis
- [UI Wireframes](ui_wireframes.md) - Design specifications