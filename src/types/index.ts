export type CreatureType = "Terra" | "Aqua" | "Aero" | "Ignis" | "Lux" | "Umbra";

export type AbilityType = 'attack' | 'defense' | 'buff' | 'debuff' | 'heal';

export interface Ability {
  name: string;
  type: AbilityType;
  power?: number;
  defenseBoost?: number;
  effect?: string;
  description: string;
}

export interface Creature {
  id: number;
  name: string;
  type: CreatureType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  imageUrl: string;
  aiHint: string;
  abilities: Ability[];
}

export interface GameState {
  playerCreatures: Creature[];
  opponentCreatures: Creature[];
}
