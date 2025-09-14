import { ImageLoader } from 'next/image'

/**
 * Custom image loader for Next.js Image optimization
 * Handles different CDN configurations and fallbacks
 */
export const imageLoader: ImageLoader = ({ src, width, quality }) => {
  // Handle absolute URLs (external images)
  if (src.startsWith('http')) {
    return `${src}?w=${width}&q=${quality || 75}`
  }

  // Handle local images
  if (process.env.NODE_ENV === 'production') {
    // In production, you might want to use a CDN
    const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN
    if (cdnDomain) {
      return `${cdnDomain}${src}?w=${width}&q=${quality || 75}`
    }
  }

  // Default behavior for local development
  return `${src}?w=${width}&q=${quality || 75}`
}

export default imageLoader