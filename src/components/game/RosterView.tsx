'use client';

import type { Creature } from '@/types';
import CreatureCard from './CreatureCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RosterViewProps {
  creatures: Creature[];
}

export default function RosterView({ creatures }: RosterViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Creature Roster</CardTitle>
      </CardHeader>
      <CardContent>
        {creatures.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {creatures.map((creature) => (
              <CreatureCard key={creature.id} creature={creature} />
            ))}
          </div>
        ) : (
          <p>You have not captured any creatures yet. Explore the map to find some!</p>
        )}
      </CardContent>
    </Card>
  );
}
