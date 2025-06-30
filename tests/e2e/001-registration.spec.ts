import { expect, test } from '@playwright/test';

test('User registration', async ({ page }) => {
  await page.goto('http://localhost:3000/', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.getByRole('heading')).toHaveText('Login or register');

  await page.getByPlaceholder('Username').fill(`test_user`);
  await page.getByPlaceholder('Password').fill('test_pass');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.waitForTimeout(1000); 
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('http://localhost:3000/todos');
});
