
'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction, useRef } from 'react';
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


const getInitialState = (): GameState => {
    const playerCreatures = initializeCreatures(initialCreatures);
    return {
        playerCreatures,
        playerTeam: playerCreatures.slice(0, 3), // Start with the first 3
        opponentCreatures: initializeCreatures(opponentCreatures),
        storyProgress: 0,
    };
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { toast } = useToast();
  const previousCreatureCount = useRef(0);

  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(GAME_SAVE_KEY);
      if (savedGame) {
        const loadedState = JSON.parse(savedGame);
        // Ensure creatures have their runtime stats initialized
        loadedState.playerCreatures = initializeCreatures(loadedState.playerCreatures);
        // ALWAYS load the canonical opponent list and initialize it
        loadedState.opponentCreatures = initializeCreatures(opponentCreatures);
        if (loadedState.storyProgress === undefined) {
          loadedState.storyProgress = 0;
        }
         // Handle backward compatibility for saves without a playerTeam
        if (!loadedState.playerTeam || loadedState.playerTeam.length === 0) {
            loadedState.playerTeam = loadedState.playerCreatures.slice(0, 3);
        } else {
            // Ensure team is also initialized properly
            loadedState.playerTeam = initializeCreatures(loadedState.playerTeam);
        }

        previousCreatureCount.current = loadedState.playerCreatures.length;
        setGameState(loadedState);
      } else {
        const initialState = getInitialState();
        previousCreatureCount.current = initialState.playerCreatures.length;
        setGameState(initialState);
      }
    } catch (error) {
      console.error("Failed to load game state from localStorage", error);
      setGameState(getInitialState());
    }
  }, []);

  // This effect handles showing the toast when a creature is unlocked.
  // It runs after the state has been updated, avoiding the "setState in render" error.
  useEffect(() => {
    if (gameState && gameState.playerCreatures.length > previousCreatureCount.current) {
        const newCount = gameState.playerCreatures.length - previousCreatureCount.current;
        const newCreatures = gameState.playerCreatures.slice(-newCount);
        toast({
            title: "Creature Unlocked!",
            description: `${newCreatures.map(c => c.name).join(', ')} have been added to your roster.`
        });
    }
    if (gameState) {
      previousCreatureCount.current = gameState.playerCreatures.length;
    }
  }, [gameState?.playerCreatures, toast]);


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
         // Handle backward compatibility for saves without a playerTeam
        if (!loadedState.playerTeam || loadedState.playerTeam.length === 0) {
            loadedState.playerTeam = loadedState.playerCreatures.slice(0, 3);
        } else {
             // Ensure team is also initialized properly
            loadedState.playerTeam = initializeCreatures(loadedState.playerTeam);
        }
        // Always load the canonical opponent list and initialize it
        loadedState.opponentCreatures = initializeCreatures(opponentCreatures);
        if (loadedState.storyProgress === undefined) {
          loadedState.storyProgress = 0;
        }
        setGameState(loadedState);
        toast({ title: "Game Loaded!", description: "Your saved progress has been loaded." });
      } else {
        toast({ title: "No Save Data", description: "No saved game found. Starting fresh." });
        setGameState(getInitialState());
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Load Failed", description: "Could not load saved data." });
      console.error("Failed to load game state from localStorage", error);
    }
  }, [toast]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(GAME_SAVE_KEY);
    setGameState(getInitialState());
    toast({ title: "Game Reset!", description: "Your game has been reset to its initial state." });
  }, [toast]);

  const unlockCreature = useCallback((unlockedCreatures: Creature[]) => {
    setGameState(prevState => {
        if (!prevState) return null;
        
        const newCreatures = unlockedCreatures.filter(unlocked => 
            !prevState.playerCreatures.some(existing => existing.id === unlocked.id)
        );

        if (newCreatures.length > 0) {
             const updatedCreatures = [...prevState.playerCreatures, ...initializeCreatures(newCreatures)];
            // If the team isn't full, add the new creature to it
            const updatedTeam = [...prevState.playerTeam];
            if (updatedTeam.length < 3) {
                const creaturesToAdd = initializeCreatures(newCreatures).slice(0, 3 - updatedTeam.length);
                updatedTeam.push(...creaturesToAdd);
            }
            return {
                ...prevState,
                playerCreatures: updatedCreatures,
                playerTeam: updatedTeam,
            };
        }
        return prevState;
    });
  }, []);

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
  
  const setPlayerTeam = useCallback((team: Creature[]) => {
    if (team.length > 3) {
        toast({ variant: "destructive", title: "Invalid Team", description: "Team can have a maximum of 3 creatures." });
        return;
    }
     setGameState(prevState => {
        if (!prevState) return null;
        return {
            ...prevState,
            playerTeam: team
        }
     });
     toast({ title: "Team Updated", description: "Your battle team has been set." });
  }, [toast]);


  return { gameState, saveGame, loadGame, resetGame, setGameState: setGameState as Dispatch<SetStateAction<GameState>>, unlockCreature, advanceStory, setPlayerTeam };
}
