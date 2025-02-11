import { test, expect } from '@playwright/test';

test('As a bot', async ({ page }) => {
    await page.goto('http://localhost:3000/page1');

    const link = page.getByRole('link');
    await link.click();

    expect(page).toHaveURL(/\/captcha$/)
})

test('As a human', async ({ page }) => {
    await page.goto('http://localhost:3000/page1');

    await sleep(1000);

    const link = page.getByRole('link');
    await link.click();

    expect(page).toHaveURL(/\/page2$/)
})

async function sleep(duration) {
    return new Promise(resolve => setTimeout(() => resolve(), duration))
}
