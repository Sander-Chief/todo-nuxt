export default defineNuxtRouteMiddleware(async (to, from) => {
  const response = await fetch('/api/checkAuth');

  const { status } = response;
  const { path } = to;

  if (status === 200) {
    if (path === '/' || path === '/login') {
      return navigateTo('/todos');
    }
  } else {
    if (path === '/' || path === '/todos') {
      return navigateTo('/login');
    }
  }
});
