'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Creature, GameState } from '@/types';
import CreatureCard from './CreatureCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, Sparkles, Swords } from 'lucide-react';
import TacticalAssistant from './TacticalAssistant';

interface BattleViewProps {
  playerCreatures: Creature[];
  opponentCreatures: Creature[];
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export default function BattleView({ playerCreatures, opponentCreatures, setGameState }: BattleViewProps) {
  const [playerTeam, setPlayerTeam] = useState<Creature[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Creature[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>(['Battle begins!']);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [showTacticalAssistant, setShowTacticalAssistant] = useState(false);

  useEffect(() => {
    // Select first 2 creatures for each team for the battle
    setPlayerTeam(playerCreatures.slice(0, 2).filter(c => c.hp > 0));
    setOpponentTeam(opponentCreatures.slice(0, 2).filter(c => c.hp > 0));
  }, [playerCreatures, opponentCreatures]);

  const addToLog = (message: string) => {
    setBattleLog(prevLog => [message, ...prevLog]);
  };

  const handleAttack = useCallback((attacker: Creature, defender: Creature) => {
    const damage = Math.max(1, Math.floor(attacker.attack * (1 - defender.defense / 200)));
    addToLog(`${attacker.name} attacks ${defender.name} for ${damage} damage!`);

    setGameState(prevState => {
        const updateCreatureHealth = (creatures: Creature[], id: number, dmg: number) => {
            return creatures.map(c => 
                c.id === id ? { ...c, hp: Math.max(0, c.hp - dmg) } : c
            );
        };
        
        let newPlayerCreatures = prevState.playerCreatures;
        let newOpponentCreatures = prevState.opponentCreatures;

        if (playerCreatures.some(c => c.id === defender.id)) {
            newPlayerCreatures = updateCreatureHealth(prevState.playerCreatures, defender.id, damage);
        } else {
            newOpponentCreatures = updateCreatureHealth(prevState.opponentCreatures, defender.id, damage);
        }

        const newPlayerTeam = newPlayerCreatures.filter(c => playerTeam.some(pt => pt.id === c.id));
        const newOpponentTeam = newOpponentCreatures.filter(c => opponentTeam.some(ot => ot.id === c.id));

        if (newPlayerTeam.every(c => c.hp === 0)) {
            addToLog("You have been defeated!");
            setIsBattleOver(true);
        }
        if (newOpponentTeam.every(c => c.hp === 0)) {
            addToLog("You are victorious!");
            setIsBattleOver(true);
        }

        return { ...prevState, playerCreatures: newPlayerCreatures, opponentCreatures: newOpponentCreatures };
    });

    setIsPlayerTurn(prev => !prev);
  }, [setGameState, playerCreatures, playerTeam, opponentTeam]);

  useEffect(() => {
    if (!isPlayerTurn && !isBattleOver) {
      const opponentAttacker = opponentTeam.find(c => c.hp > 0);
      const playerDefender = playerTeam.find(c => c.hp > 0);

      if (opponentAttacker && playerDefender) {
        const timeout = setTimeout(() => {
          handleAttack(opponentAttacker, playerDefender);
        }, 1500);
        return () => clearTimeout(timeout);
      }
    }
  }, [isPlayerTurn, isBattleOver, handleAttack, playerTeam, opponentTeam]);

  const activePlayerCreature = playerTeam.find(c => c.hp > 0);
  const activeOpponentCreature = opponentTeam.find(c => c.hp > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Battle Arena</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Player Side */}
          <div className="space-y-4">
            <h3 className="text-xl font-headline text-center text-green-600">Your Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playerTeam.map(c => <CreatureCard key={c.id} creature={c} />)}
            </div>
          </div>
          {/* Opponent Side */}
          <div className="space-y-4">
            <h3 className="text-xl font-headline text-center text-red-600">Opponent Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {opponentTeam.map(c => <CreatureCard key={c.id} creature={c} />)}
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-headline text-lg">Actions</h3>
             <Button 
                onClick={() => activePlayerCreature && activeOpponentCreature && handleAttack(activePlayerCreature, activeOpponentCreature)}
                disabled={!isPlayerTurn || isBattleOver || !activePlayerCreature || !activeOpponentCreature}
                className="w-full"
                size="lg"
            >
                <Swords className="mr-2 h-5 w-5"/> Attack
            </Button>
            <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowTacticalAssistant(true)}
             >
              <Sparkles className="mr-2 h-5 w-5 text-accent"/> Tactical Assistant
            </Button>
            {isBattleOver && <p className="text-center font-bold text-lg">{playerTeam.every(c => c.hp === 0) ? 'DEFEAT' : 'VICTORY'}</p>}
          </div>
          <div className="md:col-span-2">
            <h3 className="font-headline text-lg mb-2">Battle Log</h3>
            <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/50">
                {battleLog.map((log, index) => <p key={index} className="text-sm mb-1">{log}</p>)}
            </ScrollArea>
          </div>
        </div>
        {showTacticalAssistant && activePlayerCreature && activeOpponentCreature && (
            <TacticalAssistant 
                isOpen={showTacticalAssistant}
                onClose={() => setShowTacticalAssistant(false)}
                playerCreatures={playerCreatures}
                opponentCreatures={opponentCreatures}
                playerTeam={playerTeam}
                opponentTeam={opponentTeam}
            />
        )}
      </CardContent>
    </Card>
  );
}
