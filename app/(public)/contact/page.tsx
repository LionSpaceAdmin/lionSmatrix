'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { Send, Mail, MessageCircle, Twitter, Shield, AlertCircle, CheckCircle, Loader2, Phone, MapPin, Clock } from 'lucide-react'

// Contact channels
const contactChannels = [
  {
    id: 'email',
    icon: Mail,
    title: 'Email',
    value: 'contact@lionsofzion.io',
    description: 'General inquiries and support',
    action: 'mailto:contact@lionsofzion.io'
  },
  {
    id: 'telegram',
    icon: Send,
    title: 'Telegram',
    value: '@LionsOfZionSupport',
    description: 'Quick questions and community chat',
    action: 'https://t.me/LionsOfZionSupport'
  },
  {
    id: 'twitter',
    icon: Twitter,
    title: 'Twitter/X',
    value: '@LionsOfZion',
    description: 'Public updates and rapid response',
    action: 'https://twitter.com/LionsOfZion'
  },
  {
    id: 'secure',
    icon: Shield,
    title: 'Secure Drop',
    value: 'lions7zion.onion',
    description: 'Anonymous and encrypted submissions',
    action: '#'
  }
]

// Office locations
const offices = [
  {
    location: 'Global HQ',
    address: 'Tel Aviv, Israel',
    timezone: 'GMT+2',
    hours: '9:00 - 18:00 Sun-Thu'
  },
  {
    location: 'Europe',
    address: 'Berlin, Germany',
    timezone: 'GMT+1',
    hours: '9:00 - 18:00 Mon-Fri'
  },
  {
    location: 'Americas',
    address: 'New York, USA',
    timezone: 'GMT-5',
    hours: '9:00 - 18:00 Mon-Fri'
  },
  {
    location: 'Asia Pacific',
    address: 'Singapore',
    timezone: 'GMT+8',
    hours: '9:00 - 18:00 Mon-Fri'
  }
]

// Form categories
const categories = [
  'General Inquiry',
  'Report Disinformation',
  'Media/Press',
  'Partnership',
  'Technical Support',
  'Volunteer',
  'Security Report',
  'Other'
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
    consent: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    if (!formData.consent) {
      newErrors.consent = 'You must agree to the privacy policy'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    // Mock submission - in production, this would send to an API
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock success
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        category: 'General Inquiry',
        subject: '',
        message: '',
        consent: false
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <main className="min-h-screen bg-terminal-bg">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-mono text-terminal-cyan mb-2">
            CONTACT COMMAND CENTER
          </h1>
          <p className="text-terminal-muted max-w-2xl mx-auto">
            Report threats, ask questions, or join our global network. Every message helps defend truth.
          </p>
        </div>

        {/* Contact Channels */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-6 text-center">
            DIRECT CHANNELS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactChannels.map((channel) => {
              const Icon = channel.icon
              return (
                <a
                  key={channel.id}
                  href={channel.action}
                  target={channel.id !== 'email' ? '_blank' : undefined}
                  rel={channel.id !== 'email' ? 'noopener noreferrer' : undefined}
                  className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border 
                           hover:border-terminal-cyan transition-all duration-200 group"
                >
                  <Icon className="w-8 h-8 text-terminal-cyan mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold font-mono text-terminal-cyan mb-1">{channel.title}</h3>
                  <p className="text-sm font-mono text-terminal-text mb-1">{channel.value}</p>
                  <p className="text-xs text-terminal-muted">{channel.description}</p>
                </a>
              )
            })}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-6 text-center">
            SEND MESSAGE
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-mono text-terminal-cyan mb-2">
                    NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-terminal-secondary border rounded 
                             text-terminal-text font-mono placeholder-terminal-muted
                             focus:border-terminal-cyan focus:outline-none transition-colors
                             ${errors.name ? 'border-red-500' : 'border-terminal-border'}`}
                    placeholder="Your name or alias"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400 font-mono">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-mono text-terminal-cyan mb-2">
                    EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-terminal-secondary border rounded 
                             text-terminal-text font-mono placeholder-terminal-muted
                             focus:border-terminal-cyan focus:outline-none transition-colors
                             ${errors.email ? 'border-red-500' : 'border-terminal-border'}`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-400 font-mono">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-mono text-terminal-cyan mb-2">
                  CATEGORY *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-terminal-secondary border border-terminal-border rounded 
                           text-terminal-text font-mono focus:border-terminal-cyan focus:outline-none transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-mono text-terminal-cyan mb-2">
                  SUBJECT *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-terminal-secondary border rounded 
                           text-terminal-text font-mono placeholder-terminal-muted
                           focus:border-terminal-cyan focus:outline-none transition-colors
                           ${errors.subject ? 'border-red-500' : 'border-terminal-border'}`}
                  placeholder="Brief description of your inquiry"
                />
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-400 font-mono">{errors.subject}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-mono text-terminal-cyan mb-2">
                  MESSAGE *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-2 bg-terminal-secondary border rounded 
                           text-terminal-text font-mono placeholder-terminal-muted
                           focus:border-terminal-cyan focus:outline-none transition-colors resize-none
                           ${errors.message ? 'border-red-500' : 'border-terminal-border'}`}
                  placeholder="Provide details about your inquiry..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-400 font-mono">{errors.message}</p>
                )}
              </div>

              {/* Consent */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 bg-terminal-secondary border border-terminal-border rounded 
                             text-terminal-cyan focus:ring-terminal-cyan"
                  />
                  <span className="text-sm text-terminal-muted">
                    I agree to the processing of my data according to the{' '}
                    <a href="/legal/privacy" className="text-cyan-400 hover:underline">
                      Privacy Policy
                    </a>
                    . I understand my data will be used solely to respond to this inquiry and 
                    will be deleted after 90 days.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-red-400 font-mono">{errors.consent}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                           text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                           transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      SEND MESSAGE
                    </>
                  )}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 rounded bg-green-500/10 border border-green-500/30 text-green-400 
                              flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <p className="font-bold font-mono">MESSAGE SENT SUCCESSFULLY</p>
                    <p className="text-sm">We'll respond within 24-48 hours. Check your email for updates.</p>
                  </div>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="p-4 rounded bg-red-500/10 border border-red-500/30 text-red-400 
                              flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p className="font-bold font-mono">SUBMISSION FAILED</p>
                    <p className="text-sm">Please try again or contact us directly via email.</p>
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* Office Locations */}
        <section>
          <h2 className="text-2xl font-bold font-mono text-terminal-cyan mb-6 text-center">
            GLOBAL OPERATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {offices.map((office) => (
              <div key={office.location} className="p-4 rounded-lg bg-terminal-secondary border border-terminal-border">
                <MapPin className="w-6 h-6 text-terminal-cyan mb-2" />
                <h3 className="font-bold font-mono text-terminal-cyan mb-1">{office.location}</h3>
                <p className="text-sm text-terminal-text mb-1">{office.address}</p>
                <div className="flex items-center gap-2 text-xs text-terminal-muted">
                  <Clock className="w-3 h-3" />
                  <span>{office.hours}</span>
                </div>
                <p className="text-xs text-terminal-muted mt-1">{office.timezone}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contact */}
        <div className="mt-12 p-6 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold font-mono text-red-400 mb-2">
            EMERGENCY THREAT REPORTING
          </h3>
          <p className="text-sm text-terminal-muted mb-4">
            For immediate threats requiring rapid response
          </p>
          <div className="flex items-center justify-center gap-2 text-red-400 font-mono">
            <Phone className="w-5 h-5" />
            <span className="text-lg font-bold">HOTLINE: +1-800-LIONS-01</span>
          </div>
          <p className="text-xs text-terminal-muted mt-2">
            Available 24/7 • Multiple languages • Secure line
          </p>
        </div>
      </div>
    </main>
  )
}
