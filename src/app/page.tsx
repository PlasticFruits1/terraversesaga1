'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGameState } from '@/hooks/useGameState';
import GameHeader from '@/components/game/GameHeader';
import RosterView from '@/components/game/RosterView';
import BattleView from '@/components/game/BattleView';
import MapView from '@/components/game/MapView';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const { gameState, saveGame, loadGame, resetGame, setGameState, unlockCreature } = useGameState();

  if (!gameState) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container h-14 flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4 md:p-6">
           <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-[60vh] w-full" />
              </div>
            </CardContent>
           </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <GameHeader onSave={saveGame} onLoad={loadGame} onReset={resetGame} />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        <Tabs defaultValue="battle" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border rounded-lg">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="roster">Roster</TabsTrigger>
            <TabsTrigger value="battle">Battle</TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="mt-4">
            <MapView />
          </TabsContent>
          <TabsContent value="roster" className="mt-4">
            <RosterView creatures={gameState.playerCreatures} />
          </TabsContent>
          <TabsContent value="battle" className="mt-4">
            <BattleView
              playerCreatures={gameState.playerCreatures}
              allOpponentCreatures={gameState.opponentCreatures}
              setGameState={setGameState}
              onBattleWin={unlockCreature}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
