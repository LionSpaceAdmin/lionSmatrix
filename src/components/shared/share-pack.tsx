"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function SharePack() {
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "The page URL has been copied to your clipboard.",
    });
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="font-bold">Share Pack</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Share this narrative analysis with your network.
      </p>
      <Button onClick={handleShare} className="mt-4">
        Copy Link
      </Button>
    </div>
  );
}
