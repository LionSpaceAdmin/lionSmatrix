/**
 * Image utility functions for optimization and processing
 */

/**
 * Generate a blur data URL for use as a placeholder
 */
export function generateBlurDataURL(width: number = 10, height: number = 10, color: string = '#1a1a1a'): string {
  // Create a simple SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur" x="0" y="0">
          <fegaussianblur in="SourceGraphic" stdDeviation="2"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="${color}" filter="url(#blur)" opacity="0.4"/>
    </svg>
  `.trim()
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

/**
 * Get optimized image URLs for different formats
 */
export function getImageVariants(src: string, width?: number, quality?: number) {
  const baseUrl = src.includes('?') ? src.split('?')[0] : src
  const params = new URLSearchParams()
  
  if (width) params.set('w', width.toString())
  if (quality) params.set('q', quality.toString())
  
  const queryString = params.toString()
  const separator = queryString ? '&' : ''
  
  return {
    webp: `${baseUrl}?${queryString}${separator}f=webp`,
    avif: `${baseUrl}?${queryString}${separator}f=avif`,
    original: queryString ? `${baseUrl}?${queryString}` : baseUrl
  }
}

/**
 * Get responsive image sizes based on container type
 */
export function getResponsiveSizes(container: 'full' | 'half' | 'third' | 'quarter' | 'sidebar'): string {
  const sizeMap = {
    full: '100vw',
    half: '(max-width: 768px) 100vw, 50vw',
    third: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    quarter: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
    sidebar: '(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw'
  }
  
  return sizeMap[container]
}

/**
 * Convert image to WebP format (client-side)
 */
export function convertToWebP(file: File, quality: number = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      
      if (ctx) {
        ctx.drawImage(img, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to convert image to WebP'))
          }
        }, 'image/webp', quality)
      } else {
        reject(new Error('Failed to get canvas context'))
      }
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * Calculate optimal image dimensions while maintaining aspect ratio
 */
export function calculateOptimalDimensions(
  originalWidth: number, 
  originalHeight: number, 
  maxWidth: number, 
  maxHeight?: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight
  
  if (!maxHeight) {
    return {
      width: Math.min(originalWidth, maxWidth),
      height: Math.min(originalHeight, maxWidth / aspectRatio)
    }
  }
  
  let width = maxWidth
  let height = width / aspectRatio
  
  if (height > maxHeight) {
    height = maxHeight
    width = height * aspectRatio
  }
  
  return {
    width: Math.round(width),
    height: Math.round(height)
  }
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`))
    img.src = src
  })
}

/**
 * Get image metadata without loading the full image
 */
export function getImageMetadata(file: File): Promise<{width: number; height: number; type: string}> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: file.type
      })
    }
    
    img.onerror = () => reject(new Error('Failed to get image metadata'))
    img.src = URL.createObjectURL(file)
  })
}