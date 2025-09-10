# Testing Guide for LionSpace Intelligence Platform

This guide covers the comprehensive testing setup for the Next.js 15 application, including unit tests, integration tests, and end-to-end tests.

## Table of Contents

1. [Testing Stack](#testing-stack)
2. [Quick Start](#quick-start)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Testing Strategies](#testing-strategies)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Testing Stack

- **Unit/Integration Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Vitest Coverage (v8)
- **Mocking**: MSW (Mock Service Worker)
- **Accessibility**: axe-core

## Quick Start

### Running Tests

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui

# Run E2E tests
pnpm e2e:headless

# Run E2E tests with UI
pnpm e2e:ui
```

### Installing Dependencies

All testing dependencies are already installed. If you need to reinstall:

```bash
# Install all dependencies
pnpm install

# Install Playwright browsers
npx playwright install
```

## Unit Testing

### Writing Unit Tests

Unit tests are written using Vitest and React Testing Library. Tests should be placed next to the files they test with a `.test.ts(x)` or `.spec.ts(x)` extension.

#### Testing a Client Component

```typescript
// components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, userEvent } from '@/test/utils'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### Testing Server Components

Server Components have limitations in unit testing. Use mocking or E2E tests for full coverage:

```typescript
// app/dashboard/page.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'

// Mock the Server Component
vi.mock('./page', () => ({
  default: vi.fn(() => (
    <div>
      <h1>Dashboard</h1>
      <p>Mocked content</p>
    </div>
  )),
}))

describe('Dashboard Page', () => {
  it('renders dashboard', async () => {
    const Dashboard = (await import('./page')).default
    render(<Dashboard />)
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })
})
```

### Testing Hooks

```typescript
// hooks/useCounter.test.ts
import { renderHook, act } from "@testing-library/react"
import { useCounter } from "./useCounter"

describe("useCounter", () => {
  it("increments counter", () => {
    const { result } = renderHook(() => useCounter())

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
```

### Testing Server Actions

```typescript
// actions/user.test.ts
import { describe, it, expect, vi } from "vitest"
import { createUser } from "./user"

vi.mock("@/lib/db", () => ({
  db: {
    insert: vi.fn().mockResolvedValue({ id: "123" }),
  },
}))

describe("createUser", () => {
  it("creates a new user", async () => {
    const result = await createUser({
      email: "test@example.com",
      name: "Test User",
    })

    expect(result).toHaveProperty("id")
    expect(result.id).toBe("123")
  })
})
```

## Integration Testing

Integration tests verify that multiple components work together correctly.

```typescript
// features/auth/login.integration.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, userEvent, waitFor } from '@/test/utils'
import { LoginForm } from './LoginForm'
import { mockServer } from '@/test/mocks/server'

describe('Login Flow', () => {
  it('completes login successfully', async () => {
    const user = userEvent.setup()

    render(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'user@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    })
  })
})
```

## End-to-End Testing

E2E tests are written using Playwright and test complete user flows.

### Basic E2E Test

```typescript
// e2e/auth.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Authentication", () => {
  test("user can log in", async ({ page }) => {
    await page.goto("/login")

    await page.fill('[name="email"]', "user@example.com")
    await page.fill('[name="password"]', "password123")
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL("/dashboard")
    await expect(page.locator("h1")).toContainText("Dashboard")
  })
})
```

### Testing Different Viewports

```typescript
test("responsive design", async ({ page }) => {
  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto("/")
  await expect(page.locator(".desktop-menu")).toBeVisible()

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 })
  await expect(page.locator(".mobile-menu")).toBeVisible()
})
```

### API Testing with Playwright

```typescript
test("API endpoint returns data", async ({ request }) => {
  const response = await request.get("/api/users")
  expect(response.ok()).toBeTruthy()

  const data = await response.json()
  expect(data).toHaveLength(10)
})
```

## Testing Strategies

### Testing Next.js 15 Features

#### Async Components

```typescript
// For async Server Components, use E2E tests
test("async server component loads data", async ({ page }) => {
  await page.goto("/products")
  await expect(page.locator('[data-testid="product-list"]')).toBeVisible()
  await expect(page.locator(".product-item")).toHaveCount(10)
})
```

#### Parallel Routes

```typescript
test("parallel routes load simultaneously", async ({ page }) => {
  await page.goto("/dashboard")

  await Promise.all([
    expect(page.locator('[data-slot="@sidebar"]')).toBeVisible(),
    expect(page.locator('[data-slot="@main"]')).toBeVisible(),
  ])
})
```

### Accessibility Testing

```typescript
// Unit test with axe-core
import { checkA11y } from '@/test/utils'

it('meets accessibility standards', async () => {
  const { container } = render(<MyComponent />)
  const violations = await checkA11y(container)
  expect(violations).toHaveLength(0)
})
```

```typescript
// E2E accessibility test
import { injectAxe, checkA11y } from "axe-playwright"

test("page is accessible", async ({ page }) => {
  await page.goto("/")
  await injectAxe(page)
  await checkA11y(page)
})
```

### Performance Testing

```typescript
test("page loads within performance budget", async ({ page }) => {
  const startTime = Date.now()
  await page.goto("/")
  const loadTime = Date.now() - startTime

  expect(loadTime).toBeLessThan(3000) // 3 seconds

  // Check Core Web Vitals
  const metrics = await page.evaluate(() => {
    return {
      LCP: performance.getEntriesByType("largest-contentful-paint")[0]?.startTime,
      FID: performance.getEntriesByType("first-input")[0]?.processingStart,
      CLS: performance.getEntriesByType("layout-shift").reduce((acc, entry) => acc + entry.value, 0),
    }
  })

  expect(metrics.LCP).toBeLessThan(2500)
  expect(metrics.CLS).toBeLessThan(0.1)
})
```

## CI/CD Integration

The project includes GitHub Actions workflows for automated testing:

- **Unit Tests**: Run on every push and PR
- **E2E Tests**: Run on PR and before deployment
- **Coverage Reports**: Uploaded to Codecov
- **Test Artifacts**: Playwright reports and screenshots

### GitHub Actions Workflow

See `.github/workflows/test.yml` for the complete CI setup.

## Best Practices

### 1. Test Organization

- Place unit tests next to the code they test
- Keep E2E tests in the `/e2e` directory
- Use descriptive test names
- Group related tests with `describe` blocks

### 2. Test Data

- Use factory functions for test data
- Keep test data realistic but minimal
- Clean up after tests

```typescript
import { generateMockUser, generateMockThreatData } from "@/test/utils"

const user = generateMockUser({ name: "John Doe" })
const threat = generateMockThreatData({ severity: "critical" })
```

### 3. Mocking

- Mock external dependencies
- Use MSW for API mocking
- Keep mocks close to reality

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("/api/user", () => {
    return HttpResponse.json({
      id: "123",
      name: "Test User",
    })
  }),
]
```

### 4. Async Testing

- Always await async operations
- Use `waitFor` for dynamic content
- Set appropriate timeouts

```typescript
await waitFor(
  () => {
    expect(screen.getByText(/loaded/i)).toBeInTheDocument()
  },
  { timeout: 3000 }
)
```

### 5. Coverage Goals

- Aim for 70%+ coverage
- Focus on critical paths
- Don't test implementation details
- Prioritize user-facing functionality

## Troubleshooting

### Common Issues

#### 1. Tests failing with "Not wrapped in act(...)"

```typescript
// Wrap state updates in act()
import { act } from "@testing-library/react"

act(() => {
  // State update here
})
```

#### 2. Next.js Image component issues

The Image component is mocked in `test/setup.ts`. If you need custom behavior:

```typescript
vi.mock('next/image', () => ({
  default: vi.fn().mockImplementation(({ src, alt }) => (
    <img src={src} alt={alt} />
  )),
}))
```

#### 3. Module resolution errors

Ensure `vitest.config.ts` has proper path aliases:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './'),
    '~': path.resolve(__dirname, './'),
  },
}
```

#### 4. Playwright browser installation

```bash
# Install specific browser
npx playwright install chromium

# Install with system dependencies
npx playwright install --with-deps
```

#### 5. Coverage not generating

```bash
# Ensure coverage provider is installed
pnpm add -D @vitest/coverage-v8

# Run with coverage
pnpm test:coverage
```

### Debug Mode

```typescript
// Enable debug output in tests
screen.debug()

// Playwright debug mode
await page.pause()

// Vitest UI for visual debugging
pnpm test:ui
```

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Next.js Applications](https://nextjs.org/docs/testing)

## Contributing

When adding new features:

1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this documentation if needed

For questions or issues, please refer to the project's contribution guidelines.
