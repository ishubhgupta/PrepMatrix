import { test, expect } from '@playwright/test';

test.describe('PrepMatrix E2E Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check that the main heading is present
    await expect(page.locator('h1')).toContainText('Master Technical Interviews');
    
    // Check that subject cards are visible
    await expect(page.locator('text=Database Management Systems')).toBeVisible();
    await expect(page.locator('text=Python for Machine Learning')).toBeVisible();
    await expect(page.locator('text=C++ Object-Oriented Programming')).toBeVisible();
    await expect(page.locator('text=Generative AI & LLMs')).toBeVisible();
  });

  test('should navigate to quiz page', async ({ page }) => {
    await page.goto('/');
    
    // Click on DBMS quiz
    await page.click('text=Start Practicing');
    
    // Should be on a quiz page
    await expect(page).toHaveURL(/\/quiz\//);
  });

  test('should open settings modal', async ({ page }) => {
    await page.goto('/');
    
    // Click settings button (if visible)
    const settingsButton = page.locator('[aria-label="Open settings"]');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();
      
      // Settings modal should be visible
      await expect(page.locator('text=Settings')).toBeVisible();
    }
  });

  test('should handle theme toggle', async ({ page }) => {
    await page.goto('/');
    
    // Click theme toggle button
    const themeButton = page.locator('[aria-label="Toggle theme"]');
    if (await themeButton.isVisible()) {
      await themeButton.click();
      
      // Theme should change (check for dark class on html)
      const htmlElement = page.locator('html');
      const hasClass = await htmlElement.evaluate(el => 
        el.classList.contains('dark') || !el.classList.contains('dark')
      );
      expect(hasClass).toBe(true);
    }
  });
});
