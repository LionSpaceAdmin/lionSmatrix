"use client";

import { useState } from 'react';
import AiTerminal from '@/components/shared/ai-terminal';
import DossierModal from '@/components/shared/dossier-modal';
import HeroSection from '@/components/shared/hero-section';
import { osintData, OsintActor } from '@/lib/data';

export default function LandingPage() {
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<OsintActor | null>(null);

  const handleOpenDossier = (actorName: string) => {
    const actor = osintData.find(a => a.Name === actorName);
    setSelectedActor(actor || null);
    setIsDossierOpen(true);
  };

  const handleCloseDossier = () => {
    setIsDossierOpen(false);
  };

  return (
    <>
      <HeroSection />
      <AiTerminal onOpenDossier={handleOpenDossier} />
      <DossierModal
        isOpen={isDossierOpen}
        onClose={handleCloseDossier}
        actor={selectedActor}
      />
    </>
  );
}
