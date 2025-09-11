// Temporary auth implementation - mock until packages are installed
export const auth = () => {
  return Promise.resolve({
    user: null,
    expires: ""
  })
}

export const signIn = (provider?: string) => {
  console.log('Sign in with:', provider)
  return Promise.resolve()
}

export const signOut = () => {
  console.log('Sign out')
  return Promise.resolve()
}

// Mock NextAuth configuration
export const authConfig = {
  providers: [],
  callbacks: {
    session: ({ session }: any) => session,
    jwt: ({ token }: any) => token,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
}

export default {
  ...authConfig,
  handlers: {
    GET: async () => new Response('Auth endpoint'),
    POST: async () => new Response('Auth endpoint'),
  }
}