'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Flame, Mountain, TreePine, Waves, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

const terrainTypes = {
  plains: { icon: TreePine, color: 'bg-green-200 dark:bg-green-800', name: 'Plains' },
  forest: { icon: TreePine, color: 'bg-green-400 dark:bg-green-600', name: 'Forest' },
  mountain: { icon: Mountain, color: 'bg-gray-400 dark:bg-gray-600', name: 'Mountain' },
  water: { icon: Waves, color: 'bg-blue-400 dark:bg-blue-600', name: 'Water' },
  desert: { icon: Sun, color: 'bg-yellow-300 dark:bg-yellow-700', name: 'Desert' },
  volcano: { icon: Flame, color: 'bg-red-500 dark:bg-red-800', name: 'Volcano' },
  swamp: { icon: Moon, color: 'bg-purple-400 dark:bg-purple-800', name: 'Swamp' },
};

type TerrainKey = keyof typeof terrainTypes;

const mapLayout: TerrainKey[][] = [
  ['mountain', 'mountain', 'forest', 'forest', 'plains', 'plains', 'plains', 'water', 'water', 'water'],
  ['mountain', 'forest', 'forest', 'plains', 'plains', 'desert', 'desert', 'water', 'water', 'water'],
  ['forest', 'plains', 'plains', 'plains', 'desert', 'desert', 'desert', 'plains', 'water', 'water'],
  ['plains', 'plains', 'swamp', 'swamp', 'plains', 'desert', 'plains', 'plains', 'water', 'water'],
  ['plains', 'swamp', 'swamp', 'plains', 'plains', 'plains', 'plains', 'forest', 'forest', 'water'],
  ['water', 'water', 'plains', 'plains', 'volcano', 'plains', 'forest', 'forest', 'mountain', 'mountain'],
  ['water', 'water', 'water', 'plains', 'plains', 'plains', 'forest', 'mountain', 'mountain', 'mountain'],
  ['water', 'water', 'water', 'water', 'plains', 'forest', 'forest', 'mountain', 'mountain', 'forest'],
  ['water', 'water', 'water', 'water', 'plains', 'plains', 'forest', 'forest', 'forest', 'plains'],
  ['water', 'water', 'water', 'water', 'water', 'plains', 'plains', 'plains', 'plains', 'plains'],
];

export default function MapView() {
  const [playerPosition, setPlayerPosition] = React.useState({ x: 4, y: 4 });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">World Map</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="flex justify-center items-center bg-card p-4 rounded-lg">
            <div className="grid grid-cols-10 gap-1 aspect-square w-full max-w-2xl mx-auto">
              {mapLayout.map((row, y) =>
                row.map((terrainKey, x) => {
                  const terrain = terrainTypes[terrainKey];
                  const Icon = terrain.icon;
                  const isPlayerPosition = playerPosition.x === x && playerPosition.y === y;
                  return (
                    <Tooltip key={`${x}-${y}`} delayDuration={100}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            'aspect-square flex items-center justify-center rounded-sm transition-all duration-200 cursor-pointer hover:ring-2 hover:ring-primary',
                            terrain.color,
                            isPlayerPosition && 'ring-2 ring-offset-2 ring-offset-background ring-white dark:ring-white'
                          )}
                          onClick={() => setPlayerPosition({ x, y })}
                        >
                          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-black/50" />
                           {isPlayerPosition && (
                            <div className="absolute text-2xl animate-bounce">🧍</div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{terrain.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              )}
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
