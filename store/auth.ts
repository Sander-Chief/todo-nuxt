import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const username = ref('');
  const password = ref('');
  
  const onLogin = async () => {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
        }),
      });
  
      if (response.status === 200) {
        router.push('/');
      } else {
        alert('Invalid credentials.');
      }
  };
  
  const onRegister = async () => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });
  
    if (response.status === 200) {
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
