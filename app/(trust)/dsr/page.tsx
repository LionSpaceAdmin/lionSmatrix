'use client'

import { useState } from 'react'
import { Shield, Download, Trash2, AlertCircle, CheckCircle, Info, Lock, User, Mail, FileText, Calendar, Clock, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { translations } from '@/lib/i18n/translations'
import { useTranslation } from '@/lib/i18n/use-translation'

type RequestType = 'export' | 'delete' | null
type RequestStatus = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  email: string
  firstName: string
  lastName: string
  requestType: RequestType
  reason: string
  additionalInfo: string
  confirmIdentity: boolean
  confirmUnderstand: boolean
  confirmDelete?: boolean // Only for deletion requests
}

// Mock function to generate ticket ID
const generateTicketId = () => {
  return `DSR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export default function DSRPage() {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    requestType: null,
    reason: '',
    additionalInfo: '',
    confirmIdentity: false,
    confirmUnderstand: false,
    confirmDelete: false
  })
  
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.requestType) newErrors.requestType = 'Please select a request type'
    if (!formData.reason) newErrors.reason = 'Please select a reason'
    if (!formData.confirmIdentity) newErrors.confirmIdentity = 'You must confirm your identity'
    if (!formData.confirmUnderstand) newErrors.confirmUnderstand = 'You must acknowledge understanding'
    
    if (formData.requestType === 'delete' && !formData.confirmDelete) {
      newErrors.confirmDelete = 'You must confirm deletion understanding'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setStatus('submitting')
    
    // Simulate API call
    setTimeout(() => {
      const newTicketId = generateTicketId()
      setTicketId(newTicketId)
      setStatus('success')
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          requestType: null,
          reason: '',
          additionalInfo: '',
          confirmIdentity: false,
          confirmUnderstand: false,
          confirmDelete: false
        })
      }, 3000)
    }, 2000)
  }

  const getRequestTypeInfo = (type: 'export' | 'delete') => {
    if (type === 'export') {
      return {
        title: 'Data Export Request',
        description: 'Download a copy of all your personal data',
        icon: Download,
        color: 'text-terminal-blue',
        bgColor: 'bg-terminal-blue/10',
        borderColor: 'border-terminal-blue/20'
      }
    }
    return {
      title: 'Data Deletion Request',
      description: 'Permanently delete all your personal data',
      icon: Trash2,
      color: 'text-terminal-red',
      bgColor: 'bg-terminal-red/10',
      borderColor: 'border-terminal-red/20'
    }
  }

  if (status === 'success' && ticketId) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="bg-terminal-black border-terminal-green">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-terminal-green mx-auto" />
              <h2 className="text-2xl font-bold text-terminal-green">Request Submitted Successfully</h2>
              <p className="text-terminal-muted">
                Your data subject request has been received and will be processed within 30 days.
              </p>
              <Card className="bg-terminal-bg border-terminal-border">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-terminal-muted">Your ticket ID:</p>
                    <p className="text-xl font-mono text-terminal-cyan">{ticketId}</p>
                    <p className="text-xs text-terminal-muted">
                      Please save this ID for your records. You'll receive a confirmation email shortly.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Button 
                onClick={() => {
                  setStatus('idle')
                  setTicketId(null)
                }}
                className="bg-terminal-cyan hover:bg-terminal-cyan/80"
              >
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-terminal-cyan">
          Data Subject Requests
        </h1>
        <p className="text-xl text-terminal-muted max-w-3xl mx-auto">
          Exercise your data protection rights. Request a copy of your personal data or ask for its deletion.
        </p>
      </div>

      {/* GDPR/CCPA Info */}
      <Alert className="border-terminal-blue bg-terminal-blue/10">
        <Shield className="h-4 w-4 text-terminal-blue" />
        <AlertTitle className="text-terminal-blue">Your Data Rights</AlertTitle>
        <AlertDescription className="text-terminal-muted">
          Under GDPR, CCPA, and other data protection laws, you have the right to access, export, 
          and delete your personal data. We process all requests within 30 days and will verify 
          your identity to protect your privacy.
        </AlertDescription>
      </Alert>

      {/* Request Type Selection */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-cyan">Select Request Type</CardTitle>
          <CardDescription className="text-terminal-muted">
            Choose what you'd like to do with your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={formData.requestType || ''} 
            onValueChange={(value) => setFormData({...formData, requestType: value as RequestType})}
          >
            <div className="grid md:grid-cols-2 gap-4">
              {/* Export Option */}
              <label htmlFor="export" className="cursor-pointer">
                <Card className={`transition-all ${formData.requestType === 'export' ? 'border-terminal-blue bg-terminal-blue/5' : 'border-terminal-border hover:border-terminal-blue/50'}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="export" id="export" className="mt-1" />
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Download className="w-5 h-5 text-terminal-blue" />
                          <h3 className="font-semibold text-terminal-text">Data Export</h3>
                        </div>
                        <p className="text-sm text-terminal-muted">
                          Download a complete copy of your personal data in machine-readable format (JSON)
                        </p>
                        <ul className="text-xs text-terminal-muted space-y-1 mt-2">
                          <li>• Account information</li>
                          <li>• Activity history</li>
                          <li>• Preferences & settings</li>
                          <li>• Generated content</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </label>

              {/* Delete Option */}
              <label htmlFor="delete" className="cursor-pointer">
                <Card className={`transition-all ${formData.requestType === 'delete' ? 'border-terminal-red bg-terminal-red/5' : 'border-terminal-border hover:border-terminal-red/50'}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value="delete" id="delete" className="mt-1" />
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <Trash2 className="w-5 h-5 text-terminal-red" />
                          <h3 className="font-semibold text-terminal-text">Data Deletion</h3>
                        </div>
                        <p className="text-sm text-terminal-muted">
                          Permanently delete all your personal data from our systems
                        </p>
                        <Alert className="mt-2 border-terminal-red/20 bg-terminal-red/5">
                          <AlertCircle className="h-3 w-3 text-terminal-red" />
                          <AlertDescription className="text-xs text-terminal-muted">
                            This action is irreversible. Your account and all associated data will be permanently deleted.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </label>
            </div>
          </RadioGroup>
          {errors.requestType && (
            <p className="text-sm text-terminal-red mt-2">{errors.requestType}</p>
          )}
        </CardContent>
      </Card>

      {/* Request Form */}
      {formData.requestType && (
        <Card className="bg-terminal-black border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-cyan">Request Details</CardTitle>
            <CardDescription className="text-terminal-muted">
              Please provide your information to process your request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-terminal-text">Personal Information</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="bg-terminal-bg border-terminal-border"
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-terminal-red">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="bg-terminal-bg border-terminal-border"
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-terminal-red">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-terminal-bg border-terminal-border"
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-terminal-red">{errors.email}</p>
                  )}
                  <p className="text-xs text-terminal-muted">
                    Use the email associated with your Lions of Zion account
                  </p>
                </div>
              </div>

              {/* Request Reason */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-terminal-text">Request Reason</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Why are you making this request? *</Label>
                  <Select 
                    value={formData.reason} 
                    onValueChange={(value) => setFormData({...formData, reason: value})}
                  >
                    <SelectTrigger className="bg-terminal-bg border-terminal-border">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="privacy">Privacy concerns</SelectItem>
                      <SelectItem value="no-longer-use">No longer using the service</SelectItem>
                      <SelectItem value="data-breach">Concerned about data breach</SelectItem>
                      <SelectItem value="regulatory">Regulatory compliance</SelectItem>
                      <SelectItem value="personal">Personal reasons</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.reason && (
                    <p className="text-sm text-terminal-red">{errors.reason}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                    className="bg-terminal-bg border-terminal-border"
                    placeholder="Any additional details you'd like to provide..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Confirmations */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-terminal-text">Confirmations</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="confirmIdentity"
                      checked={formData.confirmIdentity}
                      onCheckedChange={(checked) => setFormData({...formData, confirmIdentity: checked as boolean})}
                    />
                    <Label htmlFor="confirmIdentity" className="text-sm cursor-pointer">
                      I confirm that the information provided above is accurate and that I am the data subject 
                      or authorized to act on behalf of the data subject *
                    </Label>
                  </div>
                  {errors.confirmIdentity && (
                    <p className="text-sm text-terminal-red ml-6">{errors.confirmIdentity}</p>
                  )}

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="confirmUnderstand"
                      checked={formData.confirmUnderstand}
                      onCheckedChange={(checked) => setFormData({...formData, confirmUnderstand: checked as boolean})}
                    />
                    <Label htmlFor="confirmUnderstand" className="text-sm cursor-pointer">
                      I understand that this request will be processed within 30 days and that I may be 
                      contacted for identity verification *
                    </Label>
                  </div>
                  {errors.confirmUnderstand && (
                    <p className="text-sm text-terminal-red ml-6">{errors.confirmUnderstand}</p>
                  )}

                  {formData.requestType === 'delete' && (
                    <>
                      <Alert className="border-terminal-red/20 bg-terminal-red/5">
                        <AlertCircle className="h-4 w-4 text-terminal-red" />
                        <AlertTitle className="text-terminal-red">Final Confirmation</AlertTitle>
                        <AlertDescription className="text-terminal-muted">
                          Deleting your data is permanent and cannot be undone. You will lose access to:
                          <ul className="mt-2 ml-4 list-disc text-xs">
                            <li>Your account and all saved preferences</li>
                            <li>All fact-checks and reports you've created</li>
                            <li>Your contribution history and achievements</li>
                            <li>Access to member-only features</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="confirmDelete"
                          checked={formData.confirmDelete}
                          onCheckedChange={(checked) => setFormData({...formData, confirmDelete: checked as boolean})}
                        />
                        <Label htmlFor="confirmDelete" className="text-sm cursor-pointer">
                          I understand that data deletion is permanent and irreversible. I want to proceed 
                          with deleting all my personal data *
                        </Label>
                      </div>
                      {errors.confirmDelete && (
                        <p className="text-sm text-terminal-red ml-6">{errors.confirmDelete}</p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  className={`flex-1 ${
                    formData.requestType === 'delete' 
                      ? 'bg-terminal-red hover:bg-terminal-red/80' 
                      : 'bg-terminal-blue hover:bg-terminal-blue/80'
                  }`}
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Request...
                    </>
                  ) : (
                    <>
                      {formData.requestType === 'delete' ? (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Submit Deletion Request
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Submit Export Request
                        </>
                      )}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      email: '',
                      firstName: '',
                      lastName: '',
                      requestType: null,
                      reason: '',
                      additionalInfo: '',
                      confirmIdentity: false,
                      confirmUnderstand: false,
                      confirmDelete: false
                    })
                    setErrors({})
                  }}
                  className="border-terminal-border hover:bg-terminal-bg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-terminal-black border-terminal-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-terminal-cyan">
              <Clock className="w-5 h-5" />
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-terminal-muted">
            <p className="text-sm">
              We process all data subject requests within 30 days as required by law.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Identity verification: 1-2 days</li>
              <li>• Data collection: 5-10 days</li>
              <li>• Review & approval: 3-5 days</li>
              <li>• Delivery/deletion: 1-2 days</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-terminal-black border-terminal-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-terminal-cyan">
              <Lock className="w-5 h-5" />
              Security & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-terminal-muted">
            <p className="text-sm">
              To protect your privacy, we verify your identity before processing requests.
            </p>
            <ul className="text-sm space-y-1">
              <li>• Email verification required</li>
              <li>• Additional ID may be requested</li>
              <li>• Secure delivery methods used</li>
              <li>• Audit trail maintained</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-cyan">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-terminal-bg">
              <TabsTrigger value="export">Data Export</TabsTrigger>
              <TabsTrigger value="delete">Data Deletion</TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-terminal-text">What data is included in the export?</h4>
                <p className="text-sm text-terminal-muted">
                  Your export includes all personal data we hold about you: account information, 
                  activity history, content you've created, preferences, and interaction logs.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-terminal-text">What format will I receive my data in?</h4>
                <p className="text-sm text-terminal-muted">
                  Data is provided in JSON format, which is machine-readable and can be opened 
                  with any text editor or imported into other services.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-terminal-text">How will I receive my data?</h4>
                <p className="text-sm text-terminal-muted">
                  You'll receive a secure download link via email. The link expires after 7 days 
                  for security reasons.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="delete" className="space-y-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-terminal-text">What happens when I delete my data?</h4>
                <p className="text-sm text-terminal-muted">
                  All your personal data is permanently removed from our active systems. Some data 
                  may be retained in backups for up to 90 days before complete deletion.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-terminal-text">Can I recover my account after deletion?</h4>
                <p className="text-sm text-terminal-muted">
                  No, data deletion is permanent and cannot be reversed. You would need to create 
                  a new account if you wish to use our services again.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-terminal-text">What data might be retained?</h4>
                <p className="text-sm text-terminal-muted">
                  We may retain certain data for legal compliance, such as transaction records 
                  required for tax purposes, but this will be minimal and anonymized where possible.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
