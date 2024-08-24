<script setup>
async function registerSync() {
  const registration = await navigator.serviceWorker.ready;

  try {
    window.addEventListener('online', () => {
      registration.sync.register('sync-todos');
    });
  } catch(e) {
    console.error('Sync registration failed');
  }
};

useHead({
  title: 'Todo App',
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1'
    },
    {
      name: 'description',
      content: 'Nuxt 3 Todo App'
    },
    {
      name: 'theme-color',
      content: '#fff'
    }
  ],
  link: [
    {
      name: 'icon',
      content: '/favicon.ico'
    }
  ]
});

registerSync();
</script>

<template>
  <NuxtPage />
</template>

<style lang="less">
  body {
    margin: 0;
    padding: 0;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: @backgroundColor;
    color: @textColor;

    #__nuxt {
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      padding: 20px;

      h1 {
        font-weight: bold;
        font-size: 28px;
        text-align: center;
      }

      button {
        cursor: pointer;
        background-color: @primaryColor;
        border: 1px solid @primaryColor;
        color: @secondTextColor;
        font-weight: bold;
        outline: none;
        border-radius: @size1;
      }
    }
  }
</style>
