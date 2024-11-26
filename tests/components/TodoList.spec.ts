import { expect, it, suite } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import TodoList from '../../components/TodoList.vue';

suite('TodoList', () => {
  it('renders correctly', async () => {
    await renderSuspended(TodoList, {
      props: {
        todos: [],
      },
    });

    expect(screen.getByText('Task List')).toBeDefined();
  });
});
