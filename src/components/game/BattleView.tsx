
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Creature, GameState, Ability } from '@/types';
import type { StoryChapter } from '@/lib/story';
import CreatureCard from './CreatureCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Swords, Repeat } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface BattleViewProps {
  playerCreatures: Creature[];
  allOpponentCreatures: Creature[];
  storyChapter?: StoryChapter;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBattleWin: (creatures: Creature[]) => void;
  onBattleEnd: () => void;
}

const MAX_SWITCHES = 3;

export default function BattleView({ playerCreatures, allOpponentCreatures, storyChapter, setGameState, onBattleWin, onBattleEnd }: BattleViewProps) {
  const [playerTeam, setPlayerTeam] = useState<Creature[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Creature[]>([]);
  
  const [activePlayerCreature, setActivePlayerCreature] = useState<Creature | null>(null);
  const [activeOpponentCreature, setActiveOpponentCreature] = useState<Creature | null>(null);

  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [battleOutcome, setBattleOutcome] = useState<'win' | 'loss' | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  
  const [showTeamSelection, setShowTeamSelection] = useState(true);
  const [selectedPlayerTeam, setSelectedPlayerTeam] = useState<Creature[]>([]);
  
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [remainingSwitches, setRemainingSwitches] = useState(MAX_SWITCHES);

  const { toast } = useToast();
  
  const resetBattleState = useCallback(() => {
      setPlayerTeam([]);
      setOpponentTeam([]);
      setActivePlayerCreature(null);
      setActiveOpponentCreature(null);
      setBattleLog([]);
      setIsBattleOver(false);
      setBattleOutcome(null);
      setSelectedAbility(null);
      setSelectedPlayerTeam([]);
      setShowTeamSelection(true);
  }, []);

  const startBattle = useCallback(() => {
    if (selectedPlayerTeam.length !== 3) {
      toast({ variant: "destructive", title: "Invalid Team", description: "You must select 3 creatures to start the battle." });
      return;
    }
     if (!storyChapter || !storyChapter.isBattle) {
      toast({ variant: "destructive", title: "No Battle", description: "There is no battle to start at this time." });
      return;
    }
    
    const opponentCreature = allOpponentCreatures.find(c => c.id === storyChapter.opponentId);
    if (!opponentCreature) {
        toast({ variant: "destructive", title: "Error", description: "Opponent for this chapter not found." });
        resetBattleState();
        return;
    }

    const livePlayerTeam = selectedPlayerTeam.map(c => ({...c, hp: c.maxHp, energy: c.maxEnergy, defense: c.defense, isSleeping: false}));
    setPlayerTeam(livePlayerTeam);
    setActivePlayerCreature(livePlayerTeam[0]);

    const liveOpponentTeam = [{...opponentCreature, hp: opponentCreature.maxHp, energy: opponentCreature.maxEnergy, defense: opponentCreature.defense, isSleeping: false}];
    setOpponentTeam(liveOpponentTeam);
    setActiveOpponentCreature(liveOpponentTeam[0]);

    setBattleLog([`A wild ${liveOpponentTeam[0].name} appears!`, 'Battle begins!']);
    setIsPlayerTurn(true);
    setIsBattleOver(false);
    setBattleOutcome(null);
    setShowTeamSelection(false);
    setRemainingSwitches(MAX_SWITCHES);
  }, [selectedPlayerTeam, storyChapter, allOpponentCreatures, toast, resetBattleState]);
  
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
    setBattleLog(prevLog => [message, ...prevLog].slice(0, 50));
  };

  const updateCreatureState = useCallback((creatureId: number, updates: Partial<Creature>, team: 'player' | 'opponent') => {
      const teamToUpdate = team === 'player' ? playerTeam : opponentTeam;
      const setTeam = team === 'player' ? setPlayerTeam : setOpponentTeam;
      const setActive = team === 'player' ? setActivePlayerCreature : setActiveOpponentCreature;
      const activeCreature = team === 'player' ? activePlayerCreature : activeOpponentCreature;
      
      const newTeam = teamToUpdate.map(c => 
          c.id === creatureId ? { ...c, ...updates } : c
      );
      setTeam(newTeam);

      if (activeCreature?.id === creatureId) {
          setActive(newTeam.find(c => c.id === creatureId) || null);
      }
  }, [playerTeam, opponentTeam, activePlayerCreature, activeOpponentCreature]);


  const handleAbilityUse = useCallback(() => {
    if (!selectedAbility || !activePlayerCreature) return;

    const attacker = activePlayerCreature;
    const defender = ['attack', 'debuff'].includes(selectedAbility.type) ? activeOpponentCreature : null;

    if (attacker.energy < selectedAbility.energyCost) {
        addToLog(`${attacker.name} doesn't have enough energy!`);
        return;
    }
    
    let updatedAttacker = { ...attacker };
    updatedAttacker.energy -= selectedAbility.energyCost;
    addToLog(`${attacker.name} uses ${selectedAbility.name}!`);
    const isPlayerAttacker = playerTeam.some(c => c.id === attacker.id);
    const targetTeam = isPlayerAttacker ? 'opponent' : 'player';

    switch (selectedAbility.type) {
        case 'attack':
            if (!defender) return;

            let damage = Math.max(1, attacker.attack + (selectedAbility.power || 0));
            addToLog(`${attacker.name}'s attack power is ${damage}.`);

            let updatedDefender = { ...defender };
            
            const defenseDamage = Math.min(updatedDefender.defense, damage);
            
            if (defenseDamage > 0) {
              updatedDefender.defense -= defenseDamage;
              addToLog(`${updatedDefender.name}'s defense absorbed ${defenseDamage} damage! Remaining defense: ${updatedDefender.defense}`);
            }

            const hpDamage = damage - defenseDamage;
            if (hpDamage > 0) {
              updatedDefender.hp = Math.max(0, updatedDefender.hp - hpDamage);
              addToLog(`${updatedDefender.name} takes ${hpDamage} HP damage! Remaining HP: ${updatedDefender.hp}`);
            }
            
            updateCreatureState(updatedDefender.id, { hp: updatedDefender.hp, defense: updatedDefender.defense }, targetTeam);
            break;
        
        case 'defense':
            const defenseBoost = selectedAbility.defenseBoost || 0;
            updatedAttacker.defense += defenseBoost;
            addToLog(`${updatedAttacker.name}'s defense rose by ${defenseBoost}!`);
            break;

        case 'heal':
            const healAmount = selectedAbility.power || 0;
            const newHp = Math.min(updatedAttacker.maxHp, updatedAttacker.hp + healAmount);
            addToLog(`${updatedAttacker.name} heals for ${newHp - updatedAttacker.hp} HP!`);
            updatedAttacker.hp = newHp;
            break;
        
        case 'buff':
        case 'debuff':
             addToLog(`...but it had no immediate effect.`);
            break;
    }
    
    if (updatedAttacker.energy <= 0) {
        updatedAttacker.isSleeping = true;
        addToLog(`${updatedAttacker.name} ran out of energy and fell asleep!`);
    }

    updateCreatureState(updatedAttacker.id, {
        hp: updatedAttacker.hp,
        energy: updatedAttacker.energy,
        defense: updatedAttacker.defense,
        isSleeping: updatedAttacker.isSleeping
    }, isPlayerAttacker ? 'player' : 'opponent');
    
    setSelectedAbility(null);
    setTimeout(() => setIsPlayerTurn(prev => !prev), 100);
  }, [activePlayerCreature, activeOpponentCreature, selectedAbility, playerTeam, opponentTeam, updateCreatureState]);

  const checkBattleEnd = useCallback(() => {
    if (isBattleOver) return;
    const playerTeamFainted = playerTeam.length > 0 && playerTeam.every(c => c.hp <= 0);
    const opponentTeamFainted = opponentTeam.length > 0 && opponentTeam.every(c => c.hp <= 0);

    if (playerTeamFainted) {
        addToLog("You have been defeated!");
        setIsBattleOver(true);
        setBattleOutcome('loss');
    } else if (opponentTeamFainted) {
        addToLog("You are victorious!");
        setIsBattleOver(true);
        setBattleOutcome('win');
    }
  }, [playerTeam, opponentTeam, isBattleOver]);

   useEffect(() => {
    if (battleOutcome === 'win') {
      onBattleWin(opponentTeam);
    }
  }, [battleOutcome, opponentTeam, onBattleWin]);

  // Main game loop effect
  useEffect(() => {
    if (isBattleOver || showTeamSelection || !playerTeam.length || !opponentTeam.length) return;

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

    if (isPlayerTurn && activePlayerCreature?.isSleeping) {
        addToLog(`${activePlayerCreature.name} woke up!`);
        updateCreatureState(activePlayerCreature.id, { isSleeping: false }, 'player');
        setTimeout(() => setIsPlayerTurn(false), 1000);
        return;
    }

    if (!isPlayerTurn && !isBattleOver && activeOpponentCreature) {
        if (activeOpponentCreature.isSleeping) {
            addToLog(`${activeOpponentCreature.name} is asleep! It woke up!`);
            updateCreatureState(activeOpponentCreature.id, { isSleeping: false }, 'opponent');
            setTimeout(() => setIsPlayerTurn(true), 1500);
            return;
        }

      if (activeOpponentCreature.hp > 0 && activePlayerCreature && activePlayerCreature.hp > 0) {
        const usableAbilities = activeOpponentCreature.abilities.filter(a => a.energyCost <= activeOpponentCreature.energy);
        if (usableAbilities.length > 0) {
            const abilityToUse = usableAbilities[Math.floor(Math.random() * usableAbilities.length)];
            const timeout = setTimeout(() => {
              const performOpponentTurn = (attacker: Creature, defender: Creature, ability: Ability) => {
                  let updatedAttacker = { ...attacker };
                  updatedAttacker.energy -= ability.energyCost;
                  addToLog(`Opponent's ${attacker.name} uses ${ability.name}!`);
              
                  switch (ability.type) {
                      case 'attack':
                          let damage = Math.max(1, attacker.attack + (ability.power || 0));
                          addToLog(`${attacker.name}'s attack power is ${damage}.`);
                          let updatedDefender = { ...defender };
                          const defenseDamage = Math.min(updatedDefender.defense, damage);
                          if (defenseDamage > 0) {
                              updatedDefender.defense -= defenseDamage;
                              addToLog(`Your ${updatedDefender.name}'s defense absorbed ${defenseDamage} damage!`);
                          }
                          const hpDamage = damage - defenseDamage;
                          if (hpDamage > 0) {
                              updatedDefender.hp = Math.max(0, updatedDefender.hp - hpDamage);
                              addToLog(`Your ${updatedDefender.name} takes ${hpDamage} HP damage!`);
                          }
                          updateCreatureState(updatedDefender.id, { hp: updatedDefender.hp, defense: updatedDefender.defense }, 'player');
                          break;
                      case 'defense':
                          updatedAttacker.defense += ability.defenseBoost || 0;
                          addToLog(`Opponent's ${updatedAttacker.name}'s defense rose!`);
                          break;
                      case 'heal':
                          const newHp = Math.min(updatedAttacker.maxHp, updatedAttacker.hp + (ability.power || 0));
                          addToLog(`Opponent's ${updatedAttacker.name} heals!`);
                          updatedAttacker.hp = newHp;
                          break;
                      default:
                          break;
                  }
                  
                  if (updatedAttacker.energy <= 0) {
                      updatedAttacker.isSleeping = true;
                      addToLog(`Opponent's ${updatedAttacker.name} ran out of energy and fell asleep!`);
                  }
              
                  updateCreatureState(updatedAttacker.id, { ...updatedAttacker }, 'opponent');
                  setIsPlayerTurn(true);
              };
              performOpponentTurn(activeOpponentCreature, activePlayerCreature, abilityToUse);
            }, 1500);
            return () => clearTimeout(timeout);
        } else {
             addToLog(`${activeOpponentCreature.name} has no energy to use an ability and fell asleep!`);
             updateCreatureState(activeOpponentCreature.id, { isSleeping: true }, 'opponent');
             setTimeout(() => setIsPlayerTurn(true), 1500);
        }
      } else {
        setIsPlayerTurn(true);
      }
    }
  }, [isPlayerTurn, isBattleOver, playerTeam, opponentTeam, activePlayerCreature, activeOpponentCreature, showTeamSelection, updateCreatureState]);

  useEffect(() => {
      checkBattleEnd();
  }, [playerTeam, opponentTeam, checkBattleEnd]);


  const handleSwitchCreature = (creature: Creature) => {
    if (creature.id !== activePlayerCreature?.id && creature.hp > 0 && !isBattleOver) {
        if (remainingSwitches <= 0) {
            toast({ variant: "destructive", title: "No switches left!", description: "You cannot switch creatures anymore in this battle." });
            return;
        }
        
        const creatureToSwitch = playerTeam.find(c => c.id === creature.id);
        if(!creatureToSwitch) return;

        const newActiveCreature = { ...creatureToSwitch, energy: creatureToSwitch.maxEnergy, isSleeping: false };
        
        const newPlayerTeam = playerTeam.map(c => c.id === creature.id ? { ...c, energy: c.maxEnergy, isSleeping: false } : c);
        setPlayerTeam(newPlayerTeam);
        setActivePlayerCreature(newActiveCreature);

        addToLog(`Go, ${creature.name}!`);
        setShowSwitchDialog(false);
        setRemainingSwitches(prev => prev - 1);
        setIsPlayerTurn(true); // Player keeps the turn after switching
    }
  }
  
  const canPlayerAct = useMemo(() => {
    return isPlayerTurn && !isBattleOver && activePlayerCreature && activePlayerCreature.hp > 0 && !activePlayerCreature.isSleeping;
  }, [isPlayerTurn, isBattleOver, activePlayerCreature]);

  useEffect(() => {
    if (storyChapter?.isBattle) {
      if (playerCreatures.length >= 3) {
        const initialTeam = playerCreatures.slice(0,3);
        setSelectedPlayerTeam(initialTeam);
      } else {
        setSelectedPlayerTeam(playerCreatures);
      }
      setShowTeamSelection(true);
    } else {
        setShowTeamSelection(false);
    }
  }, [storyChapter, playerCreatures]);
  
  if (!storyChapter || !storyChapter.isBattle) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Awaiting Story</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Explore the world and progress the story to find your next battle.</p>
        </CardContent>
      </Card>
    );
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

  const handleAbilitySelect = (ability: Ability) => {
      if (!canPlayerAct) return;
      if (activePlayerCreature && activePlayerCreature.energy < ability.energyCost) {
          toast({ variant: "destructive", title: "Not enough energy!", description: `${activePlayerCreature.name} doesn't have enough energy for ${ability.name}.` });
          return;
      }
      setSelectedAbility(ability);
  }

  const handleEndBattleClick = () => {
    onBattleEnd();
    resetBattleState();
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex justify-between items-center">
            <span>Battle Arena</span>
            <div className='flex items-center gap-4'>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSwitchDialog(true)}
                    disabled={!isPlayerTurn || isBattleOver || playerTeam.filter(c => c.hp > 0).length <= 1 || remainingSwitches <= 0 || activePlayerCreature?.isSleeping}
                 >
                  <Repeat className="mr-2 h-4 w-4"/> Switch ({remainingSwitches} left)
                </Button>
            </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-start">
            <div className="space-y-4 md:col-span-5">
                <h3 className="text-xl font-headline text-center text-green-400">Your Team</h3>
                {activePlayerCreature && 
                    <CreatureCard 
                        creature={activePlayerCreature} 
                        showCurrentDefense 
                        isActionable={canPlayerAct}
                        onAbilitySelect={handleAbilitySelect}
                    />
                }
                <div className="flex justify-center gap-2">
                    {playerTeam.map(c => (
                        <button key={c.id} onClick={() => setShowSwitchDialog(true)} disabled={c.id === activePlayerCreature?.id || c.hp <= 0}>
                            <img src={c.imageUrl} alt={c.name} className={`w-12 h-12 rounded-full border-2 ${c.id === activePlayerCreature?.id ? 'border-primary' : 'border-muted'} ${c.hp <= 0 ? 'grayscale opacity-50' : ''}`} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2 md:col-span-1 flex flex-col items-center justify-center h-full">
                 <Swords size={48} className="text-muted-foreground my-4" />
                 <ScrollArea className="h-40 w-full rounded-md border p-2 bg-muted/50 text-center">
                    <h3 className="font-headline text-lg mb-2">Battle Log</h3>
                    {battleLog.map((log, index) => <p key={index} className="text-sm mb-1">{log}</p>)}
                </ScrollArea>
                 {isBattleOver && (
                    <div className="text-center p-4">
                        <p className="font-bold text-2xl mb-2">{battleOutcome === 'win' ? 'VICTORY' : 'DEFEAT'}</p>
                        <Button onClick={handleEndBattleClick} className="mt-2">Continue Story</Button>
                    </div>
                )}
            </div>

            <div className="space-y-4 md:col-span-5">
                <h3 className="text-xl font-headline text-center text-red-400">Opponent</h3>
                {activeOpponentCreature && <CreatureCard creature={activeOpponentCreature} showCurrentDefense />}
            </div>
        </div>
        
        <AlertDialog open={!!selectedAbility} onOpenChange={() => setSelectedAbility(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want {activePlayerCreature?.name} to use {selectedAbility?.name}?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedAbility(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAbilityUse}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showSwitchDialog} onOpenChange={setShowSwitchDialog}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Switch Creature</DialogTitle>
                    <DialogDescription>Select a creature to switch to. You have {remainingSwitches} switches left.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    {playerTeam.map(c => (
                        <div key={c.id} onClick={() => handleSwitchCreature(c)} className={`cursor-pointer ${c.id === activePlayerCreature?.id || c.hp <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:ring-2 hover:ring-primary rounded-lg'}`}>
                             <CreatureCard
                                creature={c}
                                isSelectable={!(c.id === activePlayerCreature?.id || c.hp <= 0)}
                                isSelected={c.id === activePlayerCreature?.id}
                                className="w-full"
                            />
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={() => {
                        if(activePlayerCreature?.hp <= 0) return;
                        setShowSwitchDialog(false)
                    }}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
