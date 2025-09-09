import React, { ReactElement } from "react"
import { render, RenderOptions } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Add any providers here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from "@testing-library/react"
export { customRender as render, userEvent }

// Custom test utilities
export const createMockRouter = () => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  pathname: "/",
  query: {},
  asPath: "/",
})

export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0))

// Mock data generators
export const generateMockUser = (overrides = {}) => ({
  id: "test-user-id",
  email: "test@example.com",
  name: "Test User",
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const generateMockThreatData = (overrides = {}) => ({
  id: "threat-id",
  title: "Test Threat",
  severity: "high",
  description: "Test threat description",
  timestamp: new Date().toISOString(),
  ...overrides,
})

// Accessibility testing helper
export const checkA11y = async (container: HTMLElement) => {
  const axe = await import("axe-core")
  const results = await axe.run(container)
  return results.violations
}
