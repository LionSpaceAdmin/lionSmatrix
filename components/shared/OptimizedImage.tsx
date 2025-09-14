'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string
  alt: string
  fallbackSrc?: string
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | string
  blurDataURL?: string
  showSpinner?: boolean
  className?: string
}

const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video', 
  wide: 'aspect-[21/9]',
  portrait: 'aspect-[3/4]'
}

/**
 * Optimized Image component with WebP/AVIF support, fallbacks, and blur placeholders
 * Automatically handles responsive sizing and loading states
 */
export function OptimizedImage({
  src,
  alt,
  fallbackSrc,
  aspectRatio,
  blurDataURL,
  showSpinner = true,
  className,
  width,
  height,
  fill = false,
  sizes,
  priority = false,
  quality = 85,
  placeholder = 'blur',
  ...props
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Generate blur placeholder if not provided
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#1a1a1a' // terminal-bg color
      ctx.fillRect(0, 0, w, h)
    }
    return canvas.toDataURL()
  }

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  const imageSrc = imageError && fallbackSrc ? fallbackSrc : src

  // Determine responsive sizes if not provided
  const responsiveSizes = sizes || (
    fill 
      ? '100vw'
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  )

  // Generate blur data URL if needed
  const blurPlaceholder = blurDataURL || (
    typeof window !== 'undefined' && width && height
      ? generateBlurDataURL(typeof width === 'number' ? width : 10, typeof height === 'number' ? height : 10)
      : undefined
  )

  return (
    <div className={cn(
      'relative overflow-hidden',
      aspectRatio && aspectRatios[aspectRatio as keyof typeof aspectRatios],
      aspectRatio && !aspectRatios[aspectRatio as keyof typeof aspectRatios] && aspectRatio,
      className
    )}>
      {/* Loading spinner */}
      {isLoading && showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-terminal-secondary">
          <div className="w-8 h-8 border-2 border-terminal-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Main image */}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        sizes={responsiveSizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurPlaceholder}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          fill && 'absolute inset-0 w-full h-full'
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />

      {/* Error fallback */}
      {imageError && !fallbackSrc && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-terminal-secondary text-terminal-muted">
          <svg
            className="w-12 h-12 mb-2 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs font-mono">Image failed to load</p>
        </div>
      )}
    </div>
  )
}

/**
 * Avatar component with optimized image loading
 */
export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className,
  fallback,
  ...props
}: {
  src: string
  alt: string
  size?: number
  className?: string
  fallback?: string
} & Omit<OptimizedImageProps, 'width' | 'height' | 'aspectRatio'>) {
  return (
    <div className={cn(
      'relative rounded-full overflow-hidden bg-terminal-secondary',
      className
    )} style={{ width: size, height: size }}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        aspectRatio="square"
        fallbackSrc={fallback}
        className="rounded-full"
        {...props}
      />
    </div>
  )
}

/**
 * Icon image component for logos and small graphics
 */
export function OptimizedIcon({
  src,
  alt,
  size = 24,
  className,
  ...props
}: {
  src: string
  alt: string
  size?: number
  className?: string
} & Omit<OptimizedImageProps, 'width' | 'height'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('inline-block', className)}
      priority
      {...props}
    />
  )
}