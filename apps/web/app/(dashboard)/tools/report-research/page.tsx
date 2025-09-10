'use client'

import { useState } from 'react'
import { 
  Flag, Upload, FileText, Image, Video, Link2, 
  AlertTriangle, Send, Loader2, CheckCircle, 
  Info, Shield, Clock, Hash, MapPin, User,
  Globe, Calendar, Paperclip, X, Plus
} from 'lucide-react'

interface Attachment {
  id: string
  name: string
  size: number
  type: string
  preview?: string
}

interface Report {
  id: string
  type: 'disinformation' | 'deepfake' | 'harassment' | 'impersonation' | 'other'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  sourceUrl: string
  platform: string
  location: string
  dateObserved: string
  attachments: Attachment[]
  additionalNotes: string
  consent: boolean
  anonymous: boolean
}

const platforms = [
  'Twitter/X', 'Facebook', 'Instagram', 'TikTok', 'YouTube', 
  'Telegram', 'WhatsApp', 'Reddit', 'LinkedIn', 'Other'
]

const reportTypes = [
  { value: 'disinformation', label: 'Disinformation Campaign', icon: Globe },
  { value: 'deepfake', label: 'Deep Fake Content', icon: Video },
  { value: 'harassment', label: 'Coordinated Harassment', icon: AlertTriangle },
  { value: 'impersonation', label: 'Identity Impersonation', icon: User },
  { value: 'other', label: 'Other Suspicious Activity', icon: Flag }
]

export default function ReportResearchPage() {
  const [report, setReport] = useState<Report>({
    id: `report-${Date.now()}`,
    type: 'disinformation',
    urgency: 'medium',
    title: '',
    description: '',
    sourceUrl: '',
    platform: 'Twitter/X',
    location: '',
    dateObserved: new Date().toISOString().split('T')[0],
    attachments: [],
    additionalNotes: '',
    consent: false,
    anonymous: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `att-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))

    setReport(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }))
  }

  const removeAttachment = (id: string) => {
    setReport(prev => ({
      ...prev,
      attachments: prev.attachments.filter(att => att.id !== id)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!report.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!report.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!report.consent) {
      newErrors.consent = 'You must agree to the terms'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Mock submission
    setTimeout(() => {
      const generatedTicketId = `LION-${Date.now().toString(36).toUpperCase()}`
      setTicketId(generatedTicketId)
      setSubmitSuccess(true)
      setIsSubmitting(false)
    }, 2000)
  }

  const resetForm = () => {
    setReport({
      id: `report-${Date.now()}`,
      type: 'disinformation',
      urgency: 'medium',
      title: '',
      description: '',
      sourceUrl: '',
      platform: 'Twitter/X',
      location: '',
      dateObserved: new Date().toISOString().split('T')[0],
      attachments: [],
      additionalNotes: '',
      consent: false,
      anonymous: false
    })
    setSubmitSuccess(false)
    setTicketId(null)
    setErrors({})
  }

  if (submitSuccess && ticketId) {
    return (
      <div className="min-h-screen bg-terminal-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
              <CheckCircle className="w-16 h-16 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold font-mono text-terminal-cyan mb-2">
              REPORT SUBMITTED
            </h1>
            <p className="text-terminal-muted">
              Thank you for helping us fight disinformation
            </p>
          </div>

          <div className="p-6 rounded-lg bg-terminal-secondary border border-terminal-border space-y-4">
            <div className="text-center">
              <p className="text-sm text-terminal-muted mb-2">Your ticket ID:</p>
              <div className="p-3 rounded bg-terminal-bg border border-terminal-cyan">
                <code className="text-lg font-mono text-terminal-cyan">{ticketId}</code>
              </div>
            </div>

            <div className="space-y-2 text-sm text-terminal-muted">
              <p className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Our team will review your submission within 24 hours
              </p>
              <p className="flex items-start gap-2">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                High-priority reports are escalated immediately
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                You'll receive updates via your registered email
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <button
                onClick={resetForm}
                className="w-full py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                         text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                         transition-all duration-200"
              >
                SUBMIT ANOTHER REPORT
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="w-full py-3 rounded-lg bg-terminal-bg border border-terminal-border 
                         text-terminal-text font-mono hover:border-terminal-cyan 
                         transition-colors"
              >
                BACK TO DASHBOARD
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-terminal-bg">
      {/* Header */}
      <div className="border-b border-terminal-border bg-terminal-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Flag className="w-8 h-8 text-terminal-cyan" />
            <div>
              <h1 className="text-2xl font-bold font-mono text-terminal-cyan">
                REPORT & RESEARCH
              </h1>
              <p className="text-xs text-terminal-muted">
                Submit suspicious content for investigation
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alert Banner */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-terminal-secondary 
                        border border-yellow-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-mono font-bold text-yellow-400 mb-1">
                  REPORTING GUIDELINES
                </h3>
                <p className="text-sm text-terminal-muted">
                  Submit only verified suspicious content. False reports may result in account suspension.
                  All submissions are reviewed by our security team.
                </p>
              </div>
            </div>
          </div>

          {/* Report Type & Urgency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                REPORT TYPE
              </label>
              <div className="space-y-2">
                {reportTypes.map(({ value, label, icon: Icon }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      report.type === value
                        ? 'bg-cyan-500/20 border-cyan-500'
                        : 'bg-terminal-secondary border-terminal-border hover:border-terminal-cyan'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={value}
                      checked={report.type === value}
                      onChange={(e) => setReport(prev => ({ ...prev, type: e.target.value as Report['type'] }))}
                      className="sr-only"
                    />
                    <Icon className={`w-5 h-5 ${report.type === value ? 'text-cyan-400' : 'text-terminal-muted'}`} />
                    <span className={`text-sm font-mono ${report.type === value ? 'text-cyan-400' : 'text-terminal-text'}`}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                URGENCY LEVEL
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setReport(prev => ({ ...prev, urgency: level }))}
                    className={`py-3 px-4 rounded-lg font-mono text-sm transition-all ${
                      report.urgency === level
                        ? level === 'critical' 
                          ? 'bg-red-500/20 border-2 border-red-500 text-red-400'
                          : level === 'high'
                          ? 'bg-orange-500/20 border-2 border-orange-500 text-orange-400'
                          : level === 'medium'
                          ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
                          : 'bg-green-500/20 border-2 border-green-500 text-green-400'
                        : 'bg-terminal-secondary border border-terminal-border text-terminal-text hover:border-terminal-cyan'
                    }`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-terminal-muted">
                {report.urgency === 'critical' && 'Immediate threat requiring urgent action'}
                {report.urgency === 'high' && 'Significant threat with potential for rapid spread'}
                {report.urgency === 'medium' && 'Moderate threat requiring investigation'}
                {report.urgency === 'low' && 'Low-priority suspicious activity'}
              </p>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                REPORT TITLE *
              </label>
              <input
                type="text"
                value={report.title}
                onChange={(e) => setReport(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief, descriptive title..."
                className={`w-full px-4 py-3 bg-terminal-secondary border rounded-lg 
                         text-terminal-text font-mono placeholder-terminal-muted
                         focus:border-terminal-cyan focus:outline-none transition-colors
                         ${errors.title ? 'border-red-500' : 'border-terminal-border'}`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-400 font-mono">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                DETAILED DESCRIPTION *
              </label>
              <textarea
                value={report.description}
                onChange={(e) => setReport(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the suspicious content..."
                rows={6}
                className={`w-full px-4 py-3 bg-terminal-secondary border rounded-lg 
                         text-terminal-text font-mono placeholder-terminal-muted
                         focus:border-terminal-cyan focus:outline-none transition-colors resize-none
                         ${errors.description ? 'border-red-500' : 'border-terminal-border'}`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-400 font-mono">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Source Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                SOURCE URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
                <input
                  type="url"
                  value={report.sourceUrl}
                  onChange={(e) => setReport(prev => ({ ...prev, sourceUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border 
                           rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                           focus:border-terminal-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                PLATFORM
              </label>
              <select
                value={report.platform}
                onChange={(e) => setReport(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full px-4 py-3 bg-terminal-secondary border border-terminal-border 
                         rounded-lg text-terminal-text font-mono focus:border-terminal-cyan 
                         focus:outline-none transition-colors"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                LOCATION (if applicable)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
                <input
                  type="text"
                  value={report.location}
                  onChange={(e) => setReport(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country or Region"
                  className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border 
                           rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                           focus:border-terminal-cyan focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-terminal-cyan mb-2">
                DATE OBSERVED
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-terminal-muted" />
                <input
                  type="date"
                  value={report.dateObserved}
                  onChange={(e) => setReport(prev => ({ ...prev, dateObserved: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-terminal-secondary border border-terminal-border 
                           rounded-lg text-terminal-text font-mono focus:border-terminal-cyan 
                           focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-mono text-terminal-cyan mb-2">
              ATTACHMENTS
            </label>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="p-4 rounded-lg border-2 border-dashed border-terminal-border 
                              bg-terminal-secondary hover:border-terminal-cyan transition-colors">
                  <div className="flex items-center justify-center gap-3">
                    <Upload className="w-6 h-6 text-terminal-cyan" />
                    <span className="text-sm font-mono text-terminal-text">
                      Click to upload or drag files here
                    </span>
                  </div>
                  <p className="text-xs text-terminal-muted text-center mt-2">
                    Images, videos, PDFs, documents (max 10MB each)
                  </p>
                </div>
              </div>

              {/* Attachment List */}
              {report.attachments.length > 0 && (
                <div className="space-y-2">
                  {report.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-terminal-bg 
                               border border-terminal-border"
                    >
                      <Paperclip className="w-4 h-4 text-terminal-cyan flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-terminal-text truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-terminal-muted">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(attachment.id)}
                        className="p-1 rounded hover:bg-red-500/20 text-terminal-muted 
                                 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-mono text-terminal-cyan mb-2">
              ADDITIONAL NOTES
            </label>
            <textarea
              value={report.additionalNotes}
              onChange={(e) => setReport(prev => ({ ...prev, additionalNotes: e.target.value }))}
              placeholder="Any other relevant information..."
              rows={4}
              className="w-full px-4 py-3 bg-terminal-secondary border border-terminal-border 
                       rounded-lg text-terminal-text font-mono placeholder-terminal-muted
                       focus:border-terminal-cyan focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Consent & Anonymous */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={report.consent}
                onChange={(e) => setReport(prev => ({ ...prev, consent: e.target.checked }))}
                className="mt-1 w-4 h-4 bg-terminal-secondary border border-terminal-border rounded 
                         text-terminal-cyan focus:ring-terminal-cyan"
              />
              <div>
                <span className={`text-sm font-mono ${errors.consent ? 'text-red-400' : 'text-terminal-text'}`}>
                  I consent to sharing this information for investigation purposes *
                </span>
                <p className="text-xs text-terminal-muted mt-1">
                  Your report will be reviewed by our security team and may be shared with relevant authorities
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={report.anonymous}
                onChange={(e) => setReport(prev => ({ ...prev, anonymous: e.target.checked }))}
                className="mt-1 w-4 h-4 bg-terminal-secondary border border-terminal-border rounded 
                         text-terminal-cyan focus:ring-terminal-cyan"
              />
              <div>
                <span className="text-sm font-mono text-terminal-text">
                  Submit anonymously
                </span>
                <p className="text-xs text-terminal-muted mt-1">
                  Your identity will be protected, but we may not be able to follow up
                </p>
              </div>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-cyan-500/20 border-2 border-cyan-500 
                     text-cyan-400 font-mono font-bold hover:bg-cyan-500/30 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                SUBMITTING REPORT...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                SUBMIT REPORT
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
