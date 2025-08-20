'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Creature, GameState, Ability } from '@/types';
import CreatureCard from './CreatureCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, Sparkles, Swords, Shield } from 'lucide-react';
import TacticalAssistant from './TacticalAssistant';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


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
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

  useEffect(() => {
    // Select first 2 creatures for each team for the battle
    setPlayerTeam(playerCreatures.slice(0, 2).filter(c => c.hp > 0));
    setOpponentTeam(opponentCreatures.slice(0, 2).filter(c => c.hp > 0));
  }, [playerCreatures, opponentCreatures]);

  const addToLog = (message: string) => {
    setBattleLog(prevLog => [message, ...prevLog]);
  };

  const handleAbilityUse = useCallback((attacker: Creature, defender: Creature | null, ability: Ability) => {
    addToLog(`${attacker.name} uses ${ability.name}!`);

    if (ability.type === 'attack') {
        if(!defender) return;
        const damage = Math.max(1, Math.floor((attacker.attack + (ability.power || 0)) * (1 - defender.defense / 200)));
        addToLog(`${defender.name} takes ${damage} damage!`);
        
        setGameState(prevState => {
            const updateCreatureHealth = (creatures: Creature[], id: number, dmg: number) => {
                return creatures.map(c => 
                    c.id === id ? { ...c, hp: Math.max(0, c.hp - dmg) } : c
                );
            };

            const isPlayerDefender = prevState.playerCreatures.some(c => c.id === defender.id);
            const newPlayerCreatures = isPlayerDefender ? updateCreatureHealth(prevState.playerCreatures, defender.id, damage) : prevState.playerCreatures;
            const newOpponentCreatures = !isPlayerDefender ? updateCreatureHealth(prevState.opponentCreatures, defender.id, damage) : prevState.opponentCreatures;
            
            return { ...prevState, playerCreatures: newPlayerCreatures, opponentCreatures: newOpponentCreatures };
        });
    } else if (ability.type === 'defense') {
        setGameState(prevState => {
            const updateCreatureDefense = (creatures: Creature[]) => creatures.map(c =>
                c.id === attacker.id ? { ...c, defense: c.defense + (ability.defenseBoost || 0) } : c
            );
            const isPlayerAttacker = prevState.playerCreatures.some(c => c.id === attacker.id);
            const newPlayerCreatures = isPlayerAttacker ? updateCreatureDefense(prevState.playerCreatures) : prevState.playerCreatures;
            const newOpponentCreatures = !isPlayerAttacker ? updateCreatureDefense(prevState.opponentCreatures) : prevState.opponentCreatures;
            
            addToLog(`${attacker.name}'s defense rose!`);
            return { ...prevState, playerCreatures: newPlayerCreatures, opponentCreatures: newOpponentCreatures };
        });
    }
    // TODO: Implement buff/debuff effects

    // Check for battle end condition
    setGameState(prevState => {
      const updatedPlayerTeam = prevState.playerCreatures.filter(c => playerTeam.map(pc => pc.id).includes(c.id));
      const updatedOpponentTeam = prevState.opponentCreatures.filter(c => opponentTeam.map(oc => oc.id).includes(c.id));

      if (updatedPlayerTeam.every(c => c.hp <= 0)) {
        addToLog("You have been defeated!");
        setIsBattleOver(true);
      }
      if (updatedOpponentTeam.every(c => c.hp <= 0)) {
        addToLog("You are victorious!");
        setIsBattleOver(true);
      }
      return prevState;
    });

    setIsPlayerTurn(prev => !prev);
    setSelectedAbility(null);
  }, [setGameState, playerTeam, opponentTeam]);

  useEffect(() => {
    if (!isPlayerTurn && !isBattleOver) {
      const opponentAttacker = opponentTeam.find(c => c.hp > 0);
      const playerDefender = playerTeam.find(c => c.hp > 0);

      if (opponentAttacker && playerDefender) {
        const attackAbility = opponentAttacker.abilities.find(a => a.type === 'attack');
        if (attackAbility) {
            const timeout = setTimeout(() => {
              handleAbilityUse(opponentAttacker, playerDefender, attackAbility);
            }, 1500);
            return () => clearTimeout(timeout);
        }
      }
    }
  }, [isPlayerTurn, isBattleOver, handleAbilityUse, playerTeam, opponentTeam]);

  const activePlayerCreature = playerTeam.find(c => c.hp > 0);
  const activeOpponentCreature = opponentTeam.find(c => c.hp > 0);
  
  const handleUseAbility = () => {
    if (selectedAbility && activePlayerCreature) {
        const defender = selectedAbility.type === 'attack' ? activeOpponentCreature : null;
        if (selectedAbility.type === 'attack' && !defender) {
            addToLog("No target for attack!");
            return;
        }
        handleAbilityUse(activePlayerCreature, defender, selectedAbility);
    }
  }

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
            <div className="flex flex-col items-center sm:items-stretch gap-4">
                {opponentTeam.map(c => <CreatureCard key={c.id} creature={c} className="w-full max-w-sm sm:max-w-none" />)}
            </div>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-headline text-lg">Actions</h3>
            {activePlayerCreature && (
                <div className="space-y-2">
                    <p className="font-semibold text-center">{activePlayerCreature.name}'s Abilities</p>
                    <div className="grid grid-cols-2 gap-2">
                        {activePlayerCreature.abilities.map(ability => (
                            <Button 
                                key={ability.name}
                                variant={selectedAbility?.name === ability.name ? 'default' : 'outline'}
                                onClick={() => setSelectedAbility(ability)}
                                disabled={!isPlayerTurn || isBattleOver}
                                className="h-auto py-2 flex flex-col"
                            >
                                <span className="font-bold">{ability.name}</span>
                                <span className="text-xs text-muted-foreground">{ability.description}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        disabled={!isPlayerTurn || isBattleOver || !activePlayerCreature || !selectedAbility}
                        className="w-full"
                        size="lg"
                    >
                       <Swords className="mr-2 h-5 w-5"/> Use Ability
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to use {selectedAbility?.name}?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleUseAbility}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
