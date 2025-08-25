
export interface StoryChapter {
    character: string;
    dialogue: string;
    imageUrl?: string;
    isBattle: boolean;
    opponentId?: number; // ID of the creature to fight
}

export const story: StoryChapter[] = [
    {
        character: "Mysterious Elder",
        dialogue: "Welcome, young one. The world of Terraverse is in turmoil. The elemental creatures, once our guardians, are enraged and causing chaos. I sense a unique power within you.",
        imageUrl: "https://placehold.co/300x200.png",
        isBattle: false,
    },
    {
        character: "Mysterious Elder",
        dialogue: "You must embark on a journey to quell their rage. Your first task is to face a Stoneling whose rocky tantrums are shaking the very foundations of these plains. Show it a firm but gentle hand.",
        imageUrl: "https://placehold.co/300x200.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A furious Stoneling blocks your path!",
        isBattle: true,
        opponentId: 21, // ID of Stoneling from creatures.ts
    },
    {
        character: "Mysterious Elder",
        dialogue: "Well done. You see? You didn't destroy it, you calmed it. The Stoneling now trusts you. It will join your cause. This is the way of the Beast Tamer.",
        imageUrl: "https://placehold.co/300x200.png",
        isBattle: false,
    },
    {
        character: "Mysterious Elder",
        dialogue: "Your next challenge awaits by the coast. An Aqua-pup, whose sorrowful tides are flooding the shores, needs your help. Be wary of its speed and sharp bite.",
        imageUrl: "https://placehold.co/300x200.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A frenzied Aqua-pup surges from the waves!",
        isBattle: true,
        opponentId: 22, // ID of Aqua-pup
    },
    {
        character: "Mysterious Elder",
        dialogue: "Excellent. You've calmed the waters. The path ahead leads to the high peaks, where a territorial Fetheray whips up unnatural storms. Its mastery of the winds is formidable.",
        imageUrl: "https://placehold.co/300x200.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A screeching Fetheray dives from the storm clouds!",
        isBattle: true,
        opponentId: 23,
    },
    {
        character: "Mysterious Elder",
        dialogue: "The skies clear, thanks to you. But a greater challenge looms. The great Terralord, king of the mountains, has awoken. Its power is immense. You must prove your worth.",
        imageUrl: "https://placehold.co/300x200.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The ground trembles as the mighty Terralord appears!",
        isBattle: true,
        opponentId: 101, // ID of the boss Terralord
    },
    {
        character: "Mysterious Elder",
        dialogue: "Incredible... you have truly proven yourself as a Master Beast Tamer. The land is safe, for now. Thank you.",
        imageUrl: "https://placehold.co/300x200.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "You have completed your journey. You can continue to train your creatures in new battles.",
        isBattle: false, // Or loop back to a repeatable battle
    }
];
