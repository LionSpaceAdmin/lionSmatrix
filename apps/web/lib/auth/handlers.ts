<<<<<<< HEAD
import NextAuth from 'next-auth';
import { authOptions } from './options';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
=======
import { NextAuthOptions } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const authOptions: NextAuthOptions = {
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
  },
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Auth GET handler not implemented' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Auth POST handler not implemented' })
}
>>>>>>> origin/chore/local-sync-2025-09-14
