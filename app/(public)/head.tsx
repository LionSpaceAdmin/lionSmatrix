import React from 'react';
import NextHead from 'next/head';

// This is a placeholder for a more robust Head component.
// In a real App Router setup, this logic would likely be in layouts using the Metadata API.
// However, creating this file as requested by the TODO.md.

export default function Head() {
  return (
    <NextHead>
      <meta name="description" content="Lions of Zion - Military-grade defense against disinformation campaigns." />
      <meta property="og:title" content="Lions of Zion" />
      <meta property="og:description" content="Truth is pattern. AI sees it. Join the battle for truth." />
      <meta property="og:image" content="/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </NextHead>
  );
}
