import { Metadata } from "next"
import { LandingHero } from "@/components/LandingHero"

export const metadata: Metadata = {
  title: "LionSpace Intelligence Platform",
  description: "Advanced Intelligence Platform for Truth Detection and Analysis",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <LandingHero />
    </div>
  );
}
