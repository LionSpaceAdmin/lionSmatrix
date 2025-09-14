export type Permission = string

export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

export interface User {
  id: string
  email: string
  name: string
  roles: string[]
  permissions?: Permission[]
}

export class RBACService {
  private roles: Map<string, Role> = new Map()
  private permissions: Set<Permission> = new Set()

  constructor() {
    this.initializeDefaultRoles()
  }

  private initializeDefaultRoles() {
    // Default roles
    this.addRole('admin', ['*'])
    this.addRole('user', ['read:profile', 'update:profile'])
    this.addRole('moderator', ['read:*', 'update:content', 'delete:content'])
  }

  addRole(roleId: string, permissions: Permission[]) {
    this.roles.set(roleId, {
      id: roleId,
      name: roleId,
      permissions
    })
    permissions.forEach(permission => this.permissions.add(permission))
  }

  hasPermission(user: User, permission: Permission): boolean {
    if (!user.permissions) {
      user.permissions = this.getUserPermissions(user)
    }

    return user.permissions.includes('*') || user.permissions.includes(permission)
  }

  hasRole(user: User, roleId: string): boolean {
    return user.roles.includes(roleId)
  }

  getUserPermissions(user: User): Permission[] {
    const permissions = new Set<Permission>()
    
    user.roles.forEach(roleId => {
      const role = this.roles.get(roleId)
      if (role) {
        role.permissions.forEach(permission => permissions.add(permission))
      }
    })

    return Array.from(permissions)
  }

  canAccess(user: User, resource: string, action: string): boolean {
    const permission = `${action}:${resource}`
    return this.hasPermission(user, permission)
  }

  hasAllPermissions(user: User, permissions: Permission[]): boolean {
    if (!user.permissions) {
      user.permissions = this.getUserPermissions(user)
    }

    return permissions.every(permission => 
      user.permissions!.includes('*') || user.permissions!.includes(permission)
    )
  }
}

export const rbacService = new RBACService()
