from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Navigate directly to the English version of the page with a trailing slash,
    # as the middleware likely redirects to this format.
    page.goto("http://localhost:3000/en/")

    # Wait for the main heading to be visible
    heading = page.get_by_role("heading", name="Truth is pattern. AI sees it.")
    expect(heading).to_be_visible(timeout=15000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/homepage.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)