"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import Link from 'next/link';

// Mock data for playbooks
const mockPlaybooks = [
  { id: 1, title: 'Counter-Disinformation', tags: ['social', 'defense'], description: 'A playbook to counter viral disinformation on social media.' },
  { id: 2, title: 'Narrative Inoculation', tags: ['pre-bunking', 'education'], description: 'Proactively inoculate a population against a specific narrative.' },
  { id: 3, title: 'Source Verification', tags: ['osint', 'research'], description: 'A step-by-step guide to verifying the authenticity of a source.' },
  { id: 4, title: 'Deepfake Analysis', tags: ['media', 'forensics'], description: 'Techniques for identifying and analyzing deepfake videos.' },
];

export function PlaybooksClient() {
  const [filter, setFilter] = useState('all');

  const filteredPlaybooks = mockPlaybooks.filter(p => filter === 'all' || p.tags.includes(filter));

  return (
    <div>
      <div className="mb-8 flex justify-center gap-2">
        <Button variant={filter === 'all' ? 'default' : 'secondary'} onClick={() => setFilter('all')}>All</Button>
        <Button variant={filter === 'social' ? 'default' : 'secondary'} onClick={() => setFilter('social')}>Social</Button>
        <Button variant={filter === 'osint' ? 'default' : 'secondary'} onClick={() => setFilter('osint')}>OSINT</Button>
        <Button variant={filter === 'media' ? 'default' : 'secondary'} onClick={() => setFilter('media')}>Media</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlaybooks.map((playbook) => (
          <Card key={playbook.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{playbook.title}</CardTitle>
              <div className="flex gap-2 pt-2">
                {playbook.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{playbook.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full">Preview</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{playbook.title}</DialogTitle>
                    <DialogDescription>{playbook.description}</DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p>This is a placeholder for the playbook preview content.</p>
                  </div>
                  <DialogFooter>
                    <Link href="/dashboard/campaigns">
                      <Button>Use this Playbook</Button>
                    </Link>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
