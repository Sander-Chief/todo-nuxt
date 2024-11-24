<script setup lang='ts'>
import { reactive } from 'vue';

const isOnline = reactive(useNetwork());
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
