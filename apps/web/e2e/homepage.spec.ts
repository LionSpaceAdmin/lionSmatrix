import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("has title", async ({ page }) => {
    await page.goto("/")

    // Expects page to have a title containing "LionSpace"
    await expect(page).toHaveTitle(/LionSpace/i)
  })

  test("displays main heading", async ({ page }) => {
    await page.goto("/")

    // Check for main heading
    const heading = page.getByRole("heading", { level: 1 })
    await expect(heading).toBeVisible()
  })

  test("navigation links work", async ({ page }) => {
    await page.goto("/")

    // Click on Dashboard link if it exists
    const dashboardLink = page.getByRole("link", { name: /dashboard/i })
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click()
      await expect(page).toHaveURL(/.*dashboard/)
    }
  })

  test("is responsive", async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto("/")
    await expect(page.locator("body")).toBeVisible()

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator("body")).toBeVisible()
  })
})
