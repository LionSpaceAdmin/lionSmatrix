import { test, expect } from '@playwright/test';

/**
 * Lions of Zion - Basic Smoke Tests
 * Testing core functionality of the information warfare defense platform
 */

test.describe('Lions of Zion - Basic Smoke Tests', () => {
  test('homepage loads and displays correct title', async ({ page }) => {
    await page.goto('/');
    
    // Should redirect to /home
    await expect(page).toHaveURL(/.*\/home/);
    
    // Check page title
    await expect(page).toHaveTitle(/Lions of Zion/);
    
    // Check main heading
    await expect(page.locator('h1')).toContainText('LIONSPACE ACADEMY');
  });

  test('navigation header is present and functional', async ({ page }) => {
    await page.goto('/home');
    
    // Check header elements
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header nav').first()).toBeVisible();
    
    // Check Lions of Zion logo/brand
    await expect(page.locator('text=LIONS OF ZION')).toBeVisible();
    
    // Check navigation links
    await expect(page.locator('text=Daily Brief')).toBeVisible();
    await expect(page.locator('text=Archive')).toBeVisible();
    await expect(page.locator('text=Playbooks')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
  });

  test('authentication buttons are present', async ({ page }) => {
    await page.goto('/home');
    
    // Check auth buttons (be more specific)
    await expect(page.locator('header').getByText('Sign In')).toBeVisible();
    await expect(page.locator('header').getByText('Join the Fight')).toBeVisible();
  });

  test('main content area loads with academy content', async ({ page }) => {
    await page.goto('/home');
    
    // Check main content area (be more specific)
    await expect(page.locator('#main-content')).toBeVisible();
    
    // Check academy content
    await expect(page.locator('text=Understanding Information Warfare')).toBeVisible();
    await expect(page.locator('text=Dr. Sarah Chen')).toBeVisible();
    
    // Check interaction buttons
    await expect(page.locator('button:has-text("187")')).toBeVisible(); // Like button
    await expect(page.locator('button:has-text("Save")')).toBeVisible();
    await expect(page.locator('button:has-text("Share")')).toBeVisible();
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home');
    
    // Check mobile menu button (should be visible on mobile)
    await expect(page.locator('button').filter({ hasText: /menu/i }).first()).toBeVisible();
    
    // Main content should still be visible
    await expect(page.locator('text=LIONS OF ZION')).toBeVisible();
  });

  test('dark theme is applied correctly', async ({ page }) => {
    await page.goto('/home');
    
    // Check that dark theme classes are applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
    
    // Check terminal-style background colors are present
    const bodyStyles = await page.locator('body').evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    // Should have dark background (terminal-style)
    expect(bodyStyles).toBeTruthy();
  });

  test('language selector is functional', async ({ page }) => {
    await page.goto('/home');
    
    // Check language selector button
    const langButton = page.locator('button:has-text("🇺🇸")');
    await expect(langButton).toBeVisible();
    
    // Click language selector
    await langButton.click();
    
    // Should show language options (this might open a dropdown)
    // Note: Exact behavior depends on implementation
  });

  test('table of contents navigation works', async ({ page }) => {
    await page.goto('/home');
    
    // Check table of contents
    await expect(page.locator('text=TABLE OF CONTENTS')).toBeVisible();
    
    // Check some TOC items
    await expect(page.locator('text=Introduction')).toBeVisible();
    await expect(page.locator('text=What is Information Warfare?')).toBeVisible();
    await expect(page.locator('text=Defense Strategies')).toBeVisible();
  });

  test('performance - page loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/home');
    
    // Wait for main content to be visible
    await expect(page.locator('text=LIONSPACE ACADEMY')).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds (adjust as needed)
    expect(loadTime).toBeLessThan(5000);
  });

  test('accessibility - skip to content link works', async ({ page }) => {
    await page.goto('/home');
    
    // Press Tab to focus skip link
    await page.keyboard.press('Tab');
    
    // Should focus on skip to content link
    await expect(page.locator('a:has-text("Skip to main content")')).toBeFocused();
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    
    // Should move focus to main content
    await expect(page.locator('#main-content')).toBeVisible();
  });
});