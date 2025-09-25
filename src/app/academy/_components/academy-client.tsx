"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Mock data for articles
const mockArticles = [
  { id: 1, slug: 'info-warfare', title: 'Understanding Information Warfare', excerpt: 'An introduction to the key concepts.', tags: ['basics', 'theory'] },
  { id: 2, slug: 'osint-basics', title: 'OSINT Basics', excerpt: 'Learn the fundamentals of Open Source Intelligence.', tags: ['osint', 'research'] },
  { id: 3, slug: 'deepfake-detection', title: 'Deepfake Detection 101', excerpt: 'How to spot and analyze deepfakes.', tags: ['media', 'forensics'] },
];

export function AcademyClient() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return mockArticles;
    return mockArticles.filter(a =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.tags.some(t => t.includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div>
      <div className="mb-8 max-w-sm">
        <Input
          placeholder="Search articles by title, content, or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map(article => (
          <Link key={article.id} href={`/academy/${article.slug}`} className="block h-full">
            <Card className="h-full hover:border-primary transition-colors flex flex-col">
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
                <CardDescription>{article.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto flex gap-2 pt-2">
                {article.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}