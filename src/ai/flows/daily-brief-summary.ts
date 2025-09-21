'use server';

/**
 * @fileOverview An AI agent for generating a daily brief summarizing top narratives and actions.
 *
 * - generateDailyBrief - A function that generates the daily brief.
 * - GenerateDailyBriefInput - The input type for the generateDailyBrief function.
 * - GenerateDailyBriefOutput - The return type for the generateDailyBrief function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateDailyBriefInputSchema = z.object({
  narratives: z.array(z.string()).describe('A list of top narratives.'),
  actions: z.array(z.string()).describe('A list of suggested actions.'),
});
export type GenerateDailyBriefInput = z.infer<typeof GenerateDailyBriefInputSchema>;

const GenerateDailyBriefOutputSchema = z.object({
  summary: z.string().describe('A summary of the top narratives and suggested actions.'),
});
export type GenerateDailyBriefOutput = z.infer<typeof GenerateDailyBriefOutputSchema>;

export async function generateDailyBrief(input: GenerateDailyBriefInput): Promise<GenerateDailyBriefOutput> {
  return generateDailyBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyBriefPrompt',
  input: {schema: GenerateDailyBriefInputSchema},
  output: {schema: GenerateDailyBriefOutputSchema},
  prompt: `You are an AI assistant tasked with creating a concise daily brief.

  Summarize the following top narratives and suggested actions into a brief update.

  Top Narratives:
  {{#each narratives}}- {{this}}\n{{/each}}

  Suggested Actions:
  {{#each actions}}- {{this}}\n{{/each}}
  `,
});

const generateDailyBriefFlow = ai.defineFlow(
  {
    name: 'generateDailyBriefFlow',
    inputSchema: GenerateDailyBriefInputSchema,
    outputSchema: GenerateDailyBriefOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
