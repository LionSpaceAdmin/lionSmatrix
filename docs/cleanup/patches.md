# Cleanup Patches

This file contains pseudo-diffs for the non-breaking changes outlined in the `plan.md`.

---

## Patch 1: Refactor Duplicated API Backoff Logic

**File**: `src/lib/api.ts`

```diff
- const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
+ const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
+
+ const fetchWithBackoff = async (apiUrl: string, payload: any, attempt = 1, maxAttempts = 5) => {
+     try {
+         const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
+         if (!response.ok) {
+             if (response.status === 429 && attempt < maxAttempts) {
+                 const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
+                 await new Promise(res => setTimeout(res, delay));
+                 return fetchWithBackoff(apiUrl, payload, attempt + 1, maxAttempts);
+             }
+             throw new Error(`Network error: ${response.status}`);
+         }
+         return await response.json();
+     } catch (error) {
+          if (attempt < maxAttempts) {
+             const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
+             await new Promise(res => setTimeout(res, delay));
+             return fetchWithBackoff(apiUrl, payload, attempt + 1, maxAttempts);
+         }
+         throw error;
+     }
+ };

- export const callGeminiWithBackoff = async (payload: any, attempt = 1, maxAttempts = 5) => {
+ export const callGeminiWithBackoff = async (payload: any) => {
-     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
-     try {
-         const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
-         if (!response.ok) {
-             if (response.status === 429 && attempt < maxAttempts) {
-                 const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
-                 await new Promise(res => setTimeout(res, delay));
-                 return callGeminiWithBackoff(payload, attempt + 1, maxAttempts);
-             }
-             throw new Error(`Network error: ${response.status}`);
-         }
-         return await response.json();
-     } catch (error) {
-          if (attempt < maxAttempts) {
-             const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
-             await new Promise(res => setTimeout(res, delay));
-             return callGeminiWithBackoff(payload, attempt + 1, maxAttempts);
-         }
-         throw error;
-     }
+     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
+     return fetchWithBackoff(apiUrl, payload);
 };

- export const callImagenApi = async (prompt: string, attempt = 1, maxAttempts = 5) => {
+ export const callImagenApi = async (prompt: string) => {
-     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
-     const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
-     try {
-         const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
-          if (!response.ok) {
-             if (response.status === 429 && attempt < maxAttempts) {
-                 const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
-                 await new Promise(res => setTimeout(res, delay));
-                 return callImagenApi(prompt, attempt + 1, maxAttempts);
-             }
-             throw new Error(`Network error: ${response.status}`);
-         }
-         return await response.json();
-     } catch (error) {
-         if (attempt < maxAttempts) {
-             const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
-             await new Promise(res => setTimeout(res, delay));
-             return callImagenApi(prompt, attempt + 1, maxAttempts);
-         }
-         throw error;
-     }
+     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
+     const payload = { instances: [{ prompt: prompt }], parameters: { "sampleCount": 1 } };
+     return fetchWithBackoff(apiUrl, payload);
 };
```

---

## Patch 2: Fix Skipped and Flaky Tests in `Calendar`

**File**: `src/components/ui/calendar.test.tsx`

```diff
- import { render, screen } from '@testing-library/react'
+ import { render, screen } from '@testing-library/react'
+ import { addMonths, format } from 'date-fns'
 import { describe, it, expect, vi } from 'vitest'
 import { Calendar } from './calendar'

 describe('Calendar', () => {
   it('should render the calendar', () => {
+    // Mock the date to make the test deterministic
+    const mockDate = new Date(2024, 7, 10) // August 10, 2024
+    vi.spyOn(global, 'Date').mockImplementation(() => mockDate)
+
     render(<Calendar />)
-    const month = new Date().toLocaleString('default', { month: 'long' })
-    expect(screen.getByText(month, { exact: false })).not.toBeNull()
+    expect(screen.getByText('August 2024')).not.toBeNull()
+
+    vi.restoreAllMocks()
   });

-  it.skip('should be disabled when fromMonth and toMonth are the same', () => {
-    const today = new Date()
-    render(<Calendar fromMonth={today} toMonth={today} />)
-    const prevButton = screen.getAllByRole('button', { name: 'Go to the Previous Month' })[0]
-    const nextButton = screen.getAllByRole('button', { name: 'Go to the Next Month' })[0]
+  it('should be disabled when fromMonth and toMonth are the same', () => {
+    const month = new Date()
+    render(<Calendar fromMonth={month} toMonth={month} />)
+    const prevButton = screen.getByRole('button', { name: 'Go to previous month' })
+    const nextButton = screen.getByRole('button', { name: 'Go to next month' })
     expect(prevButton).toBeDisabled()
     expect(nextButton).toBeDisabled()
   });
 });
```

---

## Patch 3: Create `.env.example` File

**File**: `.env.example` (New file)

```
# Public environment variables for the Next.js application
# Copy this file to .env.local and fill in the values.

# IMPORTANT: This key is exposed to the browser.
# For production, it is highly recommended to move this to a backend and use a server-side API route.
NEXT_PUBLIC_GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## Patch 4: Improve Type Safety in `callGeminiWithBackoff`

**File**: `src/lib/api.ts`

```diff
- export const callGeminiWithBackoff = async (payload: any) => {
+ // It's recommended to generate more specific types from the Gemini API spec
+ type GeminiPayload = {
+   contents: any[];
+   tools?: any[];
+   generationConfig?: Record<string, any>;
+   systemInstruction?: Record<string, any>;
+ };
+
+ export const callGeminiWithBackoff = async (payload: GeminiPayload) => {
     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
     return fetchWithBackoff(apiUrl, payload);
 };
```
