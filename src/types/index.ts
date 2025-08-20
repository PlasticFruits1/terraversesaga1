export type CreatureType = "Terra" | "Aqua" | "Aero" | "Ignis" | "Lux" | "Umbra";

export interface Creature {
  id: number;
  name: string;
  type: CreatureType;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  imageUrl: string;
  aiHint: string;
}

export interface GameState {
  playerCreatures: Creature[];
  opponentCreatures: Creature[];
}
