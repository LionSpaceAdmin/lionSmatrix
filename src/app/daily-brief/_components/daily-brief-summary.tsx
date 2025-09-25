"use client";

import { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { dailyBriefData } from '@/lib/data';
import { generateDailyBrief } from '@/ai/flows/daily-brief-summary';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function DailyBriefSummary() {
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleGenerate = () => {
        startTransition(async () => {
            setError('');
            setSummary('');
            try {
                const result = await generateDailyBrief(dailyBriefData);
                if (result && result.summary) {
                    setSummary(result.summary);
                } else {
                    setError('The AI returned an empty summary. Please try again.');
                }
            } catch (e) {
                console.error(e);
                setError('Failed to generate summary. An unexpected error occurred.');
            }
        });
    };

    useEffect(() => {
        handleGenerate();
    }, []);

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="text-primary w-6 h-6" />
                    AI-Generated Executive Summary
                </CardTitle>
                <CardDescription>
                    A concise, up-to-the-minute summary of top narratives and suggested actions.
                </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[10rem]">
                {isPending && (
                    <div className="flex items-center justify-center p-8 gap-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="font-semibold">Generating latest intelligence...</span>
                    </div>
                )}
                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {summary && (
                    <p className="text-foreground/90 leading-relaxed">{summary}</p>
                )}
            </CardContent>
             { (error || summary) && !isPending && (
                <CardFooter>
                     <Button onClick={handleGenerate} disabled={isPending} variant="secondary">
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Regenerate
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
