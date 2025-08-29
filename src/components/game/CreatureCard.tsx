import Image from 'next/image';
import type { Creature, Ability } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Swords, Shield, Zap } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface CreatureCardProps {
  creature: Creature;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (creature: Creature) => void;
  className?: string;
  showCurrentDefense?: boolean;
  isActionable?: boolean;
  onAbilitySelect?: (ability: Ability) => void;
}

const typeColors: { [key: string]: string } = {
  Terra: 'bg-yellow-800 text-white',
  Aqua: 'bg-blue-600 text-white',
  Aero: 'bg-sky-400 text-gray-800',
  Ignis: 'bg-red-600 text-white',
  Lux: 'bg-yellow-300 text-gray-800',
  Umbra: 'bg-indigo-900 text-white',
};

export default function CreatureCard({ 
    creature, isSelectable, isSelected, onSelect, className, showCurrentDefense, isActionable, onAbilitySelect 
}: CreatureCardProps) {
  const healthPercentage = (creature.hp / creature.maxHp) * 100;
  const energyPercentage = (creature.energy / creature.maxEnergy) * 100;

  const handleCardClick = () => {
    if (isSelectable && onSelect) {
      onSelect(creature);
    }
  };

  return (
    <div className="relative">
        <Card 
            className={cn(`overflow-hidden transition-all duration-300`, 
            isSelectable && 'cursor-pointer hover:shadow-lg hover:border-primary',
            isSelected && 'border-primary ring-2 ring-primary',
            className
            )}
            onClick={handleCardClick}
        >
        <CardHeader className="p-4">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-xl font-headline">{creature.name}</CardTitle>
                    <CardDescription>
                        <Badge className={`${typeColors[creature.type]} mt-1`}>{creature.type}</Badge>
                    </CardDescription>
                </div>
                <div className="text-right text-sm">
                    <div className="flex items-center gap-1 justify-end font-bold">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>{creature.hp} / {creature.maxHp}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end font-bold">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span>{creature.energy} / {creature.maxEnergy}</span>
                    </div>
                </div>
            </div>
            <div className="pt-2 space-y-1">
                <Progress value={healthPercentage} aria-label={`${creature.name} health`} className="h-2"/>
                <Progress value={energyPercentage} aria-label={`${creature.name} energy`} className="h-2" />
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
                {creature.isSleeping && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <p className="text-white font-bold text-2xl animate-pulse">Zzz...</p>
                </div>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center text-sm mb-4">
            <div className="flex flex-col items-center justify-center p-2 rounded-md bg-card">
                <Swords className="h-5 w-5 mb-1 text-primary" />
                <span className="font-bold">{creature.attack}</span>
                <span className="text-xs text-muted-foreground">Attack</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-md bg-card">
                <Shield className="h-5 w-5 mb-1 text-primary" />
                <span className="font-bold">{showCurrentDefense ? creature.defense : creature.defense}</span>
                <span className="text-xs text-muted-foreground">Defense</span>
            </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold mb-2 text-center text-muted-foreground">Abilities</h4>
                <TooltipProvider>
                <div className="grid grid-cols-2 gap-2">
                    {creature.abilities.map(ability => (
                        <Tooltip key={ability.name} delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-auto py-1"
                                    disabled={!isActionable || creature.energy < ability.energyCost}
                                    onClick={() => onAbilitySelect?.(ability)}
                                >
                                    {ability.name}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="font-bold">{ability.name} ({ability.type})</p>
                                <p className="text-sm max-w-xs">{ability.description}</p>
                                {ability.type === 'attack' && ability.power && <p className="text-xs">Power: {ability.power}</p>}
                                {ability.type === 'defense' && ability.defenseBoost && <p className="text-xs">Defense: +{ability.defenseBoost}</p>}
                                {ability.type === 'heal' && ability.power && <p className="text-xs">Heals: +{ability.power} HP</p>}
                                <p className="text-xs">Cost: {ability.energyCost} Energy</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                </TooltipProvider>
            </div>
        </CardContent>
        </Card>
    </div>
  );
}

    