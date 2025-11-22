<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

const authStore = useAuthStore();
const { username, password } = storeToRefs(authStore);
const { onLogin, onRegister, onGoogleSignInSuccess, onGoogleSignInError } = authStore;
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

    <GoogleSignInButton
      @success="onGoogleSignInSuccess"
      @error="onGoogleSignInError"
    />
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
