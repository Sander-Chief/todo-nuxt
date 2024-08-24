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
    devOptions: {
      enabled: true,
      type: 'module'
    },
    filename: 'sw.js',
    injectRegister: false,
    strategies: 'injectManifest',
    srcDir: './service-worker',
  },
  ssr: false,
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import '~/assets/less/constants.less';`,
        }
      }
    }
  }
});
