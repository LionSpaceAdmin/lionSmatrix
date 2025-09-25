"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const mockQueries = [
  { id: 1, name: 'Q1 Narrative Analysis' },
  { id: 2, name: 'BotNet Alpha Activity' },
  { id: 3, name: 'Election Integrity Keywords' },
];

export function DeepResearchClient() {
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  // Load notes from localStorage on initial render
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('deep-research-notes');
      if (savedNotes) {
        setNotes(savedNotes);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('deep-research-notes', notes);
    } catch (error) {
      console.error("Could not access localStorage:", error);
    }
  }, [notes]);

  const handleExport = () => {
    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deep-research-notes.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Exported!", description: "Your notes have been downloaded as a Markdown file." });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h3 className="text-xl font-bold mb-4">Saved Queries</h3>
        <div className="space-y-2">
          {mockQueries.map(q => (
            <Button key={q.id} variant="ghost" className="w-full justify-start">{q.name}</Button>
          ))}
        </div>
      </div>
      <div className="md:col-span-2">
        <h3 className="text-xl font-bold mb-4">Notes Editor</h3>
        <Textarea
          placeholder="Start your research notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-96"
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={handleExport}>Export as Markdown</Button>
        </div>
      </div>
    </div>
  );
}
