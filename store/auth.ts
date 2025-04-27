import { defineStore } from 'pinia';
import { ResponseStatus } from '~/types';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const username = ref('');
  const password = ref('');
  
  const onLogin = async () => {
    if (!username || !password) {
      return;
    }

    const response = await $fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (response.statusMessage === ResponseStatus.SUCCESS) {
      router.push('/');
    } else {
      alert('Invalid credentials.');
    }
  };
  
  const onRegister = async () => {
    if (!username || !password) {
      return;
    }

    const response = await $fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
  
    if (response.statusMessage === ResponseStatus.SUCCESS) {
      alert('Registration successful. Please log in.');
    } else {
      alert('Registration failed. Username may already be taken.');
    }
  }

  return {
    username,
    password,
    onLogin,
    onRegister,
  };
});
