import { expect, it, suite } from 'vitest';
import { renderSuspended } from '@nuxt/test-utils/runtime';
import { screen } from '@testing-library/vue';
import TodoForm from '../../components/TodoForm.vue';

suite('TodoForm', () => {
  it('renders correctly', async () => {
    await renderSuspended(TodoForm);

    expect(screen.getByText('New task:')).toBeDefined();
    expect(screen.getByText('Add a task')).toBeDefined();
  });
});
