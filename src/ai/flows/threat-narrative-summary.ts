// Threat-narrative-summary.ts
'use server';
/**
 * @fileOverview A Genkit flow that summarizes threat narratives using AI.
 *
 * - summarizeThreatNarrative - A function that handles the summarization process.
 * - SummarizeThreatNarrativeInput - The input type for the summarizeThreatNarrative function.
 * - SummarizeThreatNarrativeOutput - The return type for the summarizeThreatNarrative function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeThreatNarrativeInputSchema = z.object({
  narrative: z.string().describe('The threat narrative to summarize.'),
});
export type SummarizeThreatNarrativeInput = z.infer<
  typeof SummarizeThreatNarrativeInputSchema
>;

const SummarizeThreatNarrativeOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the key facts and prioritized information in the threat narrative.'
    ),
});
export type SummarizeThreatNarrativeOutput = z.infer<
  typeof SummarizeThreatNarrativeOutputSchema
>;

export async function summarizeThreatNarrative(
  input: SummarizeThreatNarrativeInput
): Promise<SummarizeThreatNarrativeOutput> {
  return summarizeThreatNarrativeFlow(input);
}

const summarizeThreatNarrativePrompt = ai.definePrompt({
  name: 'summarizeThreatNarrativePrompt',
  input: {schema: SummarizeThreatNarrativeInputSchema},
  output: {schema: SummarizeThreatNarrativeOutputSchema},
  prompt: `Summarize the following threat narrative, focusing on the key facts and prioritizing the most important information:

{{{narrative}}}`,
});

const summarizeThreatNarrativeFlow = ai.defineFlow(
  {
    name: 'summarizeThreatNarrativeFlow',
    inputSchema: SummarizeThreatNarrativeInputSchema,
    outputSchema: SummarizeThreatNarrativeOutputSchema,
  },
  async input => {
    const {output} = await summarizeThreatNarrativePrompt(input);
    return output!;
  }
);
