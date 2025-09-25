"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

// Mock data
const mockBlueprints = [
  { id: 1, title: 'Counter-Disinformation', description: 'A playbook to counter viral disinformation.' },
  { id: 2, title: 'Narrative Inoculation', description: 'Proactively inoculate a population.' },
];

export function CampaignsClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [campaignName, setCampaignName] = useState('');
  const [yamlPreview, setYamlPreview] = useState('');
  const { toast } = useToast();

  const generateYaml = () => {
    if (!campaignName) {
        toast({ variant: 'destructive', title: 'Validation Error', description: 'Campaign name is required.' });
        return;
    }
    const yaml = `
campaign:
  name: ${campaignName}
  blueprint: Counter-Disinformation
  targets:
    - platform: X
      keywords: ['election', 'fraud']
    `;
    setYamlPreview(yaml.trim());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(yamlPreview);
    toast({ title: "YAML Copied!" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Campaign Blueprints</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>New Campaign</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Campaign Wizard</DialogTitle>
              <DialogDescription>Create a new campaign from a blueprint.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input id="campaign-name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
              </div>
              <Button onClick={generateYaml}>Generate YAML</Button>
            </div>
            {yamlPreview && (
              <div className="mt-4 space-y-2">
                <h4 className="font-bold">YAML Preview</h4>
                <pre className="mt-2 p-4 bg-muted rounded-md text-sm overflow-x-auto">{yamlPreview}</pre>
                <Button onClick={handleCopy} variant="outline">Copy</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockBlueprints.map(bp => (
          <Card key={bp.id}>
            <CardHeader>
              <CardTitle>{bp.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{bp.description}</CardDescription>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={() => setIsOpen(true)}>Use this Blueprint</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}