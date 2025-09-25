"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Mock data for FAQs
const faqData = [
  { id: 'what-is-lions-of-zion', q: 'What is Lions of Zion?', a: 'We are a global network dedicated to fighting disinformation.' },
  { id: 'how-are-you-funded', q: 'How are you funded?', a: 'We are funded by non-profit foundations and individual donors.' },
  { id: 'can-i-join', q: 'Can I join?', a: 'Yes, you can join the fight by signing up on our website.' },
  { id: 'what-is-disinformation', q: 'What is disinformation?', a: 'Disinformation is false information spread deliberately to deceive.' },
];

export function FaqClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItem, setOpenItem] = useState('');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setOpenItem(hash);
      const element = document.getElementById(hash);
      if (element) {
        // The focus and scroll can sometimes be tricky.
        // A timeout ensures the element is rendered and ready.
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (element.querySelector('[data-radix-accordion-trigger]') as HTMLElement)?.focus();
        }, 100);
      }
    }
  }, []);

  const filteredFaqs = useMemo(() => {
    return faqData.filter(faq =>
      faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div>
      <Input
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm mb-8"
      />
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={openItem}
        onValueChange={setOpenItem}
      >
        {filteredFaqs.map(faq => (
          <AccordionItem key={faq.id} value={faq.id} id={faq.id}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
