"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

type Evidence = { id: number; source: string; text: string; };

export function FactCheckClient() {
  const [claim, setClaim] = useState('');
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [verdict, setVerdict] = useState('Unverified');
  const [nextId, setNextId] = useState(1);

  const addEvidence = () => {
    setEvidence([...evidence, { id: nextId, source: '', text: '' }]);
    setNextId(nextId + 1);
  };

  const removeEvidence = (id: number) => {
    setEvidence(evidence.filter(e => e.id !== id));
  };

  const updateEvidence = (id: number, field: 'source' | 'text', value: string) => {
    setEvidence(evidence.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle>1. The Claim</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter the claim you want to fact-check..."
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>2. The Evidence</CardTitle>
          <CardDescription>Add sources and quotes to support your analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {evidence.map((item) => (
            <div key={item.id} className="space-y-2 rounded-lg border p-4 relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEvidence(item.id)}>
                <X className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Source URL"
                value={item.source}
                onChange={(e) => updateEvidence(item.id, 'source', e.target.value)}
              />
              <Textarea
                placeholder="Evidence text or quote"
                value={item.text}
                onChange={(e) => updateEvidence(item.id, 'text', e.target.value)}
              />
            </div>
          ))}
          <Button onClick={addEvidence} variant="outline">Add Evidence</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>3. The Verdict</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Select value={verdict} onValueChange={setVerdict}>
            <SelectTrigger><SelectValue placeholder="Select a verdict" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Verified True">Verified True</SelectItem>
              <SelectItem value="Mostly True">Mostly True</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
              <SelectItem value="Mostly False">Mostly False</SelectItem>
              <SelectItem value="Verified False">Verified False</SelectItem>
              <SelectItem value="Unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <div className="prose prose-invert mt-4 rounded-lg border p-4 print:prose-black">
            <h3>{claim || "The Claim"}</h3>
            <p><strong>Verdict: {verdict}</strong></p>
            <h4>Evidence:</h4>
            <ul>
              {evidence.map(e => e.text && <li key={e.id}>{e.text} (<a href={e.source} target="_blank" rel="noopener noreferrer">{e.source}</a>)</li>)}
            </ul>
          </div>
          <Button onClick={() => window.print()}>Print Report</Button>
        </CardContent>
      </Card>
    </div>
  );
}
