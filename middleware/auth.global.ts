import { ResponseStatus } from '~/types';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const response = await $fetch('/api/checkAuth');

  const { statusMessage } = response;
  const { path } = to;

  if (statusMessage === ResponseStatus.SUCCESS) {
    if (path === '/' || path === '/login') {
      return navigateTo('/todos');
    }
  } else {
    if (path === '/' || path === '/todos') {
      return navigateTo('/login');
    }
  }
});
