/**
 * Accessibility testing utilities for WCAG 2.1 AA compliance
 * Use these functions to validate accessibility improvements
 */

/**
 * Test color contrast ratios to ensure WCAG AA compliance (4.5:1)
 */
export function testColorContrast(): void {
  const testCases = [
    // Terminal colors with backgrounds
    { foreground: 'rgb(34, 211, 238)', background: 'rgb(3, 7, 18)', name: 'Terminal Cyan on Dark BG' },
    { foreground: 'rgb(248, 250, 252)', background: 'rgb(3, 7, 18)', name: 'Terminal Text on Dark BG' },
    { foreground: 'rgb(34, 197, 94)', background: 'rgb(3, 7, 18)', name: 'Terminal Green on Dark BG' },
    { foreground: 'rgb(251, 191, 36)', background: 'rgb(3, 7, 18)', name: 'Terminal Gold on Dark BG' },
    { foreground: 'rgb(239, 68, 68)', background: 'rgb(3, 7, 18)', name: 'Terminal Red on Dark BG' },
    
    // Secondary backgrounds
    { foreground: 'rgb(248, 250, 252)', background: 'rgb(15, 23, 42)', name: 'Terminal Text on Secondary BG' },
    { foreground: 'rgb(34, 211, 238)', background: 'rgb(15, 23, 42)', name: 'Terminal Cyan on Secondary BG' },
  ];

  console.warn('🎨 Color Contrast Testing');
  
  testCases.forEach(({ foreground, background, name }) => {
    const ratio = calculateContrastRatio(foreground, background);
    const passes = ratio >= 4.5;
    const status = passes ? '✅ PASS' : '❌ FAIL';
    
    if (passes) {
      console.warn(`${status} ${name}: ${ratio.toFixed(2)}:1 (WCAG AA)`);
    } else {
      console.error(`${status} ${name}: ${ratio.toFixed(2)}:1 (Below WCAG AA)`);
    }
  });
}

/**
 * Calculate contrast ratio between two colors
 */
function calculateContrastRatio(color1: string, color2: string): number {
  const luminance1 = getRelativeLuminance(color1);
  const luminance2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 */
function getRelativeLuminance(color: string): number {
  // Parse RGB values from string like "rgb(255, 255, 255)"
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return 0;
  
  const [, r, g, b] = match.map(Number);
  
  // Convert to relative luminance
  const rs = (r || 0) / 255;
  const gs = (g || 0) / 255;
  const bs = (b || 0) / 255;
  
  const rLinear = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const gLinear = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const bLinear = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
  
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Test keyboard navigation functionality
 */
export function testKeyboardNavigation(): void {
  console.group('⌨️ Keyboard Navigation Testing');
  
  // Test tab order
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  console.warn(`Found ${focusableElements.length} focusable elements`);
  
  // Test if all interactive elements have focus indicators
  let elementsWithFocus = 0;
  focusableElements.forEach((element) => {
    const styles = window.getComputedStyle(element, ':focus');
    if (styles.outline !== 'none' || styles.boxShadow !== 'none') {
      elementsWithFocus++;
    }
  });
  
  const focusStatus = elementsWithFocus === focusableElements.length ? '✅ PASS' : '⚠️ PARTIAL';
  console.warn(`${focusStatus} Focus indicators: ${elementsWithFocus}/${focusableElements.length} elements`);
  
  // Test skip links
  const skipLinks = document.querySelectorAll('.skip-links a');
  console.warn(`${skipLinks.length > 0 ? '✅ PASS' : '❌ FAIL'} Skip links: ${skipLinks.length} found`);
  
  console.groupEnd();
}

/**
 * Test ARIA attributes and semantic markup
 */
export function testARIACompliance(): void {
  console.group('🔍 ARIA Compliance Testing');
  
  const tests = [
    {
      name: 'Form labels',
      test: () => {
        const inputs = document.querySelectorAll('input, textarea, select');
        const unlabeledInputs = Array.from(inputs).filter(input => {
          const id = input.getAttribute('id');
          const ariaLabel = input.getAttribute('aria-label');
          const ariaLabelledBy = input.getAttribute('aria-labelledby');
          const label = id ? document.querySelector(`label[for="${id}"]`) : null;
          
          return !ariaLabel && !ariaLabelledBy && !label;
        });
        
        return {
          pass: unlabeledInputs.length === 0,
          message: `${inputs.length - unlabeledInputs.length}/${inputs.length} inputs properly labeled`
        };
      }
    },
    {
      name: 'Button semantics',
      test: () => {
        const clickableElements = document.querySelectorAll('[onclick], .cursor-pointer');
        const improperButtons = Array.from(clickableElements).filter(el => {
          return el.tagName !== 'BUTTON' && el.tagName !== 'A' && !el.getAttribute('role');
        });
        
        return {
          pass: improperButtons.length === 0,
          message: `${clickableElements.length - improperButtons.length}/${clickableElements.length} clickable elements use proper semantics`
        };
      }
    },
    {
      name: 'Modal accessibility',
      test: () => {
        const modals = document.querySelectorAll('[role="dialog"]');
        const properModals = Array.from(modals).filter(modal => {
          return modal.getAttribute('aria-modal') === 'true' &&
                 modal.getAttribute('aria-labelledby');
        });
        
        return {
          pass: modals.length === 0 || properModals.length === modals.length,
          message: `${properModals.length}/${modals.length} modals properly configured`
        };
      }
    },
    {
      name: 'Loading states',
      test: () => {
        const loadingElements = document.querySelectorAll('[role="status"], .animate-spin');
        const accessibleLoading = Array.from(loadingElements).filter(el => {
          return el.getAttribute('aria-live') || el.getAttribute('aria-label') || 
                 el.querySelector('[aria-live]') || el.textContent?.trim();
        });
        
        return {
          pass: loadingElements.length === 0 || accessibleLoading.length === loadingElements.length,
          message: `${accessibleLoading.length}/${loadingElements.length} loading states accessible`
        };
      }
    },
    {
      name: 'Tab navigation',
      test: () => {
        const tabLists = document.querySelectorAll('[role="tablist"]');
        const properTabs = Array.from(tabLists).filter(tabList => {
          const tabs = tabList.querySelectorAll('[role="tab"]');
          return Array.from(tabs).every(tab => 
            tab.getAttribute('aria-selected') !== null &&
            tab.getAttribute('aria-controls')
          );
        });
        
        return {
          pass: tabLists.length === 0 || properTabs.length === tabLists.length,
          message: `${properTabs.length}/${tabLists.length} tab lists properly configured`
        };
      }
    }
  ];
  
  tests.forEach(({ name, test }) => {
    const result = test();
    const status = result.pass ? '✅ PASS' : '❌ FAIL';
    console.warn(`${status} ${name}: ${result.message}`);
  });
  
  console.groupEnd();
}

/**
 * Test screen reader compatibility
 */
export function testScreenReaderSupport(): void {
  console.group('📢 Screen Reader Support Testing');
  
  // Test for screen reader only content
  const srOnlyElements = document.querySelectorAll('.sr-only');
  console.warn(`✅ Screen reader only content: ${srOnlyElements.length} elements found`);
  
  // Test for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let headingHierarchy = true;
  let lastLevel = 0;
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      headingHierarchy = false;
    }
    lastLevel = level;
  });
  
  console.warn(`${headingHierarchy ? '✅ PASS' : '❌ FAIL'} Heading hierarchy: ${headings.length} headings checked`);
  
  // Test for alt text on images
  const images = document.querySelectorAll('img');
  const imagesWithAlt = Array.from(images).filter(img => 
    img.getAttribute('alt') !== null || img.getAttribute('role') === 'presentation'
  );
  
  console.warn(`${imagesWithAlt.length === images.length ? '✅ PASS' : '❌ FAIL'} Image alt text: ${imagesWithAlt.length}/${images.length} images`);
  
  // Test for live regions
  const liveRegions = document.querySelectorAll('[aria-live]');
  console.warn(`✅ Live regions: ${liveRegions.length} regions found`);
  
  console.groupEnd();
}

/**
 * Run all accessibility tests
 */
export function runAllAccessibilityTests(): void {
  console.warn('🔍 Running LionSpace Accessibility Test Suite...\n');
  
  testColorContrast();
  testKeyboardNavigation();
  testARIACompliance();
  testScreenReaderSupport();
  
  console.warn('\n✨ Accessibility testing complete! Check results above.');
}

/**
 * Test specific component accessibility
 */
export function testComponentAccessibility(componentSelector: string): void {
  const component = document.querySelector(componentSelector);
  if (!component) {
    console.error(`Component not found: ${componentSelector}`);
    return;
  }
  
  console.group(`🎯 Testing Component: ${componentSelector}`);
  
  // Test focusable elements within component
  const focusable = component.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  console.warn(`Focusable elements: ${focusable.length}`);
  
  // Test ARIA attributes
  const ariaElements = component.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
  console.warn(`Elements with ARIA: ${ariaElements.length}`);
  
  // Test semantic HTML
  const semanticElements = component.querySelectorAll('button, a, input, select, textarea, h1, h2, h3, h4, h5, h6, main, nav, section, article, aside, header, footer');
  console.warn(`Semantic elements: ${semanticElements.length}`);
  
  console.groupEnd();
}

// Export test runner for browser console
if (typeof window !== 'undefined') {
  (window as any).lionspaceA11yTest = {
    runAll: runAllAccessibilityTests,
    testColors: testColorContrast,
    testKeyboard: testKeyboardNavigation,
    testARIA: testARIACompliance,
    testScreenReader: testScreenReaderSupport,
    testComponent: testComponentAccessibility
  };
}