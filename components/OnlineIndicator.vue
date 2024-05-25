<script setup>
  import { ref } from 'vue';

  const isOnline = ref(true);

  window?.addEventListener('online', () => {
    isOnline.value = true;
  });

  window?.addEventListener('offline', () => {
    isOnline.value = false;
  });
</script>

<template>
  <div
    class="online-indicator"
    :class="{ 'offline': !isOnline }"
  ></div>
</template>

<style scoped>
  .online-indicator {
    position: absolute;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: green;

    &.offline {
      background-color: red;
    }
  }
</style>
