import { type DefaultSession, type User } from 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the default session to include custom properties.
   */
  interface Session {
    user?: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  /**
   * Extends the default user to include the role.
   */
  interface User {
    role?: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string;
    id?: string;
  }
}
