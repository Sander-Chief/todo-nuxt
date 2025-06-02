import { expect, test } from '@playwright/test';

const testTodoText = 'test todo';

test('Toggling todo done', async ({ page }) => {
  await page.goto('http://localhost:3000/', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.getByRole('heading')).toHaveText('Login or register');
  await page.getByPlaceholder('Username').fill('test_user');
  await page.getByPlaceholder('Password').fill('test_pass');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('http://localhost:3000/todos');
  await expect(page.getByRole('heading', { name: 'Task List' })).toBeVisible();

  const testTodo = page.getByText(testTodoText).first();

  await expect(testTodo).toBeVisible();
  await expect(testTodo).toHaveClass('todo');
  await testTodo.click();
  await expect(testTodo).toHaveClass('todo done');
});
