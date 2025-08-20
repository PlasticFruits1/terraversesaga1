import type { Creature } from '@/types';

export const initialCreatures: Creature[] = [
  {
    id: 1,
    name: "Stoneling",
    type: "Terra",
    hp: 55,
    maxHp: 55,
    attack: 45,
    defense: 60,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "rock golem",
    abilities: [
      { name: "Rock Throw", type: "attack", power: 20, description: "Hurls a small rock.", energyCost: 15 },
      { name: "Stone Skin", type: "defense", defenseBoost: 10, description: "Hardens skin, increasing defense.", energyCost: 20 },
      { name: "Tremor", type: "attack", power: 30, description: "A lesser ground-shaking attack.", energyCost: 25 }
    ]
  },
  {
    id: 2,
    name: "Aqua-pup",
    type: "Aqua",
    hp: 45,
    maxHp: 45,
    attack: 55,
    defense: 40,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "water wolf",
    abilities: [
        { name: "Bite", type: "attack", power: 22, description: "A sharp, quick bite.", energyCost: 15 },
        { name: "Aqua Jet", type: "attack", power: 18, description: "Slam into the foe with high speed.", energyCost: 20 },
        { name: "Soothing Mist", type: 'heal', power: 15, description: 'Heals some HP.', energyCost: 30 }
    ]
  },
  {
    id: 3,
    name: "Fetheray",
    type: "Aero",
    hp: 40,
    maxHp: 40,
    attack: 50,
    defense: 35,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "airborne manta",
    abilities: [
        { name: "Gust", type: "attack", power: 25, description: "A quick blast of wind.", energyCost: 15 },
        { name: "Tailwind", type: "buff", description: "Raises speed for a few turns.", energyCost: 20 },
        { name: "Air Cutter", type: "attack", power: 32, description: "A sharp blade of wind.", energyCost: 25 }
    ]
  },
];

export const opponentCreatures: Creature[] = [
    {
    id: 101,
    name: "Cragbeast",
    type: "Terra",
    hp: 70,
    maxHp: 70,
    attack: 55,
    defense: 70,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "mountain monster",
    abilities: [
        { name: "Tackle", type: "attack", power: 25, description: "A basic tackle.", energyCost: 15 },
        { name: "Harden", type: "defense", defenseBoost: 15, description: "Tenses muscles to raise defense.", energyCost: 20 },
        { name: "Rock Slide", type: "attack", power: 40, description: "Large boulders are hurled at the foe.", energyCost: 35 }
    ]
  },
  {
    id: 102,
    name: "Sea Serpent",
    type: "Aqua",
    hp: 65,
    maxHp: 65,
    attack: 60,
    defense: 55,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "ocean dragon",
    abilities: [
        { name: "Water Gun", type: "attack", power: 30, description: "Squirts water to attack.", energyCost: 20 },
        { name: "Dragon Dance", type: "buff", description: "Boosts its own Attack and Speed.", energyCost: 25 },
        { name: "Aqua Tail", type: "attack", power: 38, description: "Swings its tail like a vicious wave.", energyCost: 30 }
    ]
  },
  {
    id: 103,
    name: "Stormwing",
    type: "Aero",
    hp: 60,
    maxHp: 60,
    attack: 65,
    defense: 50,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "thunder bird",
    abilities: [
        { name: "Peck", type: "attack", power: 28, description: "Jabs the foe with its beak.", energyCost: 15 },
        { name: "Thunder Shock", type: "attack", power: 32, description: "An electric shock.", energyCost: 25 },
        { name: "Roost", type: "heal", power: 20, description: "Recovers some HP.", energyCost: 30 }
    ]
  },
  {
    id: 104,
    name: "Pyre-hound",
    type: "Ignis",
    hp: 62,
    maxHp: 62,
    attack: 75,
    defense: 50,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "hell hound",
    abilities: [
        { name: "Ember", type: "attack", power: 30, description: "A weak fire attack that may burn.", energyCost: 20 },
        { name: "Howl", type: "buff", description: "Raises its own attack stat.", energyCost: 15 },
        { name: "Fire Fang", type: "attack", power: 40, description: "A fiery bite that may cause a burn.", energyCost: 30 }
    ]
  },
    {
    id: 4,
    name: "Ember-kit",
    type: "Ignis",
    hp: 50,
    maxHp: 50,
    attack: 65,
    defense: 40,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "fire fox",
    abilities: [
        { name: "Scratch", type: "attack", power: 20, description: "A basic scratch attack.", energyCost: 10 },
        { name: "Flame Wheel", type: "attack", power: 35, description: "A fiery spinning tackle.", energyCost: 25 },
        { name: "Will-O-Wisp", type: "debuff", description: "Lowers the opponent's attack.", energyCost: 20 }
    ]
  },
  {
    id: 5,
    name: "Glimmerwisp",
    type: "Lux",
    hp: 60,
    maxHp: 60,
    attack: 30,
    defense: 50,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "light spirit",
    abilities: [
        { name: "Flash", type: "debuff", description: "Lowers opponent's accuracy.", energyCost: 15 },
        { name: "Light Screen", type: "defense", defenseBoost: 25, description: "A screen of light that boosts defense.", energyCost: 30 },
        { name: "Heal Pulse", type: "heal", power: 25, description: "Heals for a small amount.", energyCost: 30 }
    ]
  },
  {
    id: 6,
    name: "Shade-crawler",
    type: "Umbra",
    hp: 48,
    maxHp: 48,
    attack: 58,
    defense: 48,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://placehold.co/300x200.png",
    aiHint: "shadow spider",
    abilities: [
        { name: "Poison Sting", type: "attack", power: 25, description: "A venomous jab.", energyCost: 20 },
        { name: "Shadow Sneak", type: "attack", power: 30, description: "Attacks from the shadows.", energyCost: 25 },
        { name: "Fade", type: "defense", defenseBoost: 18, description: "Fades into the darkness, raising defense.", energyCost: 20 }
    ]
  },
];
