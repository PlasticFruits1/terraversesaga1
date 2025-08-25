
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
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Mysterious Elder",
        dialogue: "You must embark on a journey to quell their rage. Your first task is to face a Stoneling whose rocky tantrums are shaking the very foundations of these plains. Show it a firm but gentle hand.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
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
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Mysterious Elder",
        dialogue: "Your next challenge awaits by the coast. An Aqua-pup, whose sorrowful tides are flooding the shores, needs your help. Be wary of its speed and sharp bite.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
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
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
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
        dialogue: "The skies clear, but now a scorching heat emanates from the nearby woods. An Ember-kit is running wild, setting small fires with its every step. You must cool its temper.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "An agitated Ember-kit leaps from the bushes!",
        isBattle: true,
        opponentId: 24,
    },
    {
        character: "Mysterious Elder",
        dialogue: "You have a gift for this. The creatures are drawn to your strength and compassion. But not all creatures are so easily swayed. In the shimmering grove ahead, a Glimmerwisp is distorting the very light.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A blinding Glimmerwisp materializes before you!",
        isBattle: true,
        opponentId: 25,
    },
    {
        character: "Mysterious Elder",
        dialogue: "The light bends to your will. Now, you must face the darkness. A Shade-crawler lurks in the nearby caves, its shadowy presence upsetting the natural balance.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A sinister Shade-crawler emerges from the gloom!",
        isBattle: true,
        opponentId: 26,
    },
    {
        character: "Mysterious Elder",
        dialogue: "You've faced the basic elements. But now, you must prove your mastery. The great Terralord, king of the mountains, has awoken. Its power is immense. You must prove your worth.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
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
        dialogue: "The earth now respects your strength. But the seas rage on. The Abyssal Leviathan has been stirred from its slumber. It is a true test of your control over water.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A colossal Abyssal Leviathan rises from the deep!",
        isBattle: true,
        opponentId: 102,
    },
    {
        character: "Mysterious Elder",
        dialogue: "The tides are calm once more. Now, look to the skies. The Thunder-roc, a being of pure storm, circles the highest peak. Its cries are thunder, its wings the hurricane.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The Thunder-roc descends with a deafening roar!",
        isBattle: true,
        opponentId: 103,
    },
    {
        character: "Mysterious Elder",
        dialogue: "The storm has passed. Only one trial remains. The Inferno Cerberus, guardian of the volcanic core, is the embodiment of raw, untamed fire. You must face the heat.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The three-headed Inferno Cerberus erupts from the volcano!",
        isBattle: true,
        opponentId: 104,
    },
    {
        character: "Mysterious Elder",
        dialogue: "Incredible... you have truly proven yourself as a Master Beast Tamer. The land is safe, for now. Thank you.",
        imageUrl: "https://storage.googleapis.com/maker-studio-project-files-prod/ai-art/1721234333671",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "Your journey continues, tamer. More challenges await in the wilds.",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Stoneling appears!",
        isBattle: true,
        opponentId: 21,
    },
    {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Aqua-pup appears!",
        isBattle: true,
        opponentId: 22,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Fetheray appears!",
        isBattle: true,
        opponentId: 23,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Ember-kit appears!",
        isBattle: true,
        opponentId: 24,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Glimmerwisp appears!",
        isBattle: true,
        opponentId: 25,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Shade-crawler appears!",
        isBattle: true,
        opponentId: 26,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Stoneling appears!",
        isBattle: true,
        opponentId: 21,
    },
    {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Aqua-pup appears!",
        isBattle: true,
        opponentId: 22,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Fetheray appears!",
        isBattle: true,
        opponentId: 23,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Ember-kit appears!",
        isBattle: true,
        opponentId: 24,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Glimmerwisp appears!",
        isBattle: true,
        opponentId: 25,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Shade-crawler appears!",
        isBattle: true,
        opponentId: 26,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Stoneling appears!",
        isBattle: true,
        opponentId: 21,
    },
    {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Aqua-pup appears!",
        isBattle: true,
        opponentId: 22,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Fetheray appears!",
        isBattle: true,
        opponentId: 23,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Ember-kit appears!",
        isBattle: true,
        opponentId: 24,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Glimmerwisp appears!",
        isBattle: true,
        opponentId: 25,
    },
     {
        character: "Narrator",
        dialogue: "You continue your journey...",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A wild Shade-crawler appears!",
        isBattle: true,
        opponentId: 26,
    },
    {
        character: "Narrator",
        dialogue: "You have completed your journey. You can continue to train your creatures in new battles.",
        isBattle: false,
    }
];

    