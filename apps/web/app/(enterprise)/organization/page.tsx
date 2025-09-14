'use client'

import { useState } from 'react'
import { Users, Shield, Plus, Edit, Trash2, ChevronRight, Lock, UserPlus, Settings, Key, Activity, Building, Mail } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'

// Mock data
const teamMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'Admin',
    department: 'Security',
    status: 'Active',
    lastActive: '2 hours ago',
    avatar: null
  },
  {
    id: 2,
    name: 'Michael Torres',
    email: 'michael.torres@company.com',
    role: 'Analyst',
    department: 'Intelligence',
    status: 'Active',
    lastActive: '5 mins ago',
    avatar: null
  },
  {
    id: 3,
    name: 'Emma Williams',
    email: 'emma.williams@company.com',
    role: 'Viewer',
    department: 'Marketing',
    status: 'Active',
    lastActive: '1 day ago',
    avatar: null
  },
  {
    id: 4,
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    role: 'Analyst',
    department: 'Operations',
    status: 'Invited',
    lastActive: 'Never',
    avatar: null
  }
]

const roles = [
  {
    name: 'Admin',
    description: 'Full system access and management',
    permissions: ['All permissions'],
    users: 2,
    color: 'text-terminal-red'
  },
  {
    name: 'Analyst',
    description: 'Create and manage content, view reports',
    permissions: ['Create content', 'Edit content', 'View reports', 'Export data'],
    users: 5,
    color: 'text-terminal-yellow'
  },
  {
    name: 'Viewer',
    description: 'Read-only access to approved content',
    permissions: ['View content', 'View reports'],
    users: 12,
    color: 'text-terminal-blue'
  },
  {
    name: 'Custom Role',
    description: 'Tailored permissions for specific needs',
    permissions: ['Configurable'],
    users: 3,
    color: 'text-terminal-green'
  }
]

const departments = [
  { name: 'Security', members: 8, lead: 'Sarah Chen' },
  { name: 'Intelligence', members: 5, lead: 'Michael Torres' },
  { name: 'Marketing', members: 3, lead: 'Emma Williams' },
  { name: 'Operations', members: 4, lead: 'David Kim' }
]

const permissions = {
  content: ['View', 'Create', 'Edit', 'Delete', 'Publish'],
  reports: ['View', 'Create', 'Export', 'Schedule'],
  users: ['View', 'Invite', 'Edit', 'Remove', 'Manage Roles'],
  system: ['API Access', 'Integrations', 'Settings', 'Billing', 'Audit Logs']
}

export default function OrganizationPage() {
  const [selectedTab, setSelectedTab] = useState('members')
  const [searchTerm, setSearchTerm] = useState('')
  const [showInviteDialog, setShowInviteDialog] = useState(false)

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, string> = {
      'Admin': 'bg-terminal-red/20 text-terminal-red border-terminal-red/30',
      'Analyst': 'bg-terminal-yellow/20 text-terminal-yellow border-terminal-yellow/30',
      'Viewer': 'bg-terminal-blue/20 text-terminal-blue border-terminal-blue/30',
      'Custom Role': 'bg-terminal-green/20 text-terminal-green border-terminal-green/30'
    }
    
    return (
      <Badge className={roleConfig[role] || 'bg-terminal-muted/20 text-terminal-muted'}>
        {role}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      'Active': 'bg-terminal-green/20 text-terminal-green border-terminal-green/30',
      'Invited': 'bg-terminal-yellow/20 text-terminal-yellow border-terminal-yellow/30',
      'Inactive': 'bg-terminal-muted/20 text-terminal-muted border-terminal-muted/30'
    }
    
    return (
      <Badge className={statusConfig[status] || 'bg-terminal-muted/20 text-terminal-muted'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-terminal-cyan">Organization Management</h1>
          <p className="text-terminal-muted mt-1">Manage your team, roles, and permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-terminal-border">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogTrigger asChild>
              <Button className="bg-terminal-cyan hover:bg-terminal-cyan/80">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Members
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-terminal-black border-terminal-border">
              <DialogHeader>
                <DialogTitle className="text-terminal-cyan">Invite Team Members</DialogTitle>
                <DialogDescription className="text-terminal-muted">
                  Send invitations to add new members to your organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="emails">Email Addresses</Label>
                  <Input 
                    id="emails"
                    placeholder="Enter emails separated by commas"
                    className="bg-terminal-bg border-terminal-border"
                  />
                  <p className="text-xs text-terminal-muted mt-1">
                    You can invite multiple people at once
                  </p>
                </div>
                <div>
                  <Label htmlFor="role">Default Role</Label>
                  <Select defaultValue="viewer">
                    <SelectTrigger className="bg-terminal-bg border-terminal-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="operations">
                    <SelectTrigger className="bg-terminal-bg border-terminal-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="intelligence">Intelligence</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-terminal-cyan hover:bg-terminal-cyan/80">
                    Send Invitations
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-terminal-black border-terminal-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-terminal-cyan">24</p>
                <p className="text-sm text-terminal-muted">Total Members</p>
              </div>
              <Users className="w-8 h-8 text-terminal-cyan/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-terminal-black border-terminal-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-terminal-yellow">4</p>
                <p className="text-sm text-terminal-muted">Departments</p>
              </div>
              <Building className="w-8 h-8 text-terminal-yellow/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-terminal-black border-terminal-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-terminal-green">4</p>
                <p className="text-sm text-terminal-muted">Active Roles</p>
              </div>
              <Shield className="w-8 h-8 text-terminal-green/20" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-terminal-black border-terminal-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-terminal-blue">3</p>
                <p className="text-sm text-terminal-muted">Pending Invites</p>
              </div>
              <Mail className="w-8 h-8 text-terminal-blue/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <CardTitle className="text-terminal-cyan">Team Management</CardTitle>
          <CardDescription className="text-terminal-muted">
            Configure your organization's structure and access controls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4 bg-terminal-bg">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search members..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-terminal-bg border-terminal-border"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] bg-terminal-bg border-terminal-border">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border border-terminal-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-terminal-border hover:bg-transparent">
                        <TableHead className="text-terminal-cyan">Member</TableHead>
                        <TableHead className="text-terminal-cyan">Role</TableHead>
                        <TableHead className="text-terminal-cyan">Department</TableHead>
                        <TableHead className="text-terminal-cyan">Status</TableHead>
                        <TableHead className="text-terminal-cyan">Last Active</TableHead>
                        <TableHead className="text-terminal-cyan">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id} className="border-terminal-border hover:bg-terminal-bg/50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={member.avatar || ''} />
                                <AvatarFallback className="bg-terminal-cyan/20 text-terminal-cyan text-xs">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-terminal-text">{member.name}</p>
                                <p className="text-xs text-terminal-muted">{member.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(member.role)}</TableCell>
                          <TableCell className="text-terminal-text">{member.department}</TableCell>
                          <TableCell>{getStatusBadge(member.status)}</TableCell>
                          <TableCell className="text-terminal-muted text-sm">{member.lastActive}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="text-terminal-cyan hover:text-terminal-cyan/80">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-terminal-red hover:text-terminal-red/80">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="roles" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <Card key={role.name} className="bg-terminal-bg border-terminal-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className={role.color}>{role.name}</CardTitle>
                          <CardDescription className="text-terminal-muted mt-1">
                            {role.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {role.users} users
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-terminal-text mb-2">Permissions:</p>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((perm) => (
                              <Badge key={perm} variant="outline" className="text-xs">
                                {perm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="text-terminal-red hover:text-terminal-red/80">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="bg-terminal-bg border-terminal-border border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <div className="mx-auto w-12 h-12 rounded-full bg-terminal-cyan/10 flex items-center justify-center">
                        <Plus className="w-6 h-6 text-terminal-cyan" />
                      </div>
                      <div>
                        <p className="font-medium text-terminal-text">Create Custom Role</p>
                        <p className="text-sm text-terminal-muted">Define permissions for your needs</p>
                      </div>
                      <Button className="bg-terminal-cyan hover:bg-terminal-cyan/80">
                        Create Role
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="departments" className="mt-6">
              <div className="grid md:grid-cols-2 gap-4">
                {departments.map((dept) => (
                  <Card key={dept.name} className="bg-terminal-bg border-terminal-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-terminal-text">{dept.name}</CardTitle>
                        <Badge variant="outline">{dept.members} members</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-terminal-muted">Department Lead:</span>
                          <span className="text-sm font-medium text-terminal-cyan">{dept.lead}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Members
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="permissions" className="mt-6">
              <div className="space-y-6">
                {Object.entries(permissions).map(([category, perms]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-terminal-cyan capitalize mb-3">
                      {category} Permissions
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {perms.map((perm) => (
                        <div key={perm} className="flex items-center justify-between p-3 bg-terminal-bg rounded-lg border border-terminal-border">
                          <span className="text-sm text-terminal-text">{perm}</span>
                          <Switch />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="bg-terminal-black border-terminal-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-terminal-cyan">Recent Activity</CardTitle>
              <CardDescription className="text-terminal-muted">
                Organization changes and access logs
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-terminal-border">
              <Activity className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-terminal-bg rounded-lg">
              <div className="w-2 h-2 bg-terminal-green rounded-full" />
              <div className="flex-1">
                <p className="text-sm text-terminal-text">
                  <span className="font-medium">Sarah Chen</span> invited 2 new members
                </p>
                <p className="text-xs text-terminal-muted">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-terminal-bg rounded-lg">
              <div className="w-2 h-2 bg-terminal-yellow rounded-full" />
              <div className="flex-1">
                <p className="text-sm text-terminal-text">
                  <span className="font-medium">Michael Torres</span> updated role permissions
                </p>
                <p className="text-xs text-terminal-muted">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-terminal-bg rounded-lg">
              <div className="w-2 h-2 bg-terminal-blue rounded-full" />
              <div className="flex-1">
                <p className="text-sm text-terminal-text">
                  <span className="font-medium">System</span> automated security audit completed
                </p>
                <p className="text-xs text-terminal-muted">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
