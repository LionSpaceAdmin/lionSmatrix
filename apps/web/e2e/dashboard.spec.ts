import { test, expect } from '@playwright/test'

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/dashboard')
    // In real tests, would set auth cookie/token
  })

  test('dashboard overview displays correctly', async ({ page }) => {
    // Check main elements
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    // Check threat strip
    await expect(page.locator('[data-testid="threat-strip"]')).toBeVisible()
    
    // Check mission cards
    await expect(page.locator('[data-testid="mission-card"]')).toHaveCount(3)
    
    // Check quick actions
    await expect(page.locator('text=War Machine')).toBeVisible()
    await expect(page.locator('text=Fact-Check')).toBeVisible()
  })

  test('navigate to War Machine', async ({ page }) => {
    await page.click('text=War Machine')
    await expect(page).toHaveURL('/dashboard/war-machine')
    
    // Check tool tiles
    await expect(page.locator('[data-testid="tool-tile"]')).toHaveCount(5)
  })

  test('navigate to Command Center', async ({ page }) => {
    await page.click('text=Command Center')
    await expect(page).toHaveURL('/dashboard/command-center')
    
    // Check AI Terminal
    await expect(page.locator('[data-testid="ai-terminal"]')).toBeVisible()
    
    // Check tabs
    await expect(page.locator('text=Analytics Dashboard')).toBeVisible()
    await expect(page.locator('text=Evidence Log')).toBeVisible()
  })

  test('sidebar navigation works', async ({ page }) => {
    const sidebar = page.locator('[data-testid="dashboard-sidebar"]')
    
    // Test each link
    await sidebar.locator('text=Analytics').click()
    await expect(page).toHaveURL('/dashboard/analytics')
    
    await sidebar.locator('text=Campaigns').click()
    await expect(page).toHaveURL('/dashboard/campaigns')
    
    await sidebar.locator('text=Community').click()
    await expect(page).toHaveURL('/dashboard/community')
  })

  test('user menu functions', async ({ page }) => {
    const userMenu = page.locator('[data-testid="user-menu"]')
    await userMenu.click()
    
    // Check menu items
    await expect(page.locator('text=Settings')).toBeVisible()
    await expect(page.locator('text=Sign Out')).toBeVisible()
    
    // Navigate to settings
    await page.click('text=Settings')
    await expect(page).toHaveURL('/dashboard/settings')
  })
})

test.describe('Tool Interactions', () => {
  test('Image Influence Lab upload', async ({ page }) => {
    await page.goto('/dashboard/tools/image-influence-lab')
    
    // Check upload zone
    await expect(page.locator('[data-testid="upload-zone"]')).toBeVisible()
    
    // Upload file (mock)
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('test-image.jpg')
    
    // Check variant builder
    await expect(page.locator('[data-testid="variant-builder"]')).toBeVisible()
  })

  test('Fact-Check Window', async ({ page }) => {
    await page.goto('/dashboard/tools/fact-check')
    
    // Enter claim
    await page.fill('[data-testid="claim-input"]', 'Test claim for fact checking')
    
    // Add evidence
    await page.click('text=Add Evidence')
    await page.fill('[data-testid="evidence-url"]', 'https://example.com/source')
    
    // Generate verdict
    await page.click('text=Generate Verdict')
    await expect(page.locator('[data-testid="verdict-preview"]')).toBeVisible()
  })

  test('Report Research form', async ({ page }) => {
    await page.goto('/dashboard/tools/report-research')
    
    // Fill form
    await page.fill('input[name="title"]', 'Suspicious Content Report')
    await page.selectOption('select[name="category"]', 'disinformation')
    await page.fill('textarea[name="description"]', 'Details about the suspicious content')
    
    // Submit
    await page.click('text=Submit Report')
    
    // Check ticket ID
    await expect(page.locator('[data-testid="ticket-id"]')).toBeVisible()
  })

  test('Campaign creation wizard', async ({ page }) => {
    await page.goto('/dashboard/campaigns')
    
    // Start new campaign
    await page.click('text=New Campaign')
    
    // Step through wizard
    await page.fill('input[name="campaign-name"]', 'Test Campaign')
    await page.click('text=Next')
    
    await page.click('text=Social Media')
    await page.click('text=Next')
    
    await page.fill('textarea[name="goals"]', 'Campaign goals')
    await page.click('text=Create Campaign')
    
    // Check YAML preview
    await expect(page.locator('[data-testid="yaml-preview"]')).toBeVisible()
  })
})
