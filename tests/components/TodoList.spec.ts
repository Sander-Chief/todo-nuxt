import { expect, it, suite } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import TodoList from '../../components/TodoList.vue';

suite('TodoList', () => {
  it('renders correctly when 0 todos', async () => {
    await renderSuspended(TodoList, {
      props: {
        todos: [],
      },
    });

    expect(screen.getByText('Task List')).toBeDefined();
    expect(screen.getByText('Empty list.')).toBeDefined();
    expect(screen.queryByTestId('todo-list')).toBeNull();
  });

  it('renders correctly when >0 todos', async () => {
    const wrapper = await renderSuspended(TodoList, {
      props: {
        todos: [
          {
            id: 1,
            done: false,
            content: 'test',
          },
        ],
      },
    });

    expect(screen.getByText('Task List')).toBeDefined();
    expect(screen.getByTestId('todo-list')).toBeDefined();
  });
});
