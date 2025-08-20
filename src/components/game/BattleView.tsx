'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { Creature, GameState, Ability } from '@/types';
import CreatureCard from './CreatureCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bot, Sparkles, Swords, Shield, Heart, Repeat } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface BattleViewProps {
  playerCreatures: Creature[];
  allOpponentCreatures: Creature[];
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBattleWin: (creatures: Creature[]) => void;
}

export default function BattleView({ playerCreatures, allOpponentCreatures, setGameState, onBattleWin }: BattleViewProps) {
  const [playerTeam, setPlayerTeam] = useState<Creature[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Creature[]>([]);
  
  const [activePlayerCreature, setActivePlayerCreature] = useState<Creature | null>(null);
  const [activeOpponentCreature, setActiveOpponentCreature] = useState<Creature | null>(null);

  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [showTacticalAssistant, setShowTacticalAssistant] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  
  const [showTeamSelection, setShowTeamSelection] = useState(true);
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState<Creature[]>([]);
  
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);

  const startBattle = () => {
    if (selectedPlayerTeam.length !== 3) {
      addToLog("You must select 3 creatures to start the battle.");
      return;
    }

    const livePlayerTeam = selectedPlayerTeam.map(c => ({...c, hp: c.maxHp}));
    setPlayerTeam(livePlayerTeam);
    setActivePlayerCreature(livePlayerTeam[0]);

    // Opponent randomly selects 3 creatures
    const shuffledOpponents = [...allOpponentCreatures].sort(() => 0.5 - Math.random());
    const liveOpponentTeam = shuffledOpponents.slice(0, 3).map(c => ({...c, hp: c.maxHp}));
    setOpponentTeam(liveOpponentTeam);
    setActiveOpponentCreature(liveOpponentTeam[0]);

    setBattleLog(['Battle begins!']);
    setIsPlayerTurn(true);
    setIsBattleOver(false);
    setShowTeamSelection(false);
  };
  
  const handleSelectPlayerCreature = (creature: Creature) => {
    setSelectedPlayerTeam(prev => {
      if (prev.some(c => c.id === creature.id)) {
        return prev.filter(c => c.id !== creature.id);
      }
      if (prev.length < 3) {
        return [...prev, creature];
      }
      return prev;
    });
  };

  const addToLog = (message: string) => {
    setBattleLog(prevLog => [message, ...prevLog]);
  };

  const updateCreatureState = (creatureId: number, updates: Partial<Creature>) => {
    const applyUpdates = (creatures: Creature[]) => 
        creatures.map(c => c.id === creatureId ? { ...c, ...updates } : c);

    setPlayerTeam(applyUpdates);
    setOpponentTeam(applyUpdates);

    if (activePlayerCreature?.id === creatureId) {
        setActivePlayerCreature(c => c ? { ...c, ...updates } : null);
    }
    if (activeOpponentCreature?.id === creatureId) {
        setActiveOpponentCreature(c => c ? { ...c, ...updates } : null);
    }
    
    setGameState(prevState => {
        return { 
            ...prevState, 
            playerCreatures: applyUpdates(prevState.playerCreatures),
            opponentCreatures: applyUpdates(prevState.opponentCreatures)
        };
    });
  }


  const handleAbilityUse = useCallback((attacker: Creature, defender: Creature | null, ability: Ability) => {
    addToLog(`${attacker.name} uses ${ability.name}!`);

    let damage = 0;

    switch (ability.type) {
        case 'attack':
            if (!defender) return;
            damage = Math.max(1, Math.floor((attacker.attack + (ability.power || 0)) * (1 - defender.defense / 200)));
            addToLog(`${defender.name} takes ${damage} damage!`);
            updateCreatureState(defender.id, { hp: Math.max(0, defender.hp - damage) });
            break;
        
        case 'defense':
            const defenseBoost = ability.defenseBoost || 0;
            addToLog(`${attacker.name}'s defense rose by ${defenseBoost}!`);
            updateCreatureState(attacker.id, { defense: attacker.defense + defenseBoost });
            break;

        case 'heal':
            const healAmount = ability.power || 0;
            const newHp = Math.min(attacker.maxHp, attacker.hp + healAmount);
            addToLog(`${attacker.name} heals for ${healAmount} HP!`);
            updateCreatureState(attacker.id, { hp: newHp });
            break;
        
        case 'buff':
        case 'debuff':
             addToLog(`...but it had no immediate effect.`); // Placeholder for more complex effects
            break;
    }
    
    setSelectedAbility(null);
    // Use timeout to allow state to update before checking for fainted creatures
    setTimeout(() => setIsPlayerTurn(prev => !prev), 100);

  }, [setGameState]);

  const checkBattleEnd = useCallback(() => {
    if (isBattleOver) return;

    const playerTeamFainted = playerTeam.every(c => c.hp <= 0);
    const opponentTeamFainted = opponentTeam.every(c => c.hp <= 0);

    if (playerTeamFainted) {
        addToLog("You have been defeated!");
        setIsBattleOver(true);
    } else if (opponentTeamFainted) {
        addToLog("You are victorious!");
        onBattleWin(opponentTeam); // Pass defeated opponents to unlock
        setIsBattleOver(true);
    }
  }, [playerTeam, opponentTeam, isBattleOver, onBattleWin]);

  // Main game loop effect
  useEffect(() => {
    if (isBattleOver || showTeamSelection) return;

    checkBattleEnd();

    // Handle fainted active creature
    if (activePlayerCreature?.hp <= 0) {
        const nextPlayerCreature = playerTeam.find(c => c.hp > 0);
        if (nextPlayerCreature) {
            addToLog(`${activePlayerCreature.name} has fainted!`);
            if(isPlayerTurn) {
                setShowSwitchDialog(true);
            }
        }
    }
    
    if (activeOpponentCreature?.hp <= 0) {
        const nextOpponentCreature = opponentTeam.find(c => c.hp > 0);
        if (nextOpponentCreature) {
            addToLog(`${activeOpponentCreature.name} has fainted!`);
            setActiveOpponentCreature(nextOpponentCreature);
            addToLog(`Opponent sends out ${nextOpponentCreature.name}!`);
        }
    }


    // Opponent's turn logic
    if (!isPlayerTurn && !isBattleOver) {
      if (activeOpponentCreature && activeOpponentCreature.hp > 0 && activePlayerCreature && activePlayerCreature.hp > 0) {
        const attackAbility = activeOpponentCreature.abilities.find(a => a.type === 'attack');
        if (attackAbility) {
            const timeout = setTimeout(() => {
              handleAbilityUse(activeOpponentCreature, activePlayerCreature, attackAbility);
            }, 1500);
            return () => clearTimeout(timeout);
        }
      } else {
        setIsPlayerTurn(true); // Skip turn if opponent can't act
      }
    }
  }, [isPlayerTurn, isBattleOver, handleAbilityUse, playerTeam, opponentTeam, activePlayerCreature, activeOpponentCreature, checkBattleEnd, showTeamSelection]);


  const handleUseAbility = () => {
    if (selectedAbility && activePlayerCreature) {
        const defender = ['attack', 'debuff'].includes(selectedAbility.type) ? activeOpponentCreature : null;
        if (defender === null && ['attack', 'debuff'].includes(selectedAbility.type)) {
            addToLog("No target for ability!");
            return;
        }
        handleAbilityUse(activePlayerCreature, defender, selectedAbility);
    }
  }

  const handleSwitchCreature = (creature: Creature) => {
    if (creature.id !== activePlayerCreature?.id && creature.hp > 0 && !isBattleOver) {
        setActivePlayerCreature(creature);
        addToLog(`Go, ${creature.name}!`);
        setShowSwitchDialog(false);
        setIsPlayerTurn(false);
    }
  }

  const resetBattle = () => {
    setShowTeamSelection(true);
    setSelectedPlayerTeam([]);
    setPlayerTeam([]);
    setOpponentTeam([]);
    setActivePlayerCreature(null);
    setActiveOpponentCreature(null);
    setBattleLog([]);
    setIsBattleOver(false);
  }

  if (showTeamSelection) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Choose Your Team</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4 text-muted-foreground">Select 3 creatures from your roster to take into battle.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {playerCreatures.map(c => (
                        <CreatureCard 
                            key={c.id} 
                            creature={c} 
                            isSelectable 
                            isSelected={selectedPlayerTeam.some(sc => sc.id === c.id)}
                            onSelect={() => handleSelectPlayerCreature(c)}
                        />
                    ))}
                </div>
                <Button onClick={startBattle} disabled={selectedPlayerTeam.length !== 3} size="lg">
                    Start Battle ({selectedPlayerTeam.length}/3)
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Battle Arena</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Player Side */}
            <div className="space-y-4 md:col-span-1">
                <h3 className="text-xl font-headline text-center text-green-400">Your Team</h3>
                {activePlayerCreature && <CreatureCard creature={activePlayerCreature} />}
                <div className="flex justify-center gap-2">
                    {playerTeam.map(c => (
                        <button key={c.id} onClick={() => setShowSwitchDialog(true)} disabled={c.id === activePlayerCreature?.id || c.hp <= 0}>
                            <img src={c.imageUrl} alt={c.name} className={`w-12 h-12 rounded-full border-2 ${c.id === activePlayerCreature?.id ? 'border-primary' : 'border-muted'} ${c.hp <= 0 ? 'grayscale opacity-50' : ''}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Battle Log / Actions */}
            <div className="space-y-4 md:col-span-1">
                <h3 className="font-headline text-lg mb-2 text-center">Battle Log</h3>
                <ScrollArea className="h-48 w-full rounded-md border p-4 bg-muted/50">
                    {battleLog.map((log, index) => <p key={index} className="text-sm mb-1">{log}</p>)}
                </ScrollArea>
                 {isBattleOver && (
                    <div className="text-center">
                        <p className="font-bold text-lg">{opponentTeam.every(c => c.hp === 0) ? 'VICTORY' : 'DEFEAT'}</p>
                        <Button onClick={resetBattle} className="mt-2">New Battle</Button>
                    </div>
                )}
            </div>

            {/* Opponent Side */}
            <div className="space-y-4 md:col-span-1">
                <h3 className="text-xl font-headline text-center text-red-400">Opponent Team</h3>
                {activeOpponentCreature && <CreatureCard creature={activeOpponentCreature} />}
                 <div className="flex justify-center gap-2">
                    {opponentTeam.map(c => (
                        <div key={c.id}>
                            <img src={c.imageUrl} alt={c.name} className={`w-12 h-12 rounded-full border-2 ${c.id === activeOpponentCreature?.id ? 'border-destructive' : 'border-muted'} ${c.hp <= 0 ? 'grayscale opacity-50' : ''}`} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <Separator className="my-6" />

        {/* Player Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-headline text-lg">Actions</h3>
            {activePlayerCreature && activePlayerCreature.hp > 0 && (
                <div className="space-y-2">
                    <p className="font-semibold text-center">{activePlayerCreature.name}'s Abilities</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {activePlayerCreature.abilities.map(ability => (
                            <Button 
                                key={ability.name}
                                variant={selectedAbility?.name === ability.name ? 'default' : 'outline'}
                                onClick={() => setSelectedAbility(ability)}
                                disabled={!isPlayerTurn || isBattleOver}
                                className="h-auto py-2 flex flex-col items-center justify-center text-center"
                            >
                                <div className="flex items-center gap-2">
                                    {ability.type === 'attack' && <Swords size={16} />}
                                    {ability.type === 'defense' && <Shield size={16} />}
                                    {ability.type === 'heal' && <Heart size={16} />}
                                    <span className="font-bold">{ability.name}</span>
                                </div>
                                <span className="text-xs text-muted-foreground px-1">{ability.description}</span>
                            </Button>
                        ))}
                    </div>
                </div>
            )}
          </div>
          <div className="space-y-2 flex flex-col justify-start">
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button 
                        disabled={!isPlayerTurn || isBattleOver || !activePlayerCreature || !selectedAbility || activePlayerCreature.hp <= 0}
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
                            Are you sure you want {activePlayerCreature?.name} to use {selectedAbility?.name}?
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
                onClick={() => setShowSwitchDialog(true)}
                disabled={!isPlayerTurn || isBattleOver || playerTeam.filter(c => c.hp > 0).length <= 1}
             >
              <Repeat className="mr-2 h-5 w-5"/> Switch Creature
            </Button>
             <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowTacticalAssistant(true)}
             >
              <Sparkles className="mr-2 h-5 w-5 text-accent"/> Tactical Assistant
            </Button>
          </div>
        </div>
        
        {/* Modals */}
        <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Switch Creature</DialogTitle>
                    <DialogDescription>Select a creature to switch to.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    {playerTeam.map(c => (
                        <div key={c.id} className="flex flex-col items-center">
                            <button
                                onClick={() => handleSwitchCreature(c)}
                                disabled={c.id === activePlayerCreature?.id || c.hp <= 0}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <CreatureCard creature={c} className="w-full"/>
                            </button>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => {
                        // If force switching, don't allow close
                        if(activePlayerCreature?.hp <= 0) return;
                        setShowSwitchDialog(false)
                    }}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {showTacticalAssistant && activePlayerCreature && (
            <TacticalAssistant 
                isOpen={showTacticalAssistant}
                onClose={() => setShowTacticalAssistant(false)}
                playerCreatures={playerCreatures}
                opponentCreatures={allOpponentCreatures}
                playerTeam={playerTeam}
                opponentTeam={opponentTeam}
            />
        )}
      </CardContent>
    </Card>
  );
}
