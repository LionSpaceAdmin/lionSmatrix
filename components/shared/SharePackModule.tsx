'use client'

import React, { useState } from 'react'
import { Share2, Copy, Twitter, Facebook, Send, Download, Check, Link2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ShareContent {
  title: string
  text: string
  url: string
  hashtags?: string[]
  via?: string
}

interface SharePackModuleProps {
  content: ShareContent
  className?: string
  showDownload?: boolean
  customMessages?: {
    twitter?: string
    facebook?: string
    telegram?: string
    whatsapp?: string
  }
}

export function SharePackModule({
  content,
  className,
  showDownload = false,
  customMessages
}: SharePackModuleProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const handleCopy = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(item)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const generateShareUrl = (platform: string): string => {
    const encodedUrl = encodeURIComponent(content.url)
    const encodedText = encodeURIComponent(content.text)
    const encodedTitle = encodeURIComponent(content.title)
    
    switch (platform) {
      case 'twitter':
        const twitterText = customMessages?.twitter || content.text
        const hashtags = content.hashtags?.join(',') || ''
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodedUrl}${hashtags ? `&hashtags=${hashtags}` : ''}${content.via ? `&via=${content.via}` : ''}`
      
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
      
      case 'telegram':
        const telegramText = customMessages?.telegram || `${content.title}\n${content.text}`
        return `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(telegramText)}`
      
      case 'whatsapp':
        const whatsappText = customMessages?.whatsapp || `${content.title}\n${content.text}\n${content.url}`
        return `https://wa.me/?text=${encodeURIComponent(whatsappText)}`
      
      default:
        return content.url
    }
  }

  const handleShare = (platform: string) => {
    const url = generateShareUrl(platform)
    window.open(url, '_blank', 'width=600,height=400')
  }

  const handleDownload = () => {
    const sharePackData = {
      title: content.title,
      text: content.text,
      url: content.url,
      hashtags: content.hashtags,
      platforms: {
        twitter: generateShareUrl('twitter'),
        facebook: generateShareUrl('facebook'),
        telegram: generateShareUrl('telegram'),
        whatsapp: generateShareUrl('whatsapp')
      }
    }

    const blob = new Blob([JSON.stringify(sharePackData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `share-pack-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareButtons = [
    { id: 'twitter', icon: Twitter, label: 'Twitter/X', color: 'hover:bg-blue-500/20' },
    { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-600/20' },
    { id: 'telegram', icon: Send, label: 'Telegram', color: 'hover:bg-cyan-500/20' },
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'hover:bg-green-500/20' }
  ]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono font-bold text-terminal-cyan flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          SHARE PACK
        </h3>
        {showDownload && (
          <button
            onClick={handleDownload}
            className="p-2 rounded hover:bg-terminal-secondary transition-colors"
            aria-label="Download share pack"
          >
            <Download className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Preview */}
      <div className="p-3 rounded bg-terminal-secondary border border-terminal-border">
        <h4 className="font-semibold text-terminal-text mb-1">{content.title}</h4>
        <p className="text-sm text-terminal-muted mb-2">{content.text}</p>
        <div className="flex items-center gap-2">
          <Link2 className="w-3 h-3 text-terminal-muted" />
          <span className="text-xs font-mono text-terminal-muted truncate">{content.url}</span>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {shareButtons.map((button) => {
          const Icon = button.icon
          return (
            <button
              key={button.id}
              onClick={() => handleShare(button.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded',
                'bg-terminal-secondary border border-terminal-border',
                'text-terminal-text font-mono text-sm',
                'transition-all duration-200',
                button.color
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{button.label}</span>
            </button>
          )
        })}
      </div>

      {/* Copy Options */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-terminal-muted uppercase">Quick Copy</div>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => handleCopy(content.url, 'url')}
            className="flex items-center justify-between px-3 py-2 rounded bg-terminal-secondary border border-terminal-border hover:border-terminal-cyan/50 transition-colors"
          >
            <span className="text-sm font-mono text-terminal-text">Copy Link</span>
            {copiedItem === 'url' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-terminal-muted" />
            )}
          </button>
          
          <button
            onClick={() => handleCopy(`${content.title}\n${content.text}\n${content.url}`, 'full')}
            className="flex items-center justify-between px-3 py-2 rounded bg-terminal-secondary border border-terminal-border hover:border-terminal-cyan/50 transition-colors"
          >
            <span className="text-sm font-mono text-terminal-text">Copy Full Text</span>
            {copiedItem === 'full' ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-terminal-muted" />
            )}
          </button>

          {content.hashtags && content.hashtags.length > 0 && (
            <button
              onClick={() => handleCopy(content.hashtags!.map(h => `#${h}`).join(' '), 'hashtags')}
              className="flex items-center justify-between px-3 py-2 rounded bg-terminal-secondary border border-terminal-border hover:border-terminal-cyan/50 transition-colors"
            >
              <span className="text-sm font-mono text-terminal-text">Copy Hashtags</span>
              {copiedItem === 'hashtags' ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-terminal-muted" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SharePackModule
