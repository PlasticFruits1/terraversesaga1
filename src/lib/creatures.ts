
import type { Creature } from '@/types';

export const initialCreatures: Creature[] = [
  {
    id: 5,
    name: "Mossling",
    type: "Terra",
    hp: 60,
    maxHp: 60,
    attack: 40,
    defense: 65,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/wDNvtFI.png",
    aiHint: "mossy rock creature",
    abilities: [
      { name: "Vine Whip", type: "attack", power: 25, description: "Lashes out with a thorny vine.", energyCost: 15 },
      { name: "Harden", type: "defense", defenseBoost: 15, description: "Tenses its body to raise defense.", energyCost: 20 },
      { name: "Absorb", type: "heal", power: 15, description: "Drains a small amount of HP from the foe.", energyCost: 25 }
    ]
  },
  {
    id: 6,
    name: "Spark-fin",
    type: "Aqua",
    hp: 45,
    maxHp: 45,
    attack: 50,
    defense: 40,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/5lsrqGC.png",
    aiHint: "electric fish",
    abilities: [
      { name: "Water Gun", type: "attack", power: 22, description: "Squirts a jet of water.", energyCost: 15 },
      { name: "Charge", type: "buff", description: "Gathers electricity to boost the next attack.", energyCost: 20 },
      { name: "Splash", type: "debuff", description: "A useless splash that distracts the opponent.", energyCost: 10 }
    ]
  },
  {
    id: 7,
    name: "Aero-ling",
    type: "Aero",
    hp: 50,
    maxHp: 50,
    attack: 55,
    defense: 35,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/rnfuT9c.png",
    aiHint: "small wind spirit",
    abilities: [
      { name: "Peck", type: "attack", power: 28, description: "A quick, sharp peck.", energyCost: 15 },
      { name: "Screech", type: "debuff", description: "A loud screech that lowers opponent's defense.", energyCost: 20 },
      { name: "Quick Attack", type: "attack", power: 20, description: "A speedy charge that always strikes first.", energyCost: 15 }
    ]
  }
];

const regularOpponents: Creature[] = [
  {
    id: 21,
    name: "Stoneling",
    type: "Terra",
    hp: 55,
    maxHp: 55,
    attack: 45,
    defense: 60,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/JhdPtwJ.png",
    aiHint: "rock golem",
    abilities: [
      { name: "Rock Throw", type: "attack", power: 20, description: "Hurls a small rock.", energyCost: 15 },
      { name: "Stone Skin", type: "defense", defenseBoost: 10, description: "Hardens skin, increasing defense.", energyCost: 20 },
      { name: "Tremor", type: "attack", power: 30, description: "A lesser ground-shaking attack.", energyCost: 25 }
    ]
  },
  {
    id: 22,
    name: "Aqua-pup",
    type: "Aqua",
    hp: 45,
    maxHp: 45,
    attack: 55,
    defense: 40,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/R2bg0hY.png",
    aiHint: "water wolf",
    abilities: [
        { name: "Bite", type: "attack", power: 22, description: "A sharp, quick bite.", energyCost: 15 },
        { name: "Aqua Jet", type: "attack", power: 18, description: "Slam into the foe with high speed.", energyCost: 20 },
        { name: "Soothing Mist", type: 'heal', power: 15, description: 'Heals some HP.', energyCost: 30 }
    ]
  },
  {
    id: 23,
    name: "Fetheray",
    type: "Aero",
    hp: 40,
    maxHp: 40,
    attack: 50,
    defense: 35,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/UNuMqjq.png",
    aiHint: "airborne manta",
    abilities: [
        { name: "Gust", type: "attack", power: 25, description: "A quick blast of wind.", energyCost: 15 },
        { name: "Tailwind", type: "buff", description: "Raises speed for a few turns.", energyCost: 20 },
        { name: "Air Cutter", type: "attack", power: 32, description: "A sharp blade of wind.", energyCost: 25 }
    ]
  },
    {
    id: 24,
    name: "Ember-kit",
    type: "Ignis",
    hp: 50,
    maxHp: 50,
    attack: 65,
    defense: 40,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/Cf0ftUv.png",
    aiHint: "fire fox",
    abilities: [
        { name: "Scratch", type: "attack", power: 20, description: "A basic scratch attack.", energyCost: 10 },
        { name: "Flame Wheel", type: "attack", power: 35, description: "A fiery spinning tackle.", energyCost: 25 },
        { name: "Will-O-Wisp", type: "debuff", description: "Lowers the opponent's attack.", energyCost: 20 }
    ]
  },
  {
    id: 25,
    name: "Glimmerwisp",
    type: "Lux",
    hp: 60,
    maxHp: 60,
    attack: 30,
    defense: 50,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/kvQo9oc.png",
    aiHint: "light spirit",
    abilities: [
        { name: "Flash", type: "debuff", description: "Lowers opponent's accuracy.", energyCost: 15 },
        { name: "Light Screen", type: "defense", defenseBoost: 25, description: "A screen of light that boosts defense.", energyCost: 30 },
        { name: "Heal Pulse", type: "heal", power: 25, description: "Heals for a small amount.", energyCost: 30 }
    ]
  },
  {
    id: 26,
    name: "Shade-crawler",
    type: "Umbra",
    hp: 48,
    maxHp: 48,
    attack: 58,
    defense: 48,
    energy: 100,
    maxEnergy: 100,
    imageUrl: "https://i.imgur.com/MVcAOcy.png",
    aiHint: "shadow spider",
    abilities: [
        { name: "Poison Sting", type: "attack", power: 25, description: "A venomous jab.", energyCost: 20 },
        { name: "Shadow Sneak", type: "attack", power: 30, description: "Attacks from the shadows.", energyCost: 25 },
        { name: "Fade", type: "defense", defenseBoost: 18, description: "Fades into the darkness, raising defense.", energyCost: 20 }
    ]
  },
];

const bossCreatures: Creature[] = [
    {
    id: 101,
    name: "Terralord",
    type: "Terra",
    hp: 150,
    maxHp: 150,
    attack: 75,
    defense: 90,
    energy: 120,
    maxEnergy: 120,
    imageUrl: "https://i.imgur.com/eDm0sH8.png",
    aiHint: "earth titan",
    abilities: [
        { name: "Tackle", type: "attack", power: 40, description: "A basic tackle.", energyCost: 15 },
        { name: "Fortify", type: "defense", defenseBoost: 25, description: "Greatly raises defense.", energyCost: 25 },
        { name: "Earthquake", type: "attack", power: 60, description: "A devastating ground-shaking attack.", energyCost: 40 }
    ]
  },
  {
    id: 102,
    name: "Abyssal Leviathan",
    type: "Aqua",
    hp: 140,
    maxHp: 140,
    attack: 80,
    defense: 70,
    energy: 120,
    maxEnergy: 120,
    imageUrl: "https://i.imgur.com/1hWZRTh.png",
    aiHint: "giant sea-dragon",
    abilities: [
        { name: "Tidal Wave", type: "attack", power: 45, description: "A huge wave crashes down.", energyCost: 25 },
        { name: "Regenerate", type: "heal", power: 30, description: "Recovers a good amount of HP.", energyCost: 30 },
        { name: "Dragon Pulse", type: "attack", power: 55, description: "A powerful draconic blast.", energyCost: 35 }
    ]
  },
  {
    id: 103,
    name: "Thunder-roc",
    type: "Aero",
    hp: 130,
    maxHp: 130,
    attack: 85,
    defense: 65,
    energy: 120,
    maxEnergy: 120,
    imageUrl: "https://i.imgur.com/yPVjvwQ.png",
    aiHint: "giant thunder-bird",
    abilities: [
        { name: "Drill Peck", type: "attack", power: 50, description: "A powerful, spinning beak attack.", energyCost: 25 },
        { name: "Thunder", type: "attack", power: 65, description: "A massive bolt of lightning.", energyCost: 40 },
        { name: "Roost", type: "heal", power: 25, description: "Recovers some HP.", energyCost: 30 }
    ]
  },
  {
    id: 104,
    name: "Inferno Cerberus",
    type: "Ignis",
    hp: 135,
    maxHp: 135,
    attack: 95,
    defense: 60,
    energy: 120,
    maxEnergy: 120,
    imageUrl: "https://i.imgur.com/vTn5Xqb.png",
    aiHint: "three-headed fire-hound",
    abilities: [
        { name: "Scorching Bite", type: "attack", power: 50, description: "A vicious, fiery bite.", energyCost: 25 },
        { name: "Howl", type: "buff", description: "Raises its own attack stat.", energyCost: 15 },
        { name: "Hellfire", type: "attack", power: 70, description: "Engulfs the foe in black flames.", energyCost: 45 }
    ]
  },
];

export const opponentCreatures: Creature[] = [
  ...regularOpponents,
  ...bossCreatures,
];
