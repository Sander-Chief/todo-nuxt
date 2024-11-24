import { expect, it, suite } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import TodoList from '../../components/TodoList.vue';
import { createPage } from '@nuxt/test-utils';

suite('TodoList', () => {
  it('renders correctly', async () => {
    // const nuxtApp = useNuxtApp();
    // const page = await createPage('/');
    // await page.waitForFunction(() => window.useNuxtApp?.() && !window.useNuxtApp?.().isHydrating);

    await mountSuspended(TodoList, {
      props: {
        todos: [],
      },
    });

    expect(screen.getByText('Task List')).toBeDefined();
  });
});
