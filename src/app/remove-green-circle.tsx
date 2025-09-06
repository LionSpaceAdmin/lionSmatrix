'use client'

import { useEffect } from 'react'

export function RemoveGreenCircle() {
  useEffect(() => {
    const removeCircle = () => {
      // More aggressive removal of any large elements
      const allElements = document.querySelectorAll('div, canvas, svg')
      
      allElements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const style = window.getComputedStyle(element)
        
        // Check if element is large (more than 80% of viewport)
        const isLarge = rect.width > window.innerWidth * 0.8 && 
                       rect.height > window.innerHeight * 0.8
        
        // Check if it's positioned
        const isPositioned = style.position === 'fixed' || 
                           style.position === 'absolute'
        
        // Check various green colors
        const bgColor = style.backgroundColor
        const isGreen = bgColor.includes('110') || 
                       bgColor.includes('231') || 
                       bgColor.includes('183') ||
                       bgColor.includes('#6EE7B7') ||
                       bgColor.includes('rgb(110, 231, 183)')
        
        // Check for circular shape
        const isCircular = style.borderRadius === '50%' || 
                          style.borderRadius === '9999px' ||
                          element.style.borderRadius === '50%'
        
        // Remove if it matches our criteria
        if (isLarge && isPositioned && (isGreen || isCircular)) {
          console.warn('Removing large element:', {
            tag: element.tagName,
            class: element.className,
            id: element.id,
            color: bgColor,
            size: `${rect.width}x${rect.height}`,
            borderRadius: style.borderRadius
          })
          element.style.display = 'none !important'
          element.remove()
        }
      })
      
      // Also inject CSS to hide future elements
      const style = document.createElement('style')
      style.textContent = `
        div[style*="backgroundColor: 'rgb(110, 231, 183)'"],
        div[style*="background-color: rgb(110, 231, 183)"],
        div[style*="borderRadius: '50%'"][style*="width: 100"],
        div[style*="border-radius: 50%"][style*="width: 100"],
        .fixed.inset-0[style*="background"],
        canvas + div.fixed.inset-0 {
          display: none !important;
        }
      `
      document.head.appendChild(style)
    }
    
    // Run immediately
    removeCircle()
    
    // Run multiple times to catch dynamic content
    const intervals = [0, 50, 100, 200, 500, 1000, 2000]
    intervals.forEach(delay => {
      setTimeout(removeCircle, delay)
    })
    
    // Watch for new elements
    const observer = new MutationObserver(() => {
      removeCircle()
    })
    
    if (document.body) {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style']
      })
    }
    
    return () => observer.disconnect()
  }, [])
  
  return null
}
