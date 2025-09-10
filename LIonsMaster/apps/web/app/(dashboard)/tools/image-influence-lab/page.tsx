'use client'

import { useState, useCallback } from 'react'
import { 
  Upload, Image as ImageIcon, Plus, X, Download, Share2, 
  AlertCircle, CheckCircle, Copy, Sparkles, Eye, EyeOff,
  RefreshCw, Save, Trash2, Settings, Info, Zap
} from 'lucide-react'
import { OptimizedImage } from '@/components/shared/OptimizedImage'

interface ImageVariant {
  id: string
  headline: string
  caption: string
  hashtags: string[]
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
}

interface UploadedImage {
  id: string
  url: string
  name: string
  size: number
  variants: ImageVariant[]
}

const platformPresets = {
  twitter: { maxChars: 280, imageRatio: '16:9' },
  facebook: { maxChars: 63206, imageRatio: '1.91:1' },
  instagram: { maxChars: 2200, imageRatio: '1:1' },
  linkedin: { maxChars: 3000, imageRatio: '1.91:1' }
}

export default function ImageInfluenceLabPage() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showGuidelines, setShowGuidelines] = useState(true)
  const [analysisMode, setAnalysisMode] = useState<'impact' | 'emotion' | 'engagement'>('impact')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newImage: UploadedImage = {
        id: `img-${Date.now()}`,
        url: e.target?.result as string,
        name: file.name,
        size: file.size,
        variants: [
          {
            id: `var-${Date.now()}-1`,
            headline: 'FACT: The truth behind the image',
            caption: 'What mainstream media won\'t tell you about this critical situation.',
            hashtags: ['FactCheck', 'TruthMatters', 'StayInformed'],
            platform: 'twitter'
          }
        ]
      }
      setUploadedImages(prev => [...prev, newImage])
      setSelectedImage(newImage.id)
    }
    reader.readAsDataURL(file)
  }

  const addVariant = (imageId: string) => {
    setUploadedImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const newVariant: ImageVariant = {
          id: `var-${Date.now()}`,
          headline: '',
          caption: '',
          hashtags: [],
          platform: 'twitter'
        }
        return { ...img, variants: [...img.variants, newVariant] }
      }
      return img
    }))
  }

  const updateVariant = (imageId: string, variantId: string, field: keyof ImageVariant, value: any) => {
    setUploadedImages(prev => prev.map(img => {
      if (img.id === imageId) {
        return {
          ...img,
          variants: img.variants.map(v => 
            v.id === variantId ? { ...v, [field]: value } : v
          )
        }
      }
      return img
    }))
  }

  const deleteVariant = (imageId: string, variantId: string) => {
    setUploadedImages(prev => prev.map(img => {
      if (img.id === imageId) {
        return {
          ...img,
          variants: img.variants.filter(v => v.id !== variantId)
        }
      }
      return img
    }))
  }

  const exportSharePack = () => {
    // Mock export functionality
    console.log('Exporting share pack...', uploadedImages)
    alert('Share pack exported! (Mock functionality)')
  }

  const selectedImageData = uploadedImages.find(img => img.id === selectedImage)

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-terminal-cyan" />
              <div>
                <h1 className="text-2xl font-bold font-mono text-terminal-cyan">
                  IMAGE INFLUENCE LAB
                </h1>
                <p className="text-xs text-terminal-muted">
                  Test and optimize visual messaging variants
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowGuidelines(!showGuidelines)}
                className={`p-2 rounded-lg border transition-colors ${
                  showGuidelines 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-terminal-secondary border-terminal-border text-terminal-text'
                }`}
                title="Toggle Guidelines"
              >
                <Info className="w-5 h-5" />
              </button>
              <button
                onClick={exportSharePack}
                disabled={uploadedImages.length === 0}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500 
                         text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                EXPORT PACK
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Guidelines Panel */}
        {showGuidelines && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-terminal-secondary 
                        border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-mono font-bold text-yellow-400 mb-2">
                  CONTENT GUIDELINES
                </h3>
                <ul className="text-sm text-terminal-muted space-y-1">
                  <li>• Always verify image authenticity before sharing</li>
                  <li>• Include context and sources in captions</li>
                  <li>• Avoid sensationalism - stick to facts</li>
                  <li>• Test multiple variants to find most effective messaging</li>
                  <li>• Consider cultural sensitivity across regions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload & Images */}
          <div className="space-y-6">
            {/* Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-lg border-2 border-dashed transition-all duration-200 ${
                isDragging 
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-terminal-border bg-terminal-secondary hover:border-terminal-cyan'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-8 text-center">
                <Upload className="w-12 h-12 text-terminal-cyan mx-auto mb-4" />
                <p className="text-terminal-cyan font-mono font-bold mb-2">
                  DROP IMAGE HERE
                </p>
                <p className="text-xs text-terminal-muted">
                  or click to browse (PNG, JPG, GIF)
                </p>
              </div>
            </div>

            {/* Uploaded Images List */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-terminal-cyan">
                UPLOADED IMAGES ({uploadedImages.length})
              </h3>
              {uploadedImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedImage === img.id 
                      ? 'bg-cyan-500/20 border-cyan-500' 
                      : 'bg-terminal-secondary border-terminal-border hover:border-terminal-cyan'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <OptimizedImage 
                      src={img.url} 
                      alt={img.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded"
                      aspectRatio="square"
                      priority={false}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-mono text-terminal-text truncate">
                        {img.name}
                      </p>
                      <p className="text-xs text-terminal-muted">
                        {(img.size / 1024).toFixed(1)} KB • {img.variants.length} variants
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedImages(prev => prev.filter(i => i.id !== img.id))
                        if (selectedImage === img.id) setSelectedImage(null)
                      }}
                      className="p-1 rounded hover:bg-red-500/20 text-terminal-muted 
                               hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Mode Selector */}
            <div className="space-y-3">
              <h3 className="text-sm font-mono text-terminal-cyan">
                ANALYSIS MODE
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {(['impact', 'emotion', 'engagement'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setAnalysisMode(mode)}
                    className={`py-2 px-3 rounded font-mono text-xs transition-all ${
                      analysisMode === mode
                        ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'
                        : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'
                    }`}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Variants Editor */}
          <div className="lg:col-span-2">
            {selectedImageData ? (
              <div className="space-y-6">
                {/* Selected Image Preview */}
                <div className="rounded-lg overflow-hidden bg-terminal-secondary border border-terminal-border">
                  <div className="aspect-video relative">
                    <OptimizedImage 
                      src={selectedImageData.url} 
                      alt={selectedImageData.name}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="px-2 py-1 rounded bg-terminal-bg/90 border border-terminal-cyan 
                                     text-xs font-mono text-terminal-cyan">
                        ORIGINAL
                      </span>
                    </div>
                  </div>
                </div>

                {/* Variants */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-mono text-terminal-cyan">
                      MESSAGE VARIANTS
                    </h3>
                    <button
                      onClick={() => addVariant(selectedImageData.id)}
                      className="px-3 py-1 rounded-lg bg-terminal-secondary border border-terminal-border 
                               text-terminal-cyan font-mono text-sm hover:border-terminal-cyan 
                               transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      ADD VARIANT
                    </button>
                  </div>

                  {selectedImageData.variants.map((variant, index) => (
                    <div
                      key={variant.id}
                      className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border space-y-3"
                    >
                      {/* Variant Header */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-terminal-cyan">
                          VARIANT #{index + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          {/* Platform Selector */}
                          <select
                            value={variant.platform}
                            onChange={(e) => updateVariant(
                              selectedImageData.id, 
                              variant.id, 
                              'platform', 
                              e.target.value
                            )}
                            className="px-2 py-1 rounded bg-terminal-bg border border-terminal-border 
                                     text-terminal-text text-xs font-mono focus:border-terminal-cyan 
                                     focus:outline-none"
                          >
                            <option value="twitter">Twitter</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="linkedin">LinkedIn</option>
                          </select>
                          
                          <button
                            onClick={() => deleteVariant(selectedImageData.id, variant.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-terminal-muted 
                                     hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Headline Input */}
                      <div>
                        <label className="block text-xs font-mono text-terminal-muted mb-1">
                          HEADLINE ({variant.headline.length}/{platformPresets[variant.platform].maxChars})
                        </label>
                        <input
                          type="text"
                          value={variant.headline}
                          onChange={(e) => updateVariant(
                            selectedImageData.id, 
                            variant.id, 
                            'headline', 
                            e.target.value
                          )}
                          placeholder="Eye-catching headline..."
                          className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border 
                                   rounded text-terminal-text font-mono text-sm 
                                   placeholder-terminal-muted focus:border-terminal-cyan 
                                   focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Caption Textarea */}
                      <div>
                        <label className="block text-xs font-mono text-terminal-muted mb-1">
                          CAPTION
                        </label>
                        <textarea
                          value={variant.caption}
                          onChange={(e) => updateVariant(
                            selectedImageData.id, 
                            variant.id, 
                            'caption', 
                            e.target.value
                          )}
                          placeholder="Supporting text and context..."
                          rows={3}
                          className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border 
                                   rounded text-terminal-text font-mono text-sm 
                                   placeholder-terminal-muted focus:border-terminal-cyan 
                                   focus:outline-none transition-colors resize-none"
                        />
                      </div>

                      {/* Hashtags */}
                      <div>
                        <label className="block text-xs font-mono text-terminal-muted mb-1">
                          HASHTAGS
                        </label>
                        <input
                          type="text"
                          value={variant.hashtags.join(' ')}
                          onChange={(e) => updateVariant(
                            selectedImageData.id, 
                            variant.id, 
                            'hashtags', 
                            e.target.value.split(' ').filter(Boolean)
                          )}
                          placeholder="#FactCheck #TruthMatters"
                          className="w-full px-3 py-2 bg-terminal-bg border border-terminal-border 
                                   rounded text-terminal-text font-mono text-sm 
                                   placeholder-terminal-muted focus:border-terminal-cyan 
                                   focus:outline-none transition-colors"
                        />
                      </div>

                      {/* AI Analysis Preview */}
                      <div className="p-3 rounded bg-terminal-bg border border-terminal-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span className="text-xs font-mono text-terminal-cyan">
                            AI ANALYSIS - {analysisMode.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                          <div>
                            <span className="text-terminal-muted">Impact:</span>
                            <div className="mt-1 h-2 bg-terminal-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                                style={{ width: `${65 + index * 10}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-terminal-muted">Clarity:</span>
                            <div className="mt-1 h-2 bg-terminal-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                                style={{ width: `${75 + index * 5}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <span className="text-terminal-muted">Virality:</span>
                            <div className="mt-1 h-2 bg-terminal-secondary rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                                style={{ width: `${55 + index * 15}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Preview Button */}
                      <button
                        className="w-full py-2 rounded bg-terminal-bg border border-terminal-border 
                                 text-terminal-cyan font-mono text-xs hover:bg-cyan-500/10 
                                 hover:border-cyan-500 transition-colors flex items-center 
                                 justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        PREVIEW ON {variant.platform.toUpperCase()}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-terminal-muted mx-auto mb-4" />
                  <p className="text-terminal-muted font-mono">
                    Upload an image to start creating variants
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
