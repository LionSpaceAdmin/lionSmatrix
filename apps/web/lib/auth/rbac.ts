// Role-Based Access Control (RBAC) System

export type Role = 'admin' | 'moderator' | 'analyst' | 'user' | 'guest'

export type Permission = 
  | 'view:dashboard'
  | 'view:intelligence'
  | 'view:war-room'
  | 'view:analytics'
  | 'view:admin'
  | 'edit:content'
  | 'edit:users'
  | 'delete:content'
  | 'delete:users'
  | 'manage:system'
  | 'manage:security'
  | 'manage:campaigns'
  | 'export:data'
  | 'create:reports'
  | 'view:sensitive'

// Define permissions for each role
export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'view:dashboard',
    'view:intelligence',
    'view:war-room',
    'view:analytics',
    'view:admin',
    'view:sensitive',
    'edit:content',
    'edit:users',
    'delete:content',
    'delete:users',
    'manage:system',
    'manage:security',
    'manage:campaigns',
    'export:data',
    'create:reports'
  ],
  moderator: [
    'view:dashboard',
    'view:intelligence',
    'view:war-room',
    'view:analytics',
    'view:sensitive',
    'edit:content',
    'delete:content',
    'manage:campaigns',
    'export:data',
    'create:reports'
  ],
  analyst: [
    'view:dashboard',
    'view:intelligence',
    'view:war-room',
    'view:analytics',
    'view:sensitive',
    'edit:content',
    'manage:campaigns',
    'export:data',
    'create:reports'
  ],
  user: [
    'view:dashboard',
    'view:intelligence',
    'view:analytics',
    'export:data',
    'create:reports'
  ],
  guest: [
    'view:dashboard'
  ]
}

// Check if a role has a specific permission
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false
}

// Check if a role has all required permissions
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

// Check if a role has any of the required permissions
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

// Get all permissions for a role
export function getRolePermissions(role: Role): Permission[] {
  return rolePermissions[role] || []
}

// Check if a role can access a specific route
export function canAccessRoute(role: Role, route: string): boolean {
  const routePermissions: Record<string, Permission[]> = {
    '/dashboard': ['view:dashboard'],
    '/intelligence': ['view:intelligence'],
    '/war-room': ['view:war-room'],
    '/analytics': ['view:analytics'],
    '/admin': ['view:admin'],
    '/settings': ['view:dashboard'],
    '/profile': ['view:dashboard'],
    '/reports': ['create:reports'],
    '/exports': ['export:data'],
    '/campaigns': ['manage:campaigns'],
    '/users': ['edit:users'],
    '/system': ['manage:system'],
    '/security': ['manage:security']
  }

  const requiredPermissions = routePermissions[route]
  if (!requiredPermissions) return true // No permission required for this route
  
  return hasAnyPermission(role, requiredPermissions)
}

// Role hierarchy - higher roles inherit permissions from lower roles
export const roleHierarchy: Record<Role, number> = {
  admin: 5,
  moderator: 4,
  analyst: 3,
  user: 2,
  guest: 1
}

// Check if one role is higher than another
export function isRoleHigher(role1: Role, role2: Role): boolean {
  return roleHierarchy[role1] > roleHierarchy[role2]
}

// Check if roles are equal
export function isRoleEqual(role1: Role, role2: Role): boolean {
  return roleHierarchy[role1] === roleHierarchy[role2]
}

// Get role display name
export function getRoleDisplayName(role: Role): string {
  const displayNames: Record<Role, string> = {
    admin: 'Administrator',
    moderator: 'Moderator',
    analyst: 'Intelligence Analyst',
    user: 'User',
    guest: 'Guest'
  }
  return displayNames[role] || 'Unknown'
}

// Get role badge color
export function getRoleBadgeColor(role: Role): string {
  const colors: Record<Role, string> = {
    admin: 'bg-red-100 text-red-800',
    moderator: 'bg-orange-100 text-orange-800',
    analyst: 'bg-blue-100 text-blue-800',
    user: 'bg-green-100 text-green-800',
    guest: 'bg-gray-100 text-gray-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}