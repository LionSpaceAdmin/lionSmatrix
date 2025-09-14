/**
 * Loading state utilities for the intelligence platform
 */

/**
 * Set loading state for a container element
 * @param isLoading - Whether to show or hide the loading state
 * @param container - The HTML element to update
 * @param isAppending - Whether to append to existing content or replace it
 */
export function setLoading(
  isLoading: boolean, 
  container: HTMLElement, 
  isAppending: boolean = false
): void {
  if (isLoading) {
    const loader = `<div class="loader text-center p-8"><p class="text-lg text-[#B8FFF2] font-headline animate-pulse">ANALYZING...</p></div>`;
    if (isAppending) {
      container.innerHTML += loader;
    } else {
      container.innerHTML = loader;
    }
  } else {
    const loader = container.querySelector('.loader');
    if (loader) loader.remove();
  }
}

/**
 * Set loading state specifically for image generation
 * @param isLoading - Whether to show or hide the loading state
 * @param container - The HTML element to update
 */
export function setImageLoading(isLoading: boolean, container: HTMLElement): void {
  if (isLoading) {
    container.innerHTML = `<div class="loader text-center p-8"><p class="text-lg text-[#B8FFF2] font-headline animate-pulse">GENERATING VISUAL...</p></div>`;
  } else {
    const loader = container.querySelector('.loader');
    if (loader) loader.remove();
  }
}

/**
 * Set loading state with custom message
 * @param isLoading - Whether to show or hide the loading state
 * @param container - The HTML element to update
 * @param message - Custom loading message
 * @param isAppending - Whether to append to existing content or replace it
 */
export function setCustomLoading(
  isLoading: boolean,
  container: HTMLElement,
  message: string = 'PROCESSING...',
  isAppending: boolean = false
): void {
  if (isLoading) {
    const loader = `<div class="loader text-center p-8"><p class="text-lg text-[#B8FFF2] font-headline animate-pulse">${message}</p></div>`;
    if (isAppending) {
      container.innerHTML += loader;
    } else {
      container.innerHTML = loader;
    }
  } else {
    const loader = container.querySelector('.loader');
    if (loader) loader.remove();
  }
}

/**
 * Show a terminal-style loading animation
 * @param container - The HTML element to update
 * @param frames - Array of animation frames
 * @param interval - Time between frames in milliseconds
 */
export function showTerminalLoader(
  container: HTMLElement,
  frames: string[] = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
  interval: number = 100
): () => void {
  let frameIndex = 0;
  const loader = document.createElement('div');
  loader.className = 'loader text-center p-8';
  loader.innerHTML = `<p class="text-lg text-[#00ff88] font-mono">${frames[0]} PROCESSING</p>`;
  container.innerHTML = '';
  container.appendChild(loader);

  const intervalId = setInterval(() => {
    frameIndex = (frameIndex + 1) % frames.length;
    loader.innerHTML = `<p class="text-lg text-[#00ff88] font-mono">${frames[frameIndex]} PROCESSING</p>`;
  }, interval);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    loader.remove();
  };
}

/**
 * Show progress bar loading state
 * @param container - The HTML element to update
 * @param progress - Progress percentage (0-100)
 * @param message - Optional message to display
 */
export function showProgressLoader(
  container: HTMLElement,
  progress: number,
  message?: string
): void {
  const safeProgress = Math.min(100, Math.max(0, progress));
  
  const loader = container.querySelector('.progress-loader') as HTMLElement;
  if (loader) {
    // Update existing loader
    const bar = loader.querySelector('.progress-bar') as HTMLElement;
    const text = loader.querySelector('.progress-text') as HTMLElement;
    if (bar) bar.style.width = `${safeProgress}%`;
    if (text) text.textContent = message || `${safeProgress}%`;
  } else {
    // Create new loader
    container.innerHTML = `
      <div class="progress-loader p-8">
        <div class="w-full bg-gray-800 rounded-full h-2 mb-4">
          <div class="progress-bar bg-gradient-to-r from-[#00ff88] to-[#00ffff] h-2 rounded-full transition-all duration-300" style="width: ${safeProgress}%"></div>
        </div>
        <p class="progress-text text-center text-[#B8FFF2] font-mono">${message || `${safeProgress}%`}</p>
      </div>
    `;
  }
}

/**
 * Show error state
 * @param container - The HTML element to update
 * @param error - Error message to display
 */
export function showError(container: HTMLElement, error: string): void {
  container.innerHTML = `
    <div class="error-state text-center p-8">
      <div class="text-red-500 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-red-400 font-mono">${error}</p>
    </div>
  `;
}

/**
 * Show success state
 * @param container - The HTML element to update
 * @param message - Success message to display
 */
export function showSuccess(container: HTMLElement, message: string): void {
  container.innerHTML = `
    <div class="success-state text-center p-8">
      <div class="text-green-500 mb-4">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <p class="text-green-400 font-mono">${message}</p>
    </div>
  `;
}

/**
 * Clear all loading states from container
 * @param container - The HTML element to clear
 */
export function clearLoadingStates(container: HTMLElement): void {
  const elements = container.querySelectorAll('.loader, .progress-loader, .error-state, .success-state');
  elements.forEach(el => el.remove());
}