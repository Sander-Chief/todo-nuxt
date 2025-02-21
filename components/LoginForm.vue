<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

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
</script>

<template>
  <div class="auth-container">
    <h2>Login or register</h2>

    <label class="auth-label">Username:</label>
    <input
      class="auth-input"
      v-model="username"
      placeholder="Username"
    />

    <label class="auth-label">Password:</label>
    <input
      class="auth-input"
      v-model="password"
      type="password"
      placeholder="Password"
    />

    <button
      class="auth-button"
      @click="onLogin"
    >
      Login
    </button>
    <button
      class="auth-button secondary"
      @click="onRegister"
    >
      Register
    </button>
  </div>
</template>

<style lang="less" scoped>
  .auth-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .auth-label {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: @size1;
  }

  .auth-input,
  .auth-button {
    height: @size5;
    box-shadow: none;
    outline: none;
    padding-left: @size2;
    padding-right: @size2;
    border-radius: @size1;
    font-size: 18px;
    margin-top: @size1;
    margin-bottom: @size2;
  }

  .auth-input {
    background-color: transparent;
    border: @border;
    color: inherit;
  }

  .auth-button {
    background-color: @primaryColor;
    border: none;
    color: white;
    cursor: pointer;
  }

  .auth-button.secondary {
    background-color: transparent;
    border: @border;
    color: inherit;
  }
</style>
