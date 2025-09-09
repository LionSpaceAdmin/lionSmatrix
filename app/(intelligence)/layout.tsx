import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { IntelligenceLayoutClient } from './layout-client';

export default async function IntelligenceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth-token');
  
  if (!authToken) {
    redirect('/join');
  }

  // Could also verify token with database here
  // const isValid = await verifyAuthToken(authToken.value);
  // if (!isValid) redirect('/join');

  return (
    <IntelligenceLayoutClient>
      {children}
    </IntelligenceLayoutClient>
  );
}