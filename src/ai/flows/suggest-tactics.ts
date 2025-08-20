'use server';

/**
 * @fileOverview An AI agent that suggests strategic creature pairings for battles.
 *
 * - suggestTactics - A function that generates creature pairing suggestions.
 * - SuggestTacticsInput - The input type for the suggestTactics function.
 * - SuggestTacticsOutput - The return type for the suggestTactics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTacticsInputSchema = z.object({
  creature1: z.string().describe('The name of the first creature.'),
  creature2: z.string().describe('The name of the second creature.'),
  opponentCreature1: z.string().describe('The name of the opponent\'s first creature.'),
  opponentCreature2: z.string().describe('The name of the opponent\'s second creature.'),
  playerCreatures: z.array(z.string()).describe('List of the player\'s creatures.'),
  opponentCreatures: z.array(z.string()).describe('List of the opponent\'s creatures.'),
});
export type SuggestTacticsInput = z.infer<typeof SuggestTacticsInputSchema>;

const SuggestTacticsOutputSchema = z.object({
  suggestion: z.string().describe('A strategic suggestion for the creature pairing.'),
});
export type SuggestTacticsOutput = z.infer<typeof SuggestTacticsOutputSchema>;

export async function suggestTactics(input: SuggestTacticsInput): Promise<SuggestTacticsOutput> {
  return suggestTacticsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTacticsPrompt',
  input: {schema: SuggestTacticsInputSchema},
  output: {schema: SuggestTacticsOutputSchema},
  prompt: `You are a tactical assistant for a creature battle game.

You are provided with information about the player's creatures and the opponent's creatures.
Specifically, the player has chosen to pit {{creature1}} and {{creature2}} against the opponent's {{opponentCreature1}} and {{opponentCreature2}}.

Player's Creatures: {{playerCreatures}}
Opponent's Creatures: {{opponentCreatures}}

Provide a strategic suggestion for this creature pairing to optimize the player's chances of winning.

Suggestion:`,
});

const suggestTacticsFlow = ai.defineFlow(
  {
    name: 'suggestTacticsFlow',
    inputSchema: SuggestTacticsInputSchema,
    outputSchema: SuggestTacticsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
