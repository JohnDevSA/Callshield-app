// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // SPA mode for Capacitor
  ssr: false,

  devtools: { enabled: true },

  // Modules
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint'
  ],

    // Components auto-import configuration
    components: [
        {
            path: '~/components',
            pathPrefix: false, // Don't prefix component names with folder path
        },
    ],

  // Pinia auto-import stores
  pinia: {
    storesDirs: ['./stores/**']
  },

  // App configuration
  app: {
    head: {
      title: 'CallShield',
      charset: 'utf-8',
      viewport: 'viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no',
      meta: [
        { name: 'description', content: 'Privacy-first caller ID and spam protection for South Africa' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'msapplication-tap-highlight', content: 'no' },
        { name: 'theme-color', content: '#2563EB' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // Preload fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap' }
      ]
    }
  },

  // CSS
  css: [
    // Ionic core CSS (minimal - we use selectively)
    '@ionic/vue/css/core.css',
    '@ionic/vue/css/normalize.css',
    // Our custom CSS
    '~/assets/css/main.css'
  ],

  // Build configuration for Capacitor
  nitro: {
    preset: 'static',
    output: {
      dir: 'dist',
      publicDir: 'dist'
    }
  },

  // Vite configuration
  vite: {
    // Optimize Ionic/Ionicons
    optimizeDeps: {
      include: ['@ionic/vue', 'ionicons']
    }
  },

  // TypeScript
  typescript: {
    strict: true,
    typeCheck: false // Disable for now, enable in CI
  },

  // Runtime config
  runtimeConfig: {
    public: {
      appVersion: '0.1.0',
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || ''
    }
  }
})