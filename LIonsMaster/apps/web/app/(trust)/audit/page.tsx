'use client'

import { useState } from 'react'
import { FileText, Shield, CheckCircle, AlertCircle, Download, Calendar, Filter, Search, Clock, User, Activity, TrendingUp, Award, Lock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock audit data
const securityAudits = [
  {
    id: 'SEC-2025-001',
    date: '2025-01-15',
    type: 'Penetration Test',
    auditor: 'CyberSec Inc.',
    result: 'Pass',
    score: 98,
    findings: 2,
    critical: 0,
    status: 'Resolved'
  },
  {
    id: 'SEC-2024-012',
    date: '2024-12-01',
    type: 'Security Assessment',
    auditor: 'Internal Team',
    result: 'Pass',
    score: 95,
    findings: 5,
    critical: 0,
    status: 'Resolved'
  },
  {
    id: 'SEC-2024-011',
    date: '2024-11-15',
    type: 'Vulnerability Scan',
    auditor: 'AutoScan Pro',
    result: 'Pass',
    score: 92,
    findings: 8,
    critical: 1,
    status: 'Resolved'
  }
]

const complianceAudits = [
  {
    id: 'COMP-2025-001',
    regulation: 'GDPR',
    date: '2025-01-10',
    auditor: 'EU Compliance Corp',
    status: 'Compliant',
    nextReview: '2025-07-10',
    score: 100
  },
  {
    id: 'COMP-2025-002',
    regulation: 'CCPA',
    date: '2025-01-05',
    auditor: 'California Privacy Auditors',
    status: 'Compliant',
    nextReview: '2025-07-05',
    score: 98
  },
  {
    id: 'COMP-2024-008',
    regulation: 'ISO 27001',
    date: '2024-12-20',
    auditor: 'ISO Certification Body',
    status: 'In Progress',
    nextReview: '2025-03-20',
    score: 85
  }
]

const dataAccessLogs = [
  {
    id: 'LOG-001',
    timestamp: '2025-01-20 14:32:18',
    user: 'admin@lions.com',
    action: 'Export User Data',
    resource: 'User Database',
    ip: '192.168.1.1',
    status: 'Success'
  },
  {
    id: 'LOG-002',
    timestamp: '2025-01-20 13:45:22',
    user: 'dpo@lions.com',
    action: 'Delete User Record',
    resource: 'User ID: 12345',
    ip: '192.168.1.2',
    status: 'Success'
  },
  {
    id: 'LOG-003',
    timestamp: '2025-01-20 12:18:45',
    user: 'audit@lions.com',
    action: 'View Access Logs',
    resource: 'Audit System',
    ip: '192.168.1.3',
    status: 'Success'
  }
]

export default function AuditPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState('30days')

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      'Pass': { color: 'bg-terminal-green/20 text-terminal-green border-terminal-green/30', icon: CheckCircle },
      'Compliant': { color: 'bg-terminal-green/20 text-terminal-green border-terminal-green/30', icon: CheckCircle },
      'Resolved': { color: 'bg-terminal-blue/20 text-terminal-blue border-terminal-blue/30', icon: CheckCircle },
      'In Progress': { color: 'bg-terminal-yellow/20 text-terminal-yellow border-terminal-yellow/30', icon: Clock },
      'Success': { color: 'bg-terminal-green/20 text-terminal-green border-terminal-green/30', icon: CheckCircle },
      'Failed': { color: 'bg-terminal-red/20 text-terminal-red border-terminal-red/30', icon: AlertCircle }
    }
    
    const variant = variants[status] || variants['Pass']
    const Icon = variant.icon
    
    return (
      <Badge className={`${variant.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    )
  }

  const auditStats = [
    { label: 'Security Score', value: '98/100', icon: Shield, color: 'text-terminal-green' },
    { label: 'Compliance Rate', value: '100%', icon: Award, color: 'text-terminal-cyan' },
    { label: 'Last Audit', value: '5 days ago', icon: Calendar, color: 'text-terminal-yellow' },
    { label: 'Open Issues', value: '0', icon: AlertCircle, color: 'text-terminal-blue' }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-terminal-cyan">
          Security & Compliance Audits
        </h1>
        <p className="text-xl text-terminal-muted max-w-3xl mx-auto">
          Complete transparency in our security practices and regulatory compliance.
          All audits are independently verified.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {auditStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="bg-terminal-black border-terminal-border">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-sm text-terminal-muted">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Audit Tabs */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-terminal-cyan">Audit History</CardTitle>
              <CardDescription className="text-terminal-muted">
                View all security, compliance, and access audits
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-terminal-border">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-terminal-muted" />
                <Input
                  placeholder="Search audits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-terminal-bg border-terminal-border"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] bg-terminal-bg border-terminal-border">
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Audits</SelectItem>
                <SelectItem value="security">Security Only</SelectItem>
                <SelectItem value="compliance">Compliance Only</SelectItem>
                <SelectItem value="access">Access Logs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px] bg-terminal-bg border-terminal-border">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="security" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-terminal-bg">
              <TabsTrigger value="security">Security Audits</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="access">Access Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="security" className="mt-6">
              <div className="rounded-lg border border-terminal-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-terminal-border hover:bg-transparent">
                      <TableHead className="text-terminal-cyan">Audit ID</TableHead>
                      <TableHead className="text-terminal-cyan">Date</TableHead>
                      <TableHead className="text-terminal-cyan">Type</TableHead>
                      <TableHead className="text-terminal-cyan">Auditor</TableHead>
                      <TableHead className="text-terminal-cyan">Score</TableHead>
                      <TableHead className="text-terminal-cyan">Findings</TableHead>
                      <TableHead className="text-terminal-cyan">Status</TableHead>
                      <TableHead className="text-terminal-cyan">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityAudits.map((audit) => (
                      <TableRow key={audit.id} className="border-terminal-border hover:bg-terminal-bg/50">
                        <TableCell className="font-mono text-terminal-blue">{audit.id}</TableCell>
                        <TableCell className="text-terminal-text">{audit.date}</TableCell>
                        <TableCell className="text-terminal-text">{audit.type}</TableCell>
                        <TableCell className="text-terminal-text">{audit.auditor}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${audit.score >= 95 ? 'text-terminal-green' : audit.score >= 90 ? 'text-terminal-yellow' : 'text-terminal-red'}`}>
                              {audit.score}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-terminal-text">{audit.findings}</span>
                            {audit.critical > 0 && (
                              <Badge className="bg-terminal-red/20 text-terminal-red text-xs">
                                {audit.critical} critical
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(audit.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-terminal-cyan hover:text-terminal-cyan/80">
                            View Report
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              <div className="rounded-lg border border-terminal-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-terminal-border hover:bg-transparent">
                      <TableHead className="text-terminal-cyan">Audit ID</TableHead>
                      <TableHead className="text-terminal-cyan">Regulation</TableHead>
                      <TableHead className="text-terminal-cyan">Date</TableHead>
                      <TableHead className="text-terminal-cyan">Auditor</TableHead>
                      <TableHead className="text-terminal-cyan">Score</TableHead>
                      <TableHead className="text-terminal-cyan">Status</TableHead>
                      <TableHead className="text-terminal-cyan">Next Review</TableHead>
                      <TableHead className="text-terminal-cyan">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceAudits.map((audit) => (
                      <TableRow key={audit.id} className="border-terminal-border hover:bg-terminal-bg/50">
                        <TableCell className="font-mono text-terminal-blue">{audit.id}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-terminal-cyan text-terminal-cyan">
                            {audit.regulation}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-terminal-text">{audit.date}</TableCell>
                        <TableCell className="text-terminal-text">{audit.auditor}</TableCell>
                        <TableCell>
                          <span className={`font-semibold ${audit.score === 100 ? 'text-terminal-green' : audit.score >= 95 ? 'text-terminal-yellow' : 'text-terminal-red'}`}>
                            {audit.score}%
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(audit.status)}</TableCell>
                        <TableCell className="text-terminal-text">{audit.nextReview}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-terminal-cyan hover:text-terminal-cyan/80">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="access" className="mt-6">
              <div className="rounded-lg border border-terminal-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-terminal-border hover:bg-transparent">
                      <TableHead className="text-terminal-cyan">Log ID</TableHead>
                      <TableHead className="text-terminal-cyan">Timestamp</TableHead>
                      <TableHead className="text-terminal-cyan">User</TableHead>
                      <TableHead className="text-terminal-cyan">Action</TableHead>
                      <TableHead className="text-terminal-cyan">Resource</TableHead>
                      <TableHead className="text-terminal-cyan">IP Address</TableHead>
                      <TableHead className="text-terminal-cyan">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataAccessLogs.map((log) => (
                      <TableRow key={log.id} className="border-terminal-border hover:bg-terminal-bg/50">
                        <TableCell className="font-mono text-terminal-blue">{log.id}</TableCell>
                        <TableCell className="text-terminal-text font-mono text-xs">{log.timestamp}</TableCell>
                        <TableCell className="text-terminal-text">{log.user}</TableCell>
                        <TableCell className="text-terminal-text">{log.action}</TableCell>
                        <TableCell className="text-terminal-text font-mono text-sm">{log.resource}</TableCell>
                        <TableCell className="text-terminal-muted font-mono text-sm">{log.ip}</TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Latest Certifications */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-2xl text-terminal-cyan">Active Certifications</CardTitle>
          <CardDescription className="text-terminal-muted">
            Our current security and compliance certifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-terminal-bg border-terminal-green/30">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">🛡️</div>
                <h4 className="font-semibold text-terminal-green mb-2">SOC 2 Type II</h4>
                <p className="text-sm text-terminal-muted mb-3">Valid until: Dec 2025</p>
                <Button variant="outline" size="sm" className="w-full border-terminal-green/30">
                  View Certificate
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-terminal-bg border-terminal-blue/30">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h4 className="font-semibold text-terminal-blue mb-2">ISO 27001</h4>
                <p className="text-sm text-terminal-muted mb-3">In Progress</p>
                <Button variant="outline" size="sm" className="w-full border-terminal-blue/30">
                  View Progress
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-terminal-bg border-terminal-cyan/30">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h4 className="font-semibold text-terminal-cyan mb-2">PCI DSS</h4>
                <p className="text-sm text-terminal-muted mb-3">Level 1 Compliant</p>
                <Button variant="outline" size="sm" className="w-full border-terminal-cyan/30">
                  View Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-terminal-black border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-cyan">Security Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-terminal-muted">Uptime (30 days)</span>
              <span className="font-semibold text-terminal-green">99.99%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-terminal-muted">Incidents (30 days)</span>
              <span className="font-semibold text-terminal-green">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-terminal-muted">Mean Time to Resolve</span>
              <span className="font-semibold text-terminal-yellow">4.2 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-terminal-muted">Vulnerabilities Patched</span>
              <span className="font-semibold text-terminal-blue">127</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-terminal-muted">Security Training Completion</span>
              <span className="font-semibold text-terminal-green">100%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terminal-black border-terminal-border">
          <CardHeader>
            <CardTitle className="text-terminal-cyan">Upcoming Audits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-terminal-bg rounded-lg border border-terminal-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-terminal-text">GDPR Compliance Review</span>
                <Badge className="bg-terminal-yellow/20 text-terminal-yellow">In 14 days</Badge>
              </div>
              <p className="text-sm text-terminal-muted">Annual compliance assessment</p>
            </div>
            <div className="p-3 bg-terminal-bg rounded-lg border border-terminal-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-terminal-text">Penetration Testing</span>
                <Badge className="bg-terminal-blue/20 text-terminal-blue">In 28 days</Badge>
              </div>
              <p className="text-sm text-terminal-muted">Quarterly security assessment</p>
            </div>
            <div className="p-3 bg-terminal-bg rounded-lg border border-terminal-border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-terminal-text">ISO 27001 Stage 2</span>
                <Badge className="bg-terminal-cyan/20 text-terminal-cyan">In 45 days</Badge>
              </div>
              <p className="text-sm text-terminal-muted">Certification audit</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
