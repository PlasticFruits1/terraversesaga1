export type CreatureType = "Terra" | "Aqua" | "Aero" | "Ignis" | "Lux" | "Umbra";

export type AbilityType = 'attack' | 'defense' | 'buff' | 'debuff' | 'heal';

export interface Ability {
  name: string;
  type: AbilityType;
  power?: number;
  defenseBoost?: number;
  effect?: string;
  description: string;
  energyCost: number;
}

export interface Creature {
  id: number;
  name: string;
  type: CreatureType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  energy: number;
  maxEnergy: number;
  imageUrl: string;
  aiHint: string;
  abilities: Ability[];
  isSleeping?: boolean;
}

export interface GameState {
  playerCreatures: Creature[];
  playerTeam: Creature[];
  opponentCreatures: Creature[];
  storyProgress: number;
}
