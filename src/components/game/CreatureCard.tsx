import Image from 'next/image';
import type { Creature } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Swords, Shield, Wind } from 'lucide-react';

interface CreatureCardProps {
  creature: Creature;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (creature: Creature) => void;
  className?: string;
}

const typeColors: { [key: string]: string } = {
  Terra: 'bg-yellow-800 text-white',
  Aqua: 'bg-blue-600 text-white',
  Aero: 'bg-sky-400 text-gray-800',
  Ignis: 'bg-red-600 text-white',
  Lux: 'bg-yellow-300 text-gray-800',
  Umbra: 'bg-indigo-900 text-white',
};

export default function CreatureCard({ creature, isSelectable, isSelected, onSelect, className }: CreatureCardProps) {
  const healthPercentage = (creature.hp / creature.maxHp) * 100;

  return (
    <Card 
        className={`overflow-hidden transition-all duration-300 ${isSelectable ? 'cursor-pointer hover:shadow-lg hover:border-primary' : ''} ${isSelected ? 'border-primary ring-2 ring-primary' : ''} ${className}`}
        onClick={() => onSelect?.(creature)}
    >
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl font-headline">{creature.name}</CardTitle>
                <CardDescription>
                    <Badge className={`${typeColors[creature.type]} mt-1`}>{creature.type}</Badge>
                </CardDescription>
            </div>
             <div className="text-right">
                <div className="flex items-center gap-1 justify-end font-bold text-lg">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>{creature.hp} / {creature.maxHp}</span>
                </div>
            </div>
        </div>
        <div className="pt-2">
            <Progress value={healthPercentage} aria-label={`${creature.name} health`} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="relative aspect-[3/2] w-full rounded-md overflow-hidden mb-4 bg-muted">
            <Image
                src={creature.imageUrl}
                alt={`Image of ${creature.name}`}
                layout="fill"
                objectFit="cover"
                data-ai-hint={creature.aiHint}
            />
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="flex flex-col items-center justify-center p-2 rounded-md bg-card">
            <Swords className="h-5 w-5 mb-1 text-primary" />
            <span className="font-bold">{creature.attack}</span>
            <span className="text-xs text-muted-foreground">Attack</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-md bg-card">
            <Shield className="h-5 w-5 mb-1 text-primary" />
            <span className="font-bold">{creature.defense}</span>
             <span className="text-xs text-muted-foreground">Defense</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-md bg-card">
            <Wind className="h-5 w-5 mb-1 text-primary" />
            <span className="font-bold">{creature.speed}</span>
             <span className="text-xs text-muted-foreground">Speed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
