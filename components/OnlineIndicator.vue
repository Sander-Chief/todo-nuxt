<script setup>
import { reactive } from 'vue';
import { useNetwork } from '@vueuse/core';

const network = reactive(useNetwork());
</script>

<template>
  <div
    class="online-indicator"
    :class="{ 'offline': !network.isOnline }"
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
