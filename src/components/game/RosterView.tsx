
'use client';

import React from 'react';
import type { Creature } from '@/types';
import CreatureCard from './CreatureCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RosterViewProps {
  allCreatures: Creature[];
  team: Creature[];
  onSetTeam: (team: Creature[]) => void;
}

export default function RosterView({ allCreatures, team, onSetTeam }: RosterViewProps) {
    const [selectedCreatures, setSelectedCreatures] = React.useState<Creature[]>(team);

    React.useEffect(() => {
        // Keep local selection in sync with global state if it changes
        setSelectedCreatures(team);
    }, [team]);

    const handleSelectCreature = (creature: Creature) => {
        setSelectedCreatures(prev => {
            if (prev.some(c => c.id === creature.id)) {
                return prev.filter(c => c.id !== creature.id);
            }
            if (prev.length < 3) {
                return [...prev, creature];
            }
            return prev; // Don't add more than 3
        });
    };
    
    const handleConfirmTeam = () => {
        if(selectedCreatures.length > 0) {
            onSetTeam(selectedCreatures);
        }
    }

    const isTeamSameAsOriginal = React.useMemo(() => {
        if (selectedCreatures.length !== team.length) return false;
        const selectedIds = selectedCreatures.map(c => c.id).sort();
        const teamIds = team.map(c => c.id).sort();
        return selectedIds.every((id, index) => id === teamIds[index]);
    }, [selectedCreatures, team]);


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="font-headline text-2xl mb-2 sm:mb-0">Your Creature Roster</CardTitle>
            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">Team ({selectedCreatures.length}/3)</p>
                <Button 
                    onClick={handleConfirmTeam} 
                    disabled={selectedCreatures.length === 0 || isTeamSameAsOriginal}
                >
                    Set Battle Team
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        {allCreatures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allCreatures.map((creature) => (
              <CreatureCard 
                key={creature.id} 
                creature={creature} 
                isSelectable
                isSelected={selectedCreatures.some(c => c.id === creature.id)}
                onSelect={() => handleSelectCreature(creature)}
              />
            ))}
          </div>
        ) : (
          <p>You have not captured any creatures yet. Explore the world to find some!</p>
        )}
      </CardContent>
    </Card>
  );
}
