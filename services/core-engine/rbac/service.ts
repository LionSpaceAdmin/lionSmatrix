export type Permission = 
  | 'view:dashboard'
  | 'view:intelligence'
  | 'view:war-room'
  | 'create:war-room-session'
  | 'manage:war-room-session'
  | 'view:threats'
  | 'manage:threats'
  | 'view:analytics'
  | 'manage:analytics'
  | 'view:settings'
  | 'manage:settings'
  | 'manage:users'
  | 'manage:roles'
  | 'admin:all';

export type Role = 
  | 'admin'
  | 'analyst'
  | 'operator'
  | 'viewer'
  | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  permissions?: Permission[];
  metadata?: Record<string, any>;
}

export interface RoleDefinition {
  name: Role;
  description: string;
  permissions: Permission[];
  inherits?: Role[];
}

export class RBACService {
  private roleDefinitions: Map<Role, RoleDefinition> = new Map([
    ['admin', {
      name: 'admin',
      description: 'Full system administrator',
      permissions: ['admin:all'],
    }],
    ['analyst', {
      name: 'analyst',
      description: 'Security analyst with full operational access',
      permissions: [
        'view:dashboard',
        'view:intelligence',
        'view:war-room',
        'create:war-room-session',
        'manage:war-room-session',
        'view:threats',
        'manage:threats',
        'view:analytics',
        'manage:analytics',
        'view:settings',
      ],
    }],
    ['operator', {
      name: 'operator',
      description: 'Operations team member',
      permissions: [
        'view:dashboard',
        'view:intelligence',
        'view:war-room',
        'view:threats',
        'view:analytics',
      ],
    }],
    ['viewer', {
      name: 'viewer',
      description: 'Read-only access',
      permissions: [
        'view:dashboard',
        'view:intelligence',
        'view:threats',
        'view:analytics',
      ],
    }],
    ['guest', {
      name: 'guest',
      description: 'Limited guest access',
      permissions: [
        'view:dashboard',
      ],
    }],
  ]);

  /**
   * Check if a user has a specific permission
   */
  hasPermission(user: User, permission: Permission): boolean {
    // Check if user has admin:all permission
    if (this.getUserPermissions(user).includes('admin:all')) {
      return true;
    }

    // Check specific permission
    return this.getUserPermissions(user).includes(permission);
  }

  /**
   * Check if a user has any of the specified permissions
   */
  hasAnyPermission(user: User, permissions: Permission[]): boolean {
    const userPermissions = this.getUserPermissions(user);
    
    // Admin bypass
    if (userPermissions.includes('admin:all')) {
      return true;
    }

    return permissions.some(permission => userPermissions.includes(permission));
  }

  /**
   * Check if a user has all of the specified permissions
   */
  hasAllPermissions(user: User, permissions: Permission[]): boolean {
    const userPermissions = this.getUserPermissions(user);
    
    // Admin bypass
    if (userPermissions.includes('admin:all')) {
      return true;
    }

    return permissions.every(permission => userPermissions.includes(permission));
  }

  /**
   * Get all permissions for a user (from roles and direct permissions)
   */
  getUserPermissions(user: User): Permission[] {
    const permissions = new Set<Permission>();

    // Add permissions from roles
    user.roles.forEach(role => {
      const roleDefinition = this.roleDefinitions.get(role);
      if (roleDefinition) {
        roleDefinition.permissions.forEach(permission => {
          permissions.add(permission);
        });

        // Handle role inheritance
        if (roleDefinition.inherits) {
          roleDefinition.inherits.forEach(inheritedRole => {
            const inheritedDefinition = this.roleDefinitions.get(inheritedRole);
            if (inheritedDefinition) {
              inheritedDefinition.permissions.forEach(permission => {
                permissions.add(permission);
              });
            }
          });
        }
      }
    });

    // Add direct user permissions
    if (user.permissions) {
      user.permissions.forEach(permission => {
        permissions.add(permission);
      });
    }

    return Array.from(permissions);
  }

  /**
   * Check if a user has a specific role
   */
  hasRole(user: User, role: Role): boolean {
    return user.roles.includes(role);
  }

  /**
   * Check if a user has any of the specified roles
   */
  hasAnyRole(user: User, roles: Role[]): boolean {
    return roles.some(role => user.roles.includes(role));
  }

  /**
   * Add a role to a user
   */
  addRole(user: User, role: Role): User {
    if (!user.roles.includes(role)) {
      user.roles.push(role);
    }
    return user;
  }

  /**
   * Remove a role from a user
   */
  removeRole(user: User, role: Role): User {
    user.roles = user.roles.filter(r => r !== role);
    return user;
  }

  /**
   * Grant a direct permission to a user
   */
  grantPermission(user: User, permission: Permission): User {
    if (!user.permissions) {
      user.permissions = [];
    }
    if (!user.permissions.includes(permission)) {
      user.permissions.push(permission);
    }
    return user;
  }

  /**
   * Revoke a direct permission from a user
   */
  revokePermission(user: User, permission: Permission): User {
    if (user.permissions) {
      user.permissions = user.permissions.filter(p => p !== permission);
    }
    return user;
  }

  /**
   * Get role definition
   */
  getRoleDefinition(role: Role): RoleDefinition | undefined {
    return this.roleDefinitions.get(role);
  }

  /**
   * Create or update a role definition
   */
  defineRole(definition: RoleDefinition): void {
    this.roleDefinitions.set(definition.name, definition);
  }

  /**
   * Validate user access to a resource
   */
  validateAccess(
    user: User,
    resource: string,
    action: string
  ): { allowed: boolean; reason?: string } {
    const permission = `${action}:${resource}` as Permission;
    
    if (this.hasPermission(user, permission)) {
      return { allowed: true };
    }

    return {
      allowed: false,
      reason: `User lacks permission: ${permission}`,
    };
  }

  /**
   * Get accessible resources for a user
   */
  getAccessibleResources(user: User): string[] {
    const permissions = this.getUserPermissions(user);
    const resources = new Set<string>();

    permissions.forEach(permission => {
      if (permission === 'admin:all') {
        // Admin has access to everything
        return ['dashboard', 'intelligence', 'war-room', 'threats', 'analytics', 'settings', 'users', 'roles'];
      }
      
      const [, resource] = permission.split(':');
      if (resource) {
        resources.add(resource);
      }
    });

    return Array.from(resources);
  }
}

// Export singleton instance
export const rbacService = new RBACService();