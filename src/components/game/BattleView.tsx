
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import type { Creature, GameState, Ability } from '@/types';
import type { StoryChapter } from '@/lib/story';
import CreatureCard from './CreatureCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Swords, Repeat, Users } from 'lucide-react';
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
  playerTeam: Creature[];
  playerCreatures: Creature[];
  allOpponentCreatures: Creature[];
  storyChapter?: StoryChapter;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBattleWin: (creatures: Creature[]) => void;
  onBattleEnd: () => void;
  onSwitchToRoster: () => void;
}

const MAX_SWITCHES = 3;
const ENERGY_REGEN_PER_TURN = 10;

type BattleStatus = 'awaiting' | 'in_progress' | 'finished';
type FloatingText = { id: number; text: string; team: 'player' | 'opponent'; type: 'damage' | 'heal' | 'info' };

export default function BattleView({ playerTeam: initialPlayerTeam, playerCreatures, allOpponentCreatures, storyChapter, setGameState, onBattleWin, onBattleEnd, onSwitchToRoster }: BattleViewProps) {
  const [battleStatus, setBattleStatus] = useState<BattleStatus>('awaiting');
  const [playerBattleTeam, setPlayerBattleTeam] = useState<Creature[]>([]);
  const [opponentTeam, setOpponentTeam] = useState<Creature[]>([]);
  
  const [activePlayerCreature, setActivePlayerCreature] = useState<Creature | null>(null);
  const [activeOpponentCreature, setActiveOpponentCreature] = useState<Creature | null>(null);

  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleOutcome, setBattleOutcome] = useState<'win' | 'loss' | null>(null);
  const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
  
  const [showSwitchDialog, setShowSwitchDialog] = useState(false);
  const [showVictoryDialog, setShowVictoryDialog] = useState(false);
  const [remainingSwitches, setRemainingSwitches] = useState(MAX_SWITCHES);

  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const { toast } = useToast();
  
  const addFloatingText = useCallback((text: string, team: 'player' | 'opponent', type: FloatingText['type'] = 'info') => {
    const newText: FloatingText = { id: Date.now() + Math.random(), text, team, type };
    setFloatingTexts(prev => [...prev, newText]);
    setTimeout(() => {
      setFloatingTexts(current => current.filter(t => t.id !== newText.id));
    }, 3000); // Remove after animation finishes
  }, []);
  
  const resetBattleState = useCallback(() => {
      setBattleStatus('awaiting');
      setPlayerBattleTeam([]);
      setOpponentTeam([]);
      setActivePlayerCreature(null);
      setActiveOpponentCreature(null);
      setBattleLog([]);
      setBattleOutcome(null);
      setSelectedAbility(null);
      setFloatingTexts([]);
      setShowVictoryDialog(false);
  }, []);
  
  useEffect(() => {
    if (storyChapter?.isBattle) {
      setBattleStatus('awaiting'); // Ready to start a new battle
    } else {
      resetBattleState();
    }
  }, [storyChapter, resetBattleState]);


  const startBattle = useCallback(() => {
     if (!storyChapter || !storyChapter.isBattle) {
      toast({ variant: "destructive", title: "No Battle", description: "There is no battle to start at this time." });
      return;
    }
    
    if (initialPlayerTeam.length === 0) {
        toast({ variant: "destructive", title: "Team Required", description: "You must select at least one creature." });
        onSwitchToRoster();
        return;
    }
    
    const opponentCreature = allOpponentCreatures.find(c => c.id === storyChapter.opponentId);
    if (!opponentCreature) {
        toast({ variant: "destructive", title: "Error", description: "Opponent for this chapter not found." });
        resetBattleState();
        return;
    }

    const livePlayerTeam = initialPlayerTeam.map(c => ({...c, hp: c.maxHp, energy: c.maxEnergy, defense: c.defense, isSleeping: false}));
    setPlayerBattleTeam(livePlayerTeam);
    setActivePlayerCreature(livePlayerTeam[0]);

    const liveOpponentTeam = [{...opponentCreature, hp: opponentCreature.maxHp, energy: opponentCreature.maxEnergy, defense: opponentCreature.defense, isSleeping: false}];
    setOpponentTeam(liveOpponentTeam);
    setActiveOpponentCreature(liveOpponentTeam[0]);

    setBattleLog([`A wild ${liveOpponentTeam[0].name} appears!`, 'Battle begins!']);
    setIsPlayerTurn(true);
    setBattleOutcome(null);
    setRemainingSwitches(MAX_SWITCHES);
    setBattleStatus('in_progress');

  }, [storyChapter, allOpponentCreatures, toast, resetBattleState, initialPlayerTeam, onSwitchToRoster]);
  
  const addToLog = (message: string) => {
    setBattleLog(prevLog => [message, ...prevLog].slice(0, 50));
  };

  const updateCreatureState = useCallback((creatureId: number, updates: Partial<Creature>, team: 'player' | 'opponent') => {
      const teamToUpdate = team === 'player' ? playerBattleTeam : opponentTeam;
      const setTeam = team === 'player' ? setPlayerBattleTeam : setOpponentTeam;
      const setActive = team === 'player' ? setActivePlayerCreature : setActiveOpponentCreature;
      const activeCreature = team === 'player' ? activePlayerCreature : activeOpponentCreature;
      
      const newTeam = teamToUpdate.map(c => 
          c.id === creatureId ? { ...c, ...updates } : c
      );
      setTeam(newTeam);

      if (activeCreature?.id === creatureId) {
          setActive(newTeam.find(c => c.id === creatureId) || null);
      }
  }, [playerBattleTeam, opponentTeam, activePlayerCreature, activeOpponentCreature]);


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
    const isPlayerAttacker = playerBattleTeam.some(c => c.id === attacker.id);
    const targetTeam = isPlayerAttacker ? 'opponent' : 'player';

    switch (selectedAbility.type) {
        case 'attack':
            if (!defender) return;
            let updatedDefender = { ...defender };
            
            const baseDamage = attacker.attack + (selectedAbility.power || 0);
            const damage = Math.max(1, baseDamage - updatedDefender.defense);
            
            updatedDefender.hp = Math.max(0, updatedDefender.hp - damage);

            addFloatingText(`-${damage}`, targetTeam, 'damage');
            addToLog(`${updatedDefender.name} takes ${damage} damage! Remaining HP: ${updatedDefender.hp}`);
            
            updateCreatureState(updatedDefender.id, { hp: updatedDefender.hp }, targetTeam);
            break;
        
        case 'defense':
            const defenseBoost = selectedAbility.defenseBoost || 0;
            updatedAttacker.defense += defenseBoost;
            addFloatingText(`+${defenseBoost} Def`, 'player', 'heal');
            addToLog(`${updatedAttacker.name}'s defense rose by ${defenseBoost}!`);
            break;

        case 'heal':
            const healAmount = selectedAbility.power || 0;
            const oldHp = updatedAttacker.hp;
            const newHp = Math.min(updatedAttacker.maxHp, updatedAttacker.hp + healAmount);
            addFloatingText(`+${newHp - oldHp}`, 'player', 'heal');
            addToLog(`${updatedAttacker.name} heals for ${newHp - oldHp} HP!`);
            updatedAttacker.hp = newHp;
            break;
        
        case 'buff':
        case 'debuff':
             addFloatingText(`No effect...`, 'opponent', 'info');
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
  }, [activePlayerCreature, activeOpponentCreature, selectedAbility, playerBattleTeam, opponentTeam, updateCreatureState, addFloatingText]);

  const checkBattleEnd = useCallback(() => {
    if (battleStatus !== 'in_progress') return;
    const playerTeamFainted = playerBattleTeam.length > 0 && playerBattleTeam.every(c => c.hp <= 0);
    const opponentTeamFainted = opponentTeam.length > 0 && opponentTeam.every(c => c.hp <= 0);

    if (playerTeamFainted) {
        addToLog("You have been defeated!");
        setBattleStatus('finished');
        setBattleOutcome('loss');
    } else if (opponentTeamFainted) {
        addToLog("You are victorious!");
        setBattleStatus('finished');
        setBattleOutcome('win');
    }
  }, [playerBattleTeam, opponentTeam, battleStatus]);

   useEffect(() => {
    if (battleOutcome === 'win') {
      onBattleWin(opponentTeam);
      setShowVictoryDialog(true);
    }
  }, [battleOutcome, opponentTeam, onBattleWin]);

  // Main game loop effect
  useEffect(() => {
    if (battleStatus !== 'in_progress') return;

    if (activePlayerCreature?.hp <= 0) {
        const nextPlayerCreature = playerBattleTeam.find(c => c.hp > 0);
        if (nextPlayerCreature) {
            addToLog(`${activePlayerCreature.name} has fainted!`);
            addFloatingText('Fainted!', 'player', 'info');
            if(isPlayerTurn) {
                setShowSwitchDialog(true);
            }
        }
    }
    
    if (activeOpponentCreature?.hp <= 0) {
        const nextOpponentCreature = opponentTeam.find(c => c.hp > 0);
        if (nextOpponentCreature) {
            addToLog(`${activeOpponentCreature.name} has fainted!`);
            addFloatingText('Fainted!', 'opponent', 'info');
            setActiveOpponentCreature(nextOpponentCreature);
            addToLog(`Opponent sends out ${nextOpponentCreature.name}!`);
        }
    }

    if (isPlayerTurn) {
      if (activePlayerCreature?.isSleeping) {
        addToLog(`${activePlayerCreature.name} is sleeping... It woke up!`);
        addFloatingText('Woke up!', 'player', 'info');
        const restoredEnergy = Math.min(activePlayerCreature.maxEnergy, activePlayerCreature.energy + (ENERGY_REGEN_PER_TURN * 2));
        updateCreatureState(activePlayerCreature.id, { isSleeping: false, energy: restoredEnergy }, 'player');
        setTimeout(() => setIsPlayerTurn(false), 1000);
        return;
      }
      if (activePlayerCreature) {
        const regeneratedEnergy = Math.min(activePlayerCreature.maxEnergy, activePlayerCreature.energy + ENERGY_REGEN_PER_TURN);
        if (regeneratedEnergy > activePlayerCreature.energy) {
          updateCreatureState(activePlayerCreature.id, { energy: regeneratedEnergy }, 'player');
        }
      }
    }

    if (!isPlayerTurn && battleStatus === 'in_progress' && activeOpponentCreature) {
        if (activeOpponentCreature.isSleeping) {
            addToLog(`${activeOpponentCreature.name} is asleep... It woke up!`);
            addFloatingText('Woke up!', 'opponent', 'info');
            const restoredEnergy = Math.min(activeOpponentCreature.maxEnergy, activeOpponentCreature.energy + (ENERGY_REGEN_PER_TURN * 2));
            updateCreatureState(activeOpponentCreature.id, { isSleeping: false, energy: restoredEnergy }, 'opponent');
            setTimeout(() => setIsPlayerTurn(true), 1500);
            return;
        }

        // Opponent energy regen
        const regeneratedEnergy = Math.min(activeOpponentCreature.maxEnergy, activeOpponentCreature.energy + ENERGY_REGEN_PER_TURN);
        if (regeneratedEnergy > activeOpponentCreature.energy) {
          updateCreatureState(activeOpponentCreature.id, { energy: regeneratedEnergy }, 'opponent');
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
                          let updatedDefender = { ...defender };
                          const baseDamage = attacker.attack + (ability.power || 0);
                          const damage = Math.max(1, baseDamage - updatedDefender.defense);
                          updatedDefender.hp = Math.max(0, updatedDefender.hp - damage);
                          addFloatingText(`-${damage}`, 'player', 'damage');
                          addToLog(`Your ${updatedDefender.name} takes ${damage} damage!`);
                          updateCreatureState(updatedDefender.id, { hp: updatedDefender.hp }, 'player');
                          break;
                      case 'defense':
                          const defenseBoost = ability.defenseBoost || 0;
                          updatedAttacker.defense += defenseBoost;
                          addFloatingText(`+${defenseBoost} Def`, 'opponent', 'heal');
                          addToLog(`Opponent's ${updatedAttacker.name}'s defense rose!`);
                          break;
                      case 'heal':
                          const oldHp = updatedAttacker.hp;
                          const newHp = Math.min(updatedAttacker.maxHp, updatedAttacker.hp + (ability.power || 0));
                          addFloatingText(`+${newHp - oldHp}`, 'opponent', 'heal');
                          addToLog(`Opponent's ${updatedAttacker.name} heals!`);
                          updatedAttacker.hp = newHp;
                          break;
                      default:
                          break;
                  }
                  
                  if (updatedAttacker.energy <= 0) {
                      updatedAttacker.isSleeping = true;
                      addFloatingText('Asleep!', 'opponent', 'info');
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
             addFloatingText('Asleep!', 'opponent', 'info');
             updateCreatureState(activeOpponentCreature.id, { isSleeping: true }, 'opponent');
             setTimeout(() => setIsPlayerTurn(true), 1500);
        }
      } else {
        setIsPlayerTurn(true);
      }
    }
  }, [isPlayerTurn, battleStatus, playerBattleTeam, opponentTeam, activePlayerCreature, activeOpponentCreature, updateCreatureState, addFloatingText]);

  useEffect(() => {
      checkBattleEnd();
  }, [playerBattleTeam, opponentTeam, checkBattleEnd]);


  const handleSwitchCreature = (creature: Creature) => {
    if (creature.id !== activePlayerCreature?.id && creature.hp > 0 && battleStatus === 'in_progress') {
        if (remainingSwitches <= 0) {
            toast({ variant: "destructive", title: "No switches left!", description: "You cannot switch creatures anymore in this battle." });
            return;
        }
        
        const creatureToSwitch = playerBattleTeam.find(c => c.id === creature.id);
        if(!creatureToSwitch) return;

        const newActiveCreature = { ...creatureToSwitch, energy: creatureToSwitch.maxEnergy, isSleeping: false };
        
        const newPlayerTeam = playerBattleTeam.map(c => c.id === creature.id ? { ...c, energy: c.maxEnergy, isSleeping: false } : c);
        setPlayerBattleTeam(newPlayerTeam);
        setActivePlayerCreature(newActiveCreature);

        addToLog(`Go, ${creature.name}!`);
        setShowSwitchDialog(false);
        setRemainingSwitches(prev => prev - 1);
        setIsPlayerTurn(false); // Switching costs a turn
    }
  }
  
  const canPlayerAct = useMemo(() => {
    return isPlayerTurn && battleStatus === 'in_progress' && activePlayerCreature && activePlayerCreature.hp > 0 && !activePlayerCreature.isSleeping;
  }, [isPlayerTurn, battleStatus, activePlayerCreature]);

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

  if (battleStatus === 'awaiting') {
    const opponent = allOpponentCreatures.find(c => c.id === storyChapter.opponentId);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Battle Ahead!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                {opponent && (
                    <div className='flex flex-col items-center gap-4'>
                        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border-2 border-primary/50 shadow-lg">
                             <Image
                                src={opponent.imageUrl}
                                alt={`Image of ${opponent.name}`}
                                layout="fill"
                                objectFit="cover"
                                data-ai-hint={opponent.aiHint}
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-primary">{opponent.name}</h3>
                        <p className="text-muted-foreground max-w-prose">{opponent.lore || 'A mysterious creature of unknown origin.'}</p>
                    </div>
                )}
                
                <div className="flex justify-center gap-4 pt-4">
                    <Button onClick={startBattle} size="lg">
                        <Swords className="mr-2 h-5 w-5" /> Start Battle
                    </Button>
                    <Button onClick={onSwitchToRoster} variant="outline" size="lg">
                       <Users className="mr-2 h-5 w-5" /> Change Team
                    </Button>
                </div>
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
  
  const getFloatingTextClass = (text: FloatingText) => {
    let classes = 'text-shadow-lg ';
    if(text.text === 'Fainted!') {
        classes += 'font-bold ';
    }
    switch (text.type) {
      case 'damage': return classes + 'text-red-500';
      case 'heal': return classes + 'text-green-400';
      case 'info':
      default:
        return classes + 'text-white';
    }
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex justify-between items-center">
              <span>Battle Arena</span>
              <div className='flex items-center gap-4'>
                  <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowSwitchDialog(true)}
                      disabled={!isPlayerTurn || battleStatus !== 'in_progress' || playerBattleTeam.filter(c => c.hp > 0).length <= 1 || remainingSwitches <= 0 || activePlayerCreature?.isSleeping}
                  >
                    <Repeat className="mr-2 h-4 w-4"/> Switch ({remainingSwitches} left)
                  </Button>
              </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-start">
              <div className="space-y-4 md:col-span-5 relative">
                  <h3 className="text-xl font-headline text-center text-green-400">Your Team</h3>
                   {floatingTexts.filter(t => t.team === 'player').map(t => (
                      <div key={t.id} className={`animate-float-up absolute top-1/2 left-1/2 -translate-x-1/2 z-10 text-4xl font-bold ${getFloatingTextClass(t)}`}>
                          {t.text}
                      </div>
                  ))}
                  {activePlayerCreature && 
                      <CreatureCard 
                          creature={activePlayerCreature} 
                          showCurrentDefense 
                          isActionable={canPlayerAct}
                          onAbilitySelect={handleAbilitySelect}
                      />
                  }
                  <div className="flex justify-center gap-2">
                      {playerBattleTeam.map(c => (
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
                   {battleOutcome === 'loss' && (
                      <div className="text-center p-4">
                          <p className="font-bold text-2xl mb-2">DEFEAT</p>
                          <Button onClick={handleEndBattleClick} className="mt-2">Continue Story</Button>
                      </div>
                  )}
              </div>

              <div className="space-y-4 md:col-span-5 relative">
                  <h3 className="text-xl font-headline text-center text-red-400">Opponent</h3>
                   {floatingTexts.filter(t => t.team === 'opponent').map(t => (
                      <div key={t.id} className={`animate-float-up absolute top-1/2 left-1/2 -translate-x-1/2 z-10 text-4xl font-bold ${getFloatingTextClass(t)}`}>
                          {t.text}
                      </div>
                  ))}
                  {activeOpponentCreature && <CreatureCard creature={activeOpponentCreature} showCurrentDefense />}
              </div>
          </div>
        </CardContent>
      </Card>
      
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
                  {playerBattleTeam.map(c => (
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
      
      <Dialog open={showVictoryDialog} onOpenChange={setShowVictoryDialog}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-3xl font-headline text-center text-primary">Victory!</DialogTitle>
                <DialogDescription className="text-center">
                    You have defeated the opponent and proven your strength.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button onClick={handleEndBattleClick} className="w-full">Continue Story</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

    