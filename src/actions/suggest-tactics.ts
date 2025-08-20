'use server';

import { suggestTactics, type SuggestTacticsInput } from '@/ai/flows/suggest-tactics';

// The input type for this action will be a subset of the AI flow's input
// as we allow for optional creature selections from the UI.
type ActionInput = {
    creature1: string;
    creature2?: string;
    opponentCreature1: string;
    opponentCreature2?: string;
    playerCreatures: string[];
    opponentCreatures: string[];
}

export async function suggestTacticsAction(input: ActionInput) {
    try {
        // Construct the full input for the AI flow, providing empty strings for optional fields
        const flowInput: SuggestTacticsInput = {
            creature1: input.creature1,
            creature2: input.creature2 || '',
            opponentCreature1: input.opponentCreature1,
            opponentCreature2: input.opponentCreature2 || '',
            playerCreatures: input.playerCreatures,
            opponentCreatures: input.opponentCreatures,
        };

        const result = await suggestTactics(flowInput);
        return { suggestion: result.suggestion };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || "An unexpected error occurred." };
    }
}
