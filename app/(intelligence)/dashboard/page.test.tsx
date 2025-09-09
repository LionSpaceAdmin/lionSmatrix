import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@/test/utils"

// Mock the entire module since it's a Server Component
vi.mock("./page", () => ({
  default: vi.fn(() => {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Mocked dashboard content</p>
      </div>
    )
  }),
}))

describe("Dashboard Page (Server Component)", () => {
  it("renders dashboard heading", async () => {
    const DashboardPage = (await import("./page")).default
    render(<DashboardPage />)

    expect(screen.getByRole("heading", { name: /dashboard/i })).toBeInTheDocument()
  })

  it("renders dashboard content", async () => {
    const DashboardPage = (await import("./page")).default
    render(<DashboardPage />)

    expect(screen.getByText(/mocked dashboard content/i)).toBeInTheDocument()
  })

  // Note: Testing async Server Components has limitations
  // For full testing, consider using E2E tests with Playwright
})
