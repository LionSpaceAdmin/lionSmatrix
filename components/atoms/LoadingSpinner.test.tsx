import { describe, expect, it } from "vitest"
import { render, screen } from "@/test/utils"
import { LoadingSpinner } from "./LoadingSpinner"

describe("LoadingSpinner", () => {
  it("renders loading spinner", () => {
    render(<LoadingSpinner />)
    const spinners = screen.getAllByRole("status")
    expect(spinners.length).toBeGreaterThan(0)
  })

  it("contains screen reader text", () => {
    render(<LoadingSpinner />)
    expect(screen.getByText((content) =>
      content.includes("Loading content, please wait")
    )).toBeInTheDocument()
  })

  it("has correct CSS classes", () => {
    const { container } = render(<LoadingSpinner />)
    const spinner = container.querySelector(".animate-spin")
    expect(spinner).toBeInTheDocument()
  })

  it("is accessible", () => {
    render(<LoadingSpinner />)
    const spinners = screen.getAllByRole("status")
    // The main spinner container has aria-label="LOADING..."
    const spinnerWithLabel = spinners.find(
      (el) => el.getAttribute("aria-label") === "LOADING..."
    )
    expect(spinnerWithLabel).toBeInTheDocument()
  })
})
