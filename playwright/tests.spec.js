import { test, expect } from '@playwright/test';

test.describe('timed-based captcha', () => {
    test('As a bot', async ({ page }) => {
        await page.goto('http://localhost:3000/page1');

        const link = page.getByRole('link');
        await link.click();

        expect(page).toHaveURL(/\/captcha/)
    })

    test('As a human', async ({ page }) => {
        await page.goto('http://localhost:3000/page1');

        await sleep(1000);

        const link = page.getByRole('link');
        await link.click();

        expect(page).toHaveURL(/\/page2/)
    })
})

test.describe('Honeypot', () => {
    test('As a bot', async ({ page }) => {
        await page.goto('http://localhost:3000/captcha?redirect=page1');

        const honeypot = page.getByRole('textbox').last();
        await honeypot.fill("test");
        const submit = page.getByRole('button')
        await submit.click()

        expect(page).toHaveURL(/\/captcha/)
    })

    test('As a human', async ({ page }) => {
        await page.goto('http://localhost:3000/captcha?redirect=page1');

        const submit = page.getByRole('button')
        await submit.click()

        expect(page).toHaveURL(/\/page1/)
    })
})

async function sleep(duration) {
    return new Promise(resolve => setTimeout(() => resolve(), duration))
}
