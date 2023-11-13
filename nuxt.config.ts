// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: [
    {
      path: '~/components',
      extensions: ['.vue']
    }
  ],
  modules: [
    '@pinia/nuxt',
    '@vite-pwa/nuxt'
  ],
  pwa: {
    // client: {
    //   installPrompt: true,
    //   registerPlugin: true,
    //   periodicSyncForUpdates: 10,
    // },
    devOptions: {
      enabled: true,
      // navigateFallback: '/',
      type: 'module'
    },
    filename: 'sw.js',
    injectRegister: false,
    // manifest: false,
    strategies: 'injectManifest',
    srcDir: './service-worker',
    // workbox: {
    //   importScripts: [
    //     'sw.js'
    //   ],
      // navigateFallback: '/',
    // }
  },
  ssr: false
});
