
'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction, useRef } from 'react';
import type { GameState, Creature, StoryAct } from '@/types';
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
        currentAct: 0,
        currentChapterIndex: 0,
    };
};

const migrateSaveData = (loadedState: any): GameState => {
    // If the save is already in the new format, no migration needed
    if (loadedState.currentAct !== undefined && loadedState.currentChapterIndex !== undefined) {
      // Still, always load canonical opponents
      loadedState.opponentCreatures = initializeCreatures(opponentCreatures);
      return loadedState;
    }
  
    // Migration logic for old save format (using storyProgress)
    let totalChaptersElapsed = loadedState.storyProgress || 0;
    let currentAct = 0;
    let currentChapterIndex = 0;

    for (const act of story) {
        if (totalChaptersElapsed >= act.chapters.length) {
            totalChaptersElapsed -= act.chapters.length;
            currentAct++;
        } else {
            currentChapterIndex = totalChaptersElapsed;
            break;
        }
    }
    
    // If progress exceeds all defined chapters, cap it at the end.
    if(currentAct >= story.length) {
        currentAct = story.length - 1;
        currentChapterIndex = story[currentAct].chapters.length -1;
    }

    return {
        ...loadedState,
        currentAct,
        currentChapterIndex,
        storyProgress: undefined, // Remove old property
        opponentCreatures: initializeCreatures(opponentCreatures),
    };
}


export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const { toast } = useToast();
  const previousCreatureCount = useRef(0);

  useEffect(() => {
    try {
      const savedGame = localStorage.getItem(GAME_SAVE_KEY);
      if (savedGame) {
        let loadedState = JSON.parse(savedGame);
        
        // Migrate old save data if necessary
        loadedState = migrateSaveData(loadedState);

        // Ensure creatures have their runtime stats initialized
        loadedState.playerCreatures = initializeCreatures(loadedState.playerCreatures);

        if (!loadedState.playerTeam || loadedState.playerTeam.length === 0) {
            loadedState.playerTeam = loadedState.playerCreatures.slice(0, 3);
        } else {
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
            opponentCreatures: opponentCreatures, 
            storyProgress: undefined, // No longer used
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
        let loadedState = JSON.parse(savedGame);

        // Migrate if necessary
        loadedState = migrateSaveData(loadedState);

        loadedState.playerCreatures = initializeCreatures(loadedState.playerCreatures);
        if (!loadedState.playerTeam || loadedState.playerTeam.length === 0) {
            loadedState.playerTeam = loadedState.playerCreatures.slice(0, 3);
        } else {
            loadedState.playerTeam = initializeCreatures(loadedState.playerTeam);
        }
        
        setGameState(loadedState);
        toast({ title: "Game Loaded!", description: "Your saved progress has been loaded." });
      } else {
        toast({ title: "No Save Data", description: "No saved game found. Starting fresh." });
        setGameState(getInitialState());
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Load Failed", description: "Could not load saved data." });
      console.error("Failed to load game state to localStorage", error);
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
        
        const newCreaturesToAdd = unlockedCreatures
            .filter(unlocked => !prevState.playerCreatures.some(existing => existing.id === unlocked.id))
            .map(unlocked => {
                const template = opponentCreatures.find(c => c.id === unlocked.id);
                return template ? { ...template } : unlocked;
            });


        if (newCreaturesToAdd.length > 0) {
             const initializedNewCreatures = initializeCreatures(newCreaturesToAdd);
             const updatedCreatures = [...prevState.playerCreatures, ...initializedNewCreatures];

            const updatedTeam = [...prevState.playerTeam];
            if (updatedTeam.length < 3) {
                const creaturesToAddToTeam = initializedNewCreatures.slice(0, 3 - updatedTeam.length);
                updatedTeam.push(...creaturesToAddToTeam);
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
      
      const currentActData = story[prevState.currentAct];
      if (!currentActData) {
        toast({ title: "The End", description: "You have completed all available content." });
        return prevState;
      }
      
      const nextChapterIndex = prevState.currentChapterIndex + 1;

      // If there are more chapters in the current act
      if (nextChapterIndex < currentActData.chapters.length) {
          console.log(`Advancing to Act ${prevState.currentAct + 1}, Chapter ${nextChapterIndex + 1}`);
          return { ...prevState, currentChapterIndex: nextChapterIndex };
      }
      
      // Move to the next act
      const nextActIndex = prevState.currentAct + 1;
      if (nextActIndex < story.length) {
          console.log(`Advancing to Act ${nextActIndex + 1}, Chapter 1`);
          toast({ title: `Act ${nextActIndex + 1}: ${story[nextActIndex].title}`, description: "A new chapter of your journey begins." });
          return { ...prevState, currentAct: nextActIndex, currentChapterIndex: 0 };
      }

      // Story complete
      toast({ title: "To be continued...", description: "You have completed the current story." });
      return prevState;
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
