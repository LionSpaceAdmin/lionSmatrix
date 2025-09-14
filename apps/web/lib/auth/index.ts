<<<<<<< HEAD
export { useAuth, useRequireAuth, useRole } from './hooks';
export { authOptions } from './options';

// Exporting the most common and useful RBAC functions
export {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  canAccessRoute,
} from './rbac';

// Type exports for convenience
export type { Role, Permission } from './rbac';
=======
export { useAuth } from './hooks'
export { AuthProvider } from './provider'
export { checkPermission, hasRole } from './rbac'
export { handlers } from './handlers'
>>>>>>> origin/chore/local-sync-2025-09-14
