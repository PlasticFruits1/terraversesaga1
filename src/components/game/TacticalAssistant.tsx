'use client';

import { useState, useTransition } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, AlertTriangle } from 'lucide-react';
import { suggestTacticsAction } from '@/actions/suggest-tactics';
import type { Creature } from '@/types';

interface TacticalAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  playerCreatures: Creature[];
  opponentCreatures: Creature[];
  playerTeam: Creature[];
  opponentTeam: Creature[];
}

export default function TacticalAssistant({ 
    isOpen, onClose, playerCreatures, opponentCreatures, playerTeam, opponentTeam 
}: TacticalAssistantProps) {
  
  const [creature1, setCreature1] = useState(playerTeam.find(c => c.hp > 0)?.name || '');
  const [creature2, setCreature2] = useState(playerTeam.filter(c => c.hp > 0)[1]?.name || '');
  const [opponent1, setOpponent1] = useState(opponentTeam.find(c => c.hp > 0)?.name || '');
  const [opponent2, setOpponent2] = useState(opponentTeam.filter(c => c.hp > 0)[1]?.name || '');

  const [isPending, startTransition] = useTransition();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    setSuggestion(null);

    const input = {
      creature1: creature1,
      creature2: creature2,
      opponentCreature1: opponent1,
      opponentCreature2: opponent2,
      playerCreatures: playerCreatures.map(c => c.name),
      opponentCreatures: opponentCreatures.map(c => c.name),
    };

    if(!input.creature1 || !input.opponentCreature1) {
        setError("Please select at least one creature for each team.");
        return;
    }

    startTransition(async () => {
      const result = await suggestTacticsAction(input);
      if (result.suggestion) {
        setSuggestion(result.suggestion);
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Tactical Assistant</DialogTitle>
          <DialogDescription>
            Get AI-powered strategic advice for your battle lineup.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <h4 className="font-semibold">Your Creatures</h4>
            <div className="grid grid-cols-2 gap-4">
                <Select value={creature1} onValueChange={setCreature1}>
                    <SelectTrigger><SelectValue placeholder="Select Creature 1" /></SelectTrigger>
                    <SelectContent>
                        {playerCreatures.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={creature2} onValueChange={setCreature2}>
                    <SelectTrigger><SelectValue placeholder="Select Creature 2" /></SelectTrigger>
                    <SelectContent>
                         {playerCreatures.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <h4 className="font-semibold">Opponent's Creatures</h4>
            <div className="grid grid-cols-2 gap-4">
                <Select value={opponent1} onValueChange={setOpponent1}>
                    <SelectTrigger><SelectValue placeholder="Select Opponent 1" /></SelectTrigger>
                    <SelectContent>
                        {opponentCreatures.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Select value={opponent2} onValueChange={setOpponent2}>
                    <SelectTrigger><SelectValue placeholder="Select Opponent 2" /></SelectTrigger>
                    <SelectContent>
                        {opponentCreatures.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {isPending && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
            </div>
        )}

        {error && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {suggestion && (
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>Strategic Suggestion</AlertTitle>
                <AlertDescription>{suggestion}</AlertDescription>
            </Alert>
        )}

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Analyzing...' : 'Get Suggestion'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
