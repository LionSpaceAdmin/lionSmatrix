import { NextRequest, NextResponse } from 'next/server';
import { rbacService, type Permission } from '@/services/core-engine/rbac/service';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions?: string[];
}

export function withRBAC(requiredPermissions: Permission | Permission[]) {
  return async function middleware(
    request: NextRequest,
    params?: any
  ) {
    try {
      // Get user from session/token
      const user = await getUserFromRequest(request);
      
      if (!user) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      // Convert to RBAC user format
      const rbacUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles as any,
        permissions: user.permissions as any,
      };

      // Check permissions
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

      const hasAccess = rbacService.hasAllPermissions(rbacUser, permissions);

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Forbidden - Insufficient permissions' },
          { status: 403 }
        );
      }

      // Add user to request for downstream use
      (request as any).user = rbacUser;
      
      return NextResponse.next();
    } catch (error) {
      console.error('RBAC middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  // Check for JWT token in Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyJWT(token);
  }

  // Check for session cookie
  const sessionCookie = request.cookies.get('session');
  if (sessionCookie) {
    return getSessionUser(sessionCookie.value);
  }

  // Check for API key
  const apiKey = request.headers.get('x-api-key');
  if (apiKey) {
    return getUserByApiKey(apiKey);
  }

  return null;
}

async function verifyJWT(token: string): Promise<AuthUser | null> {
  // TODO: Implement JWT verification
  // This would verify the JWT and extract user data
  try {
    // Mock implementation
    return {
      id: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
      roles: ['analyst'],
    };
  } catch {
    return null;
  }
}

async function getSessionUser(sessionId: string): Promise<AuthUser | null> {
  // TODO: Fetch user from session store (Redis, database, etc.)
  // Mock implementation
  return {
    id: 'user-456',
    email: 'session@example.com',
    name: 'Session User',
    roles: ['operator'],
  };
}

async function getUserByApiKey(apiKey: string): Promise<AuthUser | null> {
  // TODO: Fetch user associated with API key from database
  // Mock implementation
  if (apiKey === 'test-api-key') {
    return {
      id: 'api-user-789',
      email: 'api@example.com',
      name: 'API User',
      roles: ['viewer'],
    };
  }
  return null;
}