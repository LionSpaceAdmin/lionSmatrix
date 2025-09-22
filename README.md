# Zion's Shield

**A collective defense platform against digital threats. We identify, analyze, and combat coordinated misinformation campaigns in real-time.**

## Overview

This is a Next.js 15 project with TypeScript, initialized in Firebase Studio. It's designed to implement a comprehensive "terminal/cyber" themed design system. Key technologies include Tailwind CSS for styling, Radix UI for components, and `next/font/google` for optimized font loading. The project aims to create a unique visual and interactive experience, with a strong emphasis on accessibility and performance. It also integrates Genkit AI for potential AI-powered features.

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui
- **AI:** Genkit
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js (v20.11.1 or later)
- pnpm (v9.1.0 or later)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/context-labs/lion-s-matrix.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd lion-s-matrix
    ```
3.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the Development Server

To run the development server, use the following command:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

-   `pnpm dev`: Starts the Next.js development server.
-   `pnpm genkit:dev`: Starts the Genkit AI development server.
-   `pnpm genkit:watch`: Starts the Genkit AI development server with file watching for automatic restarts on code changes.
-   `pnpm build`: Builds the Next.js application for production deployment.
-   `pnpm start`: Starts the Next.js production server.
-   `pnpm lint`: Runs ESLint to identify and report on patterns found in JavaScript/TypeScript code.
-   `pnpm typecheck`: Performs TypeScript type checking across the project without emitting JavaScript files.
