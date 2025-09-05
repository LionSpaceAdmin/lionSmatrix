import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LionSpace - Intelligence Platform",
  description: "Intelligence Platform for Truth Verification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-mono bg-black text-green-400 antialiased">
        {children}
      </body>
    </html>
  );
}
