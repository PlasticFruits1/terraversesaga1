
export interface StoryChapter {
    character: string;
    dialogue: string;
    imageUrl?: string;
    isBattle: boolean;
    opponentId?: number; // ID of the creature to fight
}

export const story: StoryChapter[] = [
    // --- Intro ---
    {
        character: "Mysterious Elder",
        dialogue: "Welcome, young one. The world of Terraverse is in turmoil. The elemental creatures, once our guardians, are enraged and causing chaos. I sense a unique power within you.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Mysterious Elder",
        dialogue: "You must embark on a journey to quell their rage and restore balance. Your path will not be easy, but your bond with your creatures will be your greatest strength.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    // --- Wave 1: The Basics ---
    {
        character: "Mysterious Elder",
        dialogue: "Your first task is to face a Stoneling whose rocky tantrums are shaking these plains. Show it a firm but gentle hand.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A furious Stoneling blocks your path!",
        isBattle: true,
        opponentId: 21, // Stoneling
    },
    {
        character: "Mysterious Elder",
        dialogue: "Well done. Next, head to the coast. An Aqua-pup's sorrowful tides are flooding the shores. Be wary of its speed.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A frenzied Aqua-pup surges from the waves!",
        isBattle: true,
        opponentId: 22, // Aqua-pup
    },
    {
        character: "Mysterious Elder",
        dialogue: "The path now leads to the high peaks, where a territorial Fetheray whips up unnatural storms. Its mastery of the winds is formidable.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A screeching Fetheray dives from the storm clouds!",
        isBattle: true,
        opponentId: 23, // Fetheray
    },
    // --- Boss 1 ---
    {
        character: "Mysterious Elder",
        dialogue: "You've proven your command of the basic elements. But now, you must face the great Terralord, king of the mountains, has awoken. Its power is immense. Prove your worth.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The ground trembles as the mighty Terralord appears!",
        isBattle: true,
        opponentId: 101, // Terralord (Boss)
    },
    // --- Wave 2: New Elements & Challenges ---
    {
        character: "Mysterious Elder",
        dialogue: "The earth now respects you. Now, a scorching heat emanates from the nearby woods. An Ember-kit is running wild. You must cool its temper.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "An agitated Ember-kit leaps from the bushes!",
        isBattle: true,
        opponentId: 24, // Ember-kit
    },
    {
        character: "Mysterious Elder",
        dialogue: "In the shimmering grove ahead, a Glimmerwisp is distorting the very light, creating confusing illusions.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A blinding Glimmerwisp materializes before you!",
        isBattle: true,
        opponentId: 25, // Glimmerwisp
    },
    {
        character: "Mysterious Elder",
        dialogue: "The light bends to your will. Now, you must face the darkness. A Shade-crawler lurks in the nearby caves, its shadowy presence upsetting the natural balance.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A sinister Shade-crawler emerges from the gloom!",
        isBattle: true,
        opponentId: 26, // Shade-crawler
    },
    // --- Boss 2 ---
    {
        character: "Mysterious Elder",
        dialogue: "The seas themselves are now in an uproar. The Abyssal Leviathan has been stirred from its slumber. This will be a true test of your control over water.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A colossal Abyssal Leviathan rises from the deep!",
        isBattle: true,
        opponentId: 102, // Abyssal Leviathan (Boss)
    },
    // --- Wave 3: Advanced Creatures ---
    {
        character: "Mysterious Elder",
        dialogue: "The tides are calm. In the overgrown shrine, a Vine-Crawler has entangled the ancient stones, pulsing with primal energy.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A sentient vine monster, the Vine-Crawler, rises to challenge you!",
        isBattle: true,
        opponentId: 29, // Vine-Crawler
    },
    {
        character: "Mysterious Elder",
        dialogue: "Impressive. Near the hot springs, a Geyser-Fin is causing the water to boil with rage. Its scald attack is dangerous.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A hissing Geyser-Fin erupts from a steaming pool!",
        isBattle: true,
        opponentId: 30, // Geyser-Fin
    },
    {
        character: "Mysterious Elder",
        dialogue: "The air grows thin. High in the canyons, a Zephyr-Wisp dances on the winds, its form barely visible as it creates razor-sharp gusts.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The glowing wind spirit, Zephyr-Wisp, forms before you!",
        isBattle: true,
        opponentId: 31, // Zephyr-Wisp
    },
    // --- Boss 3 ---
    {
        character: "Mysterious Elder",
        dialogue: "Look to the skies. The Thunder-roc, a being of pure storm, circles the highest peak. Its cries are thunder, its wings the hurricane.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The Thunder-roc descends with a deafening roar!",
        isBattle: true,
        opponentId: 103, // Thunder-roc (Boss)
    },
    // --- Wave 4: Toughest Regulars ---
    {
        character: "Mysterious Elder",
        dialogue: "The storm has passed. Now, a Magma-Pup plays dangerously close to the volcano's edge, its paws leaving molten prints.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A playful but dangerous Magma-Pup bounds towards you!",
        isBattle: true,
        opponentId: 32, // Magma-Pup
    },
    {
        character: "Mysterious Elder",
        dialogue: "A creature of pure light blocks the path to the Sunken Temple. The Celestial-Kirin is a divine beast whose healing powers are legendary.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The divine Celestial-Kirin appears in a flash of light!",
        isBattle: true,
        opponentId: 33, // Celestial-Kirin
    },
    {
        character: "Mysterious Elder",
        dialogue: "Now you must face the guardian of the Sunken Temple itself. The Sunstone Turtle's shell is said to be an impenetrable shield of light.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The Sunstone Turtle emerges, its shell glowing with intense power!",
        isBattle: true,
        opponentId: 27, // Sunstone Turtle
    },
    // --- Boss 4 ---
    {
        character: "Mysterious Elder",
        dialogue: "The guardian of the volcanic core, the Inferno Cerberus, is the embodiment of raw, untamed fire. You must face the heat.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The three-headed Inferno Cerberus erupts from the volcano!",
        isBattle: true,
        opponentId: 104, // Inferno Cerberus (Boss)
    },
    // --- Wave 5: Penultimate ---
    {
        character: "Mysterious Elder",
        dialogue: "A new shadow falls. Deep within the ruins you've unlocked, the Gloomfang prowls. It is a creature of pure darkness and aggression. It will test your might.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A snarling Gloomfang leaps from the shadows!",
        isBattle: true,
        opponentId: 28, // Gloomfang
    },
    {
        character: "Mysterious Elder",
        dialogue: "You have balanced the light and the dark. But in doing so, you have revealed a greater threat. A being that exists outside of time has awoken.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The air distorts as the magnificent Chrono-Wing appears, its wings beating out of sync with time itself!",
        isBattle: true,
        opponentId: 105, // Chrono-Wing (Boss)
    },
     // --- Wave 6: Advanced ---
    {
        character: "Mysterious Elder",
        dialogue: "Time itself bends to your will. Now, venture into the ancient, petrified forest. A Granite Golem, far stronger than a simple Stoneling, has awoken.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The earth groans as a massive Granite Golem rises to block your path!",
        isBattle: true,
        opponentId: 34, // Granite Golem
    },
    {
        character: "Mysterious Elder",
        dialogue: "Next, you must seek out the Sunken City. It is protected by a Coral Sentinel, a living fortress whose defense is said to be unbreakable.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A towering Coral Sentinel emerges from the ruins, its eyes glowing with ancient power!",
        isBattle: true,
        opponentId: 35, // Coral Sentinel
    },
    {
        character: "Mysterious Elder",
        dialogue: "The last guardian before the great phoenix is the Storm Strider. It rides the thunderclouds and commands the lightning. Be swift.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A crackle of lightning announces the arrival of the Storm Strider!",
        isBattle: true,
        opponentId: 36, // Storm Strider
    },
    // --- Boss 5 ---
    {
        character: "Mysterious Elder",
        dialogue: "You have tamed the storm. Now, face its master. High atop the solar peak, Solaris, the Sun-Phoenix, awaits. It is a being of pure, unending flame.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The air shimmers with intense heat as Solaris, the Sun-Phoenix, descends!",
        isBattle: true,
        opponentId: 108, // Solaris, the Sun-Phoenix (Boss)
    },
    // --- Wave 7: The Final Gauntlet ---
    {
        character: "Mysterious Elder",
        dialogue: "The sun's fire is yours to command. Now, you must face a new challenge in the caldera of the great volcano. A vicious Cinderclaw has made its lair there.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "With a roar of fire, a Cinderclaw leaps from the magma!",
        isBattle: true,
        opponentId: 37, // Cinderclaw
    },
    {
        character: "Mysterious Elder",
        dialogue: "Venture now to the Whispering Woods, where a mighty Rune-Bear slumbers. It is a creature of immense strength and ancient magic. Tread carefully.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A great Rune-Bear, its fur glowing with power, awakens from its slumber to challenge you!",
        isBattle: true,
        opponentId: 38, // Rune-Bear
    },
    {
        character: "Mysterious Elder",
        dialogue: "Your journey takes you to the Starfall Grotto, where moonlight gathers. It is guarded by a Dream-Weaver, a mystical moth whose powers defy reality.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A beautiful Dream-Weaver emerges, its wings scattering shimmering, hypnotic dust!",
        isBattle: true,
        opponentId: 39, // Dream-Weaver
    },
    // --- Boss 6 ---
    {
        character: "Mysterious Elder",
        dialogue: "You have conquered dreams themselves. But now, you must face the nightmare. From the deepest abyss, Nocturne, the Shadow Titan, has been awakened by your power. It is a being of pure darkness.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "A colossal shadow rises, blotting out all light. Nocturne, the Shadow Titan, has come!",
        isBattle: true,
        opponentId: 109, // Nocturne, the Shadow Titan (Boss)
    },
    // --- Wave 8: The Void's Edge ---
    {
        character: "Mysterious Elder",
        dialogue: "The greatest darkness has been pushed back. Now, you must quell the remaining echoes. In the deep trenches, an Abyss-Watcher stirs, its shadowy tentacles corrupting the waters.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "From the inky depths, an Abyss-Watcher fixes its countless eyes upon you!",
        isBattle: true,
        opponentId: 40, // Abyss-Watcher
    },
     {
        character: "Mysterious Elder",
        dialogue: "The final challenge before the ultimate guardian awaits in the Shifting Sands. A Mirage-Cat, a being of wind and illusion, stalks the dunes.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The sand itself seems to form into the shape of a cunning Mirage-Cat!",
        isBattle: true,
        opponentId: 41, // Mirage-Cat
    },
    {
        character: "Mysterious Elder",
        dialogue: "You have tamed the untamable. You have conquered light, darkness, and even time. But a tear in reality remains. From it, a creature of pure nothingness emerges. The Void-Reaver consumes all.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The eldritch Void-Reaver slithers out from a crack in the world!",
        isBattle: true,
        opponentId: 106, // Void-Reaver (Boss)
    },
    // --- Final Boss ---
    {
        character: "Mysterious Elder",
        dialogue: "This is it. The source of all the chaos. The Nexus-Guardian, a titan formed from all elements, stands before you. The fate of Terraverse rests on your shoulders. Good luck, Tamer.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "The elemental crystal titan, the Nexus-Guardian, awakens!",
        isBattle: true,
        opponentId: 107, // Nexus-Guardian (Final Boss)
    },
    // --- Epilogue ---
    {
        character: "Mysterious Elder",
        dialogue: "You have done it! You have calmed the ultimate beast and restored balance to Terraverse. Your name will be sung by poets for generations to come. You are the true Beast Master.",
        imageUrl: "https://i.imgur.com/pVmaLwK.png",
        isBattle: false,
    },
    {
        character: "Narrator",
        dialogue: "You have completed your journey. You can continue to train your creatures in new battles.",
        isBattle: false,
    }
];
