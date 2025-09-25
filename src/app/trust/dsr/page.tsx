import { DsrForm } from './_components/dsr-form';
import type { Metadata } from 'next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Subject Request',
  description: 'Manage your personal data.',
};

export default function DsrPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-headline font-bold tracking-tighter sm:text-5xl">
          Data Subject Request
        </h1>
        <p className="mt-2 text-muted-foreground md:text-lg">
          Submit a request to export or delete your data.
        </p>
      </header>
      <div className="max-w-xl mx-auto">
        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertTitle>Identity Verification</AlertTitle>
          <AlertDescription>
            For security reasons, we will send a confirmation link to the email address you provide to verify your identity before processing your request.
          </AlertDescription>
        </Alert>
        <DsrForm />
      </div>
    </div>
  );
}