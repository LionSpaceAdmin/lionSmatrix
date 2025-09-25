"use client";

import { PledgeBox } from '@/components/ui/pledge-box';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const setCookie = (name: string, value: string, days: number) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

export default function OpeningPage() {
  const router = useRouter();

  const handleAgree = () => {
    setCookie('splash-seen', 'true', 365);
    router.push('/');
  };

  return (
    <div className="container mx-auto flex h-screen items-center justify-center">
      <PledgeBox className="max-w-md">
        <h2 className="text-2xl font-bold">Our Pledge</h2>
        <p className="mt-4 text-muted-foreground">
          We pledge to be transparent and accountable in our mission to fight disinformation.
          By continuing, you agree to our terms of service.
        </p>
        <Button onClick={handleAgree} className="mt-6 w-full">
          Agree & Continue
        </Button>
      </PledgeBox>
    </div>
  );
}
