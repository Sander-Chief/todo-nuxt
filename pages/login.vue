<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  const response = await fetch('/api/checkAuth');

  if (response.status === 200) {
    router.push('/');
  }
});
</script>

<template>
  <LoginForm />
</template>
