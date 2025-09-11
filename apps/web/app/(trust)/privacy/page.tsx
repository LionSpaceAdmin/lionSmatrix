'use client'

import { useState } from 'react'
import { Lock, Eye, Shield, Database, Cookie, Globe, Settings, Info, CheckCircle, AlertCircle, User, Mail, Smartphone, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface PrivacySettings {
  analytics: boolean
  marketing: boolean
  functional: boolean
  dataSharing: 'none' | 'minimal' | 'partners'
  retention: number // days
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  visibility: 'private' | 'public' | 'friends'
}

export default function PrivacyPage() {
  const [settings, setSettings] = useState<PrivacySettings>({
    analytics: true,
    marketing: false,
    functional: true,
    dataSharing: 'minimal',
    retention: 90,
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    visibility: 'friends'
  })

  const [savedStatus, setSavedStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSaveSettings = () => {
    setSavedStatus('saving')
    // Simulate save
    setTimeout(() => {
      setSavedStatus('saved')
      setTimeout(() => setSavedStatus('idle'), 3000)
    }, 1000)
  }

  const privacyPrinciples = [
    {
      icon: Database,
      title: 'Data Minimization',
      description: 'We only collect data that is necessary for our services to function'
    },
    {
      icon: Lock,
      title: 'Encryption Everywhere',
      description: 'All data is encrypted in transit and at rest using industry standards'
    },
    {
      icon: User,
      title: 'User Control',
      description: 'You have full control over your data and can modify or delete it anytime'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We are open about what data we collect and how we use it'
    }
  ]

  const dataWeCollect = [
    {
      category: 'Account Information',
      items: ['Email address', 'Name', 'Profile picture', 'Authentication tokens'],
      purpose: 'Account creation and management',
      required: true
    },
    {
      category: 'Usage Data',
      items: ['Pages visited', 'Features used', 'Interaction patterns', 'Device information'],
      purpose: 'Improve our services and user experience',
      required: false
    },
    {
      category: 'Content You Create',
      items: ['Fact-checks', 'Reports', 'Comments', 'Campaign data'],
      purpose: 'Provide our core services',
      required: true
    },
    {
      category: 'Technical Data',
      items: ['IP address', 'Browser type', 'Operating system', 'Cookies'],
      purpose: 'Security and performance',
      required: false
    }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-terminal-cyan">
          Privacy Policy & Controls
        </h1>
        <p className="text-xl text-terminal-muted max-w-3xl mx-auto">
          Your privacy is fundamental to our mission. Control exactly how your data is used.
        </p>
      </div>

      {/* Privacy Principles */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-2xl text-terminal-cyan">Our Privacy Principles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {privacyPrinciples.map((principle) => {
              const Icon = principle.icon
              return (
                <div key={principle.title} className="flex gap-3">
                  <div className="p-2 bg-terminal-bg rounded-lg h-fit">
                    <Icon className="w-5 h-5 text-terminal-cyan" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-terminal-text">{principle.title}</h4>
                    <p className="text-sm text-terminal-muted mt-1">{principle.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-2xl text-terminal-cyan">Privacy Settings</CardTitle>
          <CardDescription className="text-terminal-muted">
            Customize how we handle your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cookies" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-terminal-bg">
              <TabsTrigger value="cookies">Cookies</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="visibility">Visibility</TabsTrigger>
            </TabsList>

            <TabsContent value="cookies" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-terminal-text">Cookie Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-terminal-bg rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="essential" className="text-terminal-text">Essential Cookies</Label>
                      <p className="text-sm text-terminal-muted">Required for the website to function</p>
                    </div>
                    <Switch id="essential" checked={true} disabled />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-terminal-bg rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="analytics" className="text-terminal-text">Analytics Cookies</Label>
                      <p className="text-sm text-terminal-muted">Help us understand how you use our site</p>
                    </div>
                    <Switch 
                      id="analytics" 
                      checked={settings.analytics}
                      onCheckedChange={(checked) => setSettings({...settings, analytics: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-terminal-bg rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="functional" className="text-terminal-text">Functional Cookies</Label>
                      <p className="text-sm text-terminal-muted">Remember your preferences and settings</p>
                    </div>
                    <Switch 
                      id="functional" 
                      checked={settings.functional}
                      onCheckedChange={(checked) => setSettings({...settings, functional: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-terminal-bg rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="marketing" className="text-terminal-text">Marketing Cookies</Label>
                      <p className="text-sm text-terminal-muted">Used for targeted advertising (we don't use these)</p>
                    </div>
                    <Switch 
                      id="marketing" 
                      checked={settings.marketing}
                      onCheckedChange={(checked) => setSettings({...settings, marketing: checked})}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-terminal-text">Data Handling</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-terminal-text">Data Sharing</Label>
                    <RadioGroup 
                      value={settings.dataSharing}
                      onValueChange={(value) => setSettings({...settings, dataSharing: value as any})}
                    >
                      <div className="flex items-center space-x-2 p-3 bg-terminal-bg rounded-lg">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none" className="flex-1 cursor-pointer">
                          <span className="font-medium">No Sharing</span>
                          <p className="text-sm text-terminal-muted">Your data stays with us only</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-terminal-bg rounded-lg">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal" className="flex-1 cursor-pointer">
                          <span className="font-medium">Minimal Sharing</span>
                          <p className="text-sm text-terminal-muted">Only essential service providers</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-terminal-bg rounded-lg">
                        <RadioGroupItem value="partners" id="partners" />
                        <Label htmlFor="partners" className="flex-1 cursor-pointer">
                          <span className="font-medium">Partner Sharing</span>
                          <p className="text-sm text-terminal-muted">Include trusted partners (anonymized)</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-terminal-text">Data Retention Period</Label>
                    <div className="space-y-3">
                      <Slider 
                        value={[settings.retention]} 
                        onValueChange={([value]) => setSettings({...settings, retention: value})}
                        min={30}
                        max={365}
                        step={30}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-terminal-muted">
                        <span>30 days</span>
                        <span className="text-terminal-cyan font-medium">{settings.retention} days</span>
                        <span>365 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-terminal-text">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-terminal-bg rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-terminal-cyan" />
                      <div className="space-y-1">
                        <Label htmlFor="email-notif" className="text-terminal-text">Email Notifications</Label>
                        <p className="text-sm text-terminal-muted">Important updates and alerts</p>
                      </div>
                    </div>
                    <Switch 
                      id="email-notif" 
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, email: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-terminal-bg rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-terminal-cyan" />
                      <div className="space-y-1">
                        <Label htmlFor="push-notif" className="text-terminal-text">Push Notifications</Label>
                        <p className="text-sm text-terminal-muted">Real-time alerts in your browser</p>
                      </div>
                    </div>
                    <Switch 
                      id="push-notif" 
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, push: checked}
                      })}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-terminal-bg rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-terminal-cyan" />
                      <div className="space-y-1">
                        <Label htmlFor="sms-notif" className="text-terminal-text">SMS Notifications</Label>
                        <p className="text-sm text-terminal-muted">Critical alerts only</p>
                      </div>
                    </div>
                    <Switch 
                      id="sms-notif" 
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => setSettings({
                        ...settings, 
                        notifications: {...settings.notifications, sms: checked}
                      })}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="visibility" className="space-y-6 mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-terminal-text">Profile Visibility</h3>
                
                <RadioGroup 
                  value={settings.visibility}
                  onValueChange={(value) => setSettings({...settings, visibility: value as any})}
                >
                  <div className="flex items-center space-x-2 p-3 bg-terminal-bg rounded-lg">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="flex-1 cursor-pointer">
                      <span className="font-medium">Private</span>
                      <p className="text-sm text-terminal-muted">Only you can see your activity</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-terminal-bg rounded-lg">
                    <RadioGroupItem value="friends" id="friends" />
                    <Label htmlFor="friends" className="flex-1 cursor-pointer">
                      <span className="font-medium">Friends Only</span>
                      <p className="text-sm text-terminal-muted">Visible to your connections</p>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-terminal-bg rounded-lg">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="flex-1 cursor-pointer">
                      <span className="font-medium">Public</span>
                      <p className="text-sm text-terminal-muted">Anyone can see your contributions</p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              disabled={savedStatus === 'saving'}
              className={
                savedStatus === 'saved' 
                  ? 'bg-terminal-green hover:bg-terminal-green/80' 
                  : 'bg-terminal-cyan hover:bg-terminal-cyan/80'
              }
            >
              {savedStatus === 'saving' && 'Saving...'}
              {savedStatus === 'saved' && (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Saved
                </>
              )}
              {savedStatus === 'idle' && 'Save Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data We Collect */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-2xl text-terminal-cyan">What Data We Collect</CardTitle>
          <CardDescription className="text-terminal-muted">
            Full transparency about the information we gather
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {dataWeCollect.map((category) => (
              <div key={category.category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-terminal-text">{category.category}</h4>
                  <Badge 
                    variant="outline"
                    className={category.required ? 'border-terminal-yellow text-terminal-yellow' : 'border-terminal-muted text-terminal-muted'}
                  >
                    {category.required ? 'Required' : 'Optional'}
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-terminal-muted mb-2">Data Points:</p>
                    <ul className="space-y-1">
                      {category.items.map((item) => (
                        <li key={item} className="text-sm text-terminal-text flex items-center gap-2">
                          <div className="w-1 h-1 bg-terminal-cyan rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-terminal-muted mb-2">Purpose:</p>
                    <p className="text-sm text-terminal-text">{category.purpose}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-2xl text-terminal-cyan">Your Rights</CardTitle>
          <CardDescription className="text-terminal-muted">
            Under GDPR, CCPA, and other privacy laws
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                <div>
                  <p className="font-medium text-terminal-text">Right to Access</p>
                  <p className="text-sm text-terminal-muted">Request a copy of your data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                <div>
                  <p className="font-medium text-terminal-text">Right to Rectification</p>
                  <p className="text-sm text-terminal-muted">Correct inaccurate data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                <div>
                  <p className="font-medium text-terminal-text">Right to Erasure</p>
                  <p className="text-sm text-terminal-muted">Delete your personal data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                <div>
                  <p className="font-medium text-terminal-text">Right to Portability</p>
                  <p className="text-sm text-terminal-muted">Transfer data to another service</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                <div>
                  <p className="font-medium text-terminal-text">Right to Object</p>
                  <p className="text-sm text-terminal-muted">Opt-out of data processing</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                <div>
                  <p className="font-medium text-terminal-text">Right to Restriction</p>
                  <p className="text-sm text-terminal-muted">Limit how we use your data</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                <div>
                  <p className="font-medium text-terminal-text">Right to Withdraw Consent</p>
                  <p className="text-sm text-terminal-muted">Change permissions anytime</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-terminal-green mt-0.5" />
                <div>
                  <p className="font-medium text-terminal-text">Right to Complain</p>
                  <p className="text-sm text-terminal-muted">Contact regulatory authorities</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact for Privacy */}
      <Alert className="border-terminal-cyan bg-terminal-cyan/10">
        <Info className="h-4 w-4 text-terminal-cyan" />
        <AlertTitle className="text-terminal-cyan">Privacy Questions?</AlertTitle>
        <AlertDescription className="text-terminal-muted">
          Our Data Protection Officer is available to answer any privacy-related questions.
          Email us at <a href="mailto:privacy@lionsofzion.com" className="text-terminal-cyan underline">privacy@lionsofzion.com</a> or 
          use our <a href="/trust/dsr" className="text-terminal-cyan underline">data request form</a>.
        </AlertDescription>
      </Alert>
    </div>
  )
}