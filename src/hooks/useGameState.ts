'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import type { GameState, Creature } from '@/types';
import { initialCreatures, opponentCreatures as initialOpponentCreatures } from '@/lib/creatures';
import { useToast } from './use-toast';

const GAME_SAVE_KEY = 'terraverseSaga_gameState';

const initialGameState: GameState = {
  playerCreatures: JSON.parse(JSON.stringify(initialCreatures)), // Deep copy to allow for modification
  opponentCreatures: JSON.parse(JSON.stringify(initialOpponentCreatures)),
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(GAME_SAVE_KEY);
      if (savedGame) {
        setGameState(JSON.parse(savedGame));
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
        localStorage.setItem(GAME_SAVE_KEY, JSON.stringify(gameState));
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
        setGameState(JSON.parse(savedGame));
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
    // Create deep copies to prevent mutation of the original constant objects
    const freshState: GameState = {
        playerCreatures: JSON.parse(JSON.stringify(initialCreatures)),
        opponentCreatures: JSON.parse(JSON.stringify(initialOpponentCreatures)),
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
                title: "Creatures Unlocked!",
                description: `${newCreatures.map(c => c.name).join(', ')} have been added to your roster.`
            });
            return {
                ...prevState,
                playerCreatures: [...prevState.playerCreatures, ...newCreatures]
            }
        }
        return prevState;
    });
  }, [toast, setGameState]);

  return { gameState, saveGame, loadGame, resetGame, setGameState: setGameState as Dispatch<SetStateAction<GameState>>, unlockCreature };
}
