
'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import type { GameState, Creature } from '@/types';
import { initialCreatures, opponentCreatures } from '@/lib/creatures';
import { useToast } from './use-toast';
import { story } from '@/lib/story';

const GAME_SAVE_KEY = 'terraverseSaga_gameState';

// Function to create a deep copy and initialize runtime properties
const initializeCreatures = (creatures: Creature[]): Creature[] => {
    return JSON.parse(JSON.stringify(creatures)).map((c: Creature) => ({
        ...c,
        hp: c.maxHp,
        energy: c.maxEnergy,
        isSleeping: false,
        defense: c.defense, // Ensure defense is initialized
    }));
};


const initialGameState: GameState = {
  playerCreatures: initializeCreatures(initialCreatures),
  opponentCreatures: initializeCreatures(opponentCreatures),
  storyProgress: 0,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(GAME_SAVE_KEY);
      if (savedGame) {
        const loadedState = JSON.parse(savedGame);
        // Ensure creatures have their runtime stats initialized
        loadedState.playerCreatures = initializeCreatures(loadedState.playerCreatures);
        loadedState.opponentCreatures = initializeCreatures(loadedState.opponentCreatures || opponentCreatures);
        if (loadedState.storyProgress === undefined) {
          loadedState.storyProgress = 0;
        }
        setGameState(loadedState);
      } else {
        setGameState(initialGameState);
      }
    } catch (error) {
      console.error("Failed to load game state from localStorage", error);
      setGameState(initialGameState);
    }
  }, []);

  const saveGame = useCallback(() => {
    if (gameState) {
      try {
        const stateToSave = {
            ...gameState,
            // Don't save the full opponent list, just the template data
            opponentCreatures: opponentCreatures, 
        };
        localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(stateToSave));
        toast({ title: "Game Saved!", description: "Your progress has been saved locally." });
      } catch (error) {
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save game state." });
        console.error("Failed to save game state to localStorage", error);
      }
    }
  }, [gameState, toast]);

  const loadGame = useCallback(() => {
    try {
      const savedGame = localStorage.getItem(GAME_SAVE_KEY);
      if (savedGame) {
        const loadedState = JSON.parse(savedGame);
        // Ensure creatures have their runtime stats initialized correctly
        loadedState.playerCreatures = initializeCreatures(loadedState.playerCreatures);
        // Always load the canonical opponent list and initialize it
        loadedState.opponentCreatures = initializeCreatures(opponentCreatures);
        if (loadedState.storyProgress === undefined) {
          loadedState.storyProgress = 0;
        }
        setGameState(loadedState);
        toast({ title: "Game Loaded!", description: "Your saved progress has been loaded." });
      } else {
        toast({ title: "No Save Data", description: "No saved game found. Starting fresh." });
        setGameState(initialGameState);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Load Failed", description: "Could not load saved data." });
      console.error("Failed to load game state from localStorage", error);
    }
  }, [toast]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(GAME_SAVE_KEY);
    const freshState: GameState = {
        playerCreatures: initializeCreatures(initialCreatures),
        opponentCreatures: initializeCreatures(opponentCreatures),
        storyProgress: 0,
    };
    setGameState(freshState);
    toast({ title: "Game Reset!", description: "Your game has been reset to its initial state." });
  }, [toast]);

  const unlockCreature = useCallback((unlockedCreatures: Creature[]) => {
    setGameState(prevState => {
        if (!prevState) return null;
        
        const newCreatures = unlockedCreatures.filter(unlocked => 
            !prevState.playerCreatures.some(existing => existing.id === unlocked.id)
        );

        if (newCreatures.length > 0) {
            toast({
                title: "Creature Unlocked!",
                description: `${newCreatures.map(c => c.name).join(', ')} have been added to your roster.`
            });
            return {
                ...prevState,
                playerCreatures: [...prevState.playerCreatures, ...initializeCreatures(newCreatures)]
            };
        }
        return prevState;
    });
  }, [toast]);

  const advanceStory = useCallback(() => {
    setGameState(prevState => {
      if (!prevState) return null;
      const nextProgress = prevState.storyProgress + 1;
      if (nextProgress < story.length) {
        console.log(`Advancing story to chapter ${nextProgress}`);
        return { ...prevState, storyProgress: nextProgress };
      }
      toast({ title: "To be continued...", description: "You have completed the current story." });
      return prevState; // Or handle game completion
    });
  }, [toast]);

  return { gameState, saveGame, loadGame, resetGame, setGameState: setGameState as Dispatch<SetStateAction<GameState>>, unlockCreature, advanceStory };
}
