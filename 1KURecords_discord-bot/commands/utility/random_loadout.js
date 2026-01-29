const { SlashCommandBuilder, MessageFlags } = require('discord.js');

const classes = ['Scout', 'Soldier', 'Pyro', 'Demo', 'Heavy', 'Engineer', 'Medic', 'Sniper', 'Spy']
const items = [
    // Scout
    [
        // Primary
        [
            'Scattergun',
            'Force-a-Nature',
            'Shortstop',
            'Soda Popper',
            'Baby Face\'s Blaster',
            'Back Scatter'
        ],
        // Secondary
        [
            'Pistol',
            'Bonk! Atomic Punch',
            'Crit-a-Cola',
            'Flying Guillotine',
            'Mad Milk',
            'Pretty Boy\'s Pocket Pistol',
            'Winger'
        ],
        // Melee
        [
            'Bat',
            'Atomizer',
            'Boston Basher',
            'Candy Cane',
            'Fan O\'War',
            'Sandman',
            'Sun-on-a-Stick',
            'Wrap Assassin'
        ]
    ],

    // Soldier
    [
        // Primary
        [
            'Rocket Launcher',
            'Original',
            'Air Strike',
            'Beggar\'s Bazooka',
            'Black Box',
            'Cow Mangler 500',
            'Direct Hit',
            'Liberty Launcher',
            'Rocket Jumper'
        ],

        // Secondary
        [
            'Shotgun',
            'Battalion\'s Backup',
            'Buff Banner',
            'Concheror',
            'Gunboats',
            'Mantreads',
            'Panic Attack',
            'Reserve Shooter',
            'Righteous Bison',
        ],

        // Melee
        [
            'Shovel',
            'Disciplinary Action',
            'Equalizer',
            'Escape Plan',
            'Half-Zatoichi',
            'Market Gardener',
            'Pain Train',
        ]
    ],

    // Pyro
    [
        // Primary
        [
            'Flame Thrower',
            'Backburner',
            'Degreaser',
            'Dragon\'s Fury',
            'Phlogistinator'
        ],

        // Secondary
        [
            'Shotgun',
            'Detonator',
            'Flare Gun',
            'Gas Passer',
            'Manmelter',
            'Panic Attack',
            'Reserve Shooter',
            'Scorch Shot',
            'Thermal Thruster'
        ],

        // Melee
        [
            'Fire Axe',
            'Axtinguisher',
            'Back Scratcher',
            'Homewrecker',
            'Hot Hand',
            'Neon Annihilator',
            'Powerjack',
            'Sharpened Volcano Fragment',
            'Third Degree'
        ]
    ],

    // Demoman
    [
        // Primary
        [
            'Grenade Launcher',
            'Ali Baba\'s Wee Booties',
            'B.A.S.E. Jumper',
            'Iron Bomber',
            'Loch-n-Load',
            'Loose Cannon'
        ],

        // Secondary
        [
            'Stickybomb Launcher',
            'Chargin\' Targe',
            'Quickiebomb Launcher',
            'Scottish Resistance',
            'Splendid Screen',
            'Sticky Jumper',
            'Tide Turner',
        ],

        // Melee
        [
            'Bottle',
            'Claidheamh Mòr',
            'Eyelander',
            'Half-Zatoichi',
            'Pain Train',
            'Persian Persuader',
            'Scotsman\'s Skullcutter',
            'Ullapool Caber'
        ]
    ],

    // Heavy
    [
        // Primary
        [
            'Minigun',
            'Brass Beast',
            'Huo-Long Heater',
            'Natascha',
            'Tomislav'
        ],

        // Secondary
        [
            'Shotgun',
            'Buffalo Steak Sandvich',
            'Dalokohs Bar',
            'Family Business',
            'Panic Attack',
            'Sandvich',
            'Second Banana'
        ],

        // Melee
        [
            'Fists',
            'Eviction Notice',
            'Fists of Steel',
            'Gloves of Running Urgently',
            'Holiday Punch',
            'Killing Gloves of Boxing',
            'Warrior\'s Spirit'
        ]
    ],

    // Engineer
    [
        // Primary
        [
            'Shotgun',
            'Frontier Justice',
            'Panic Attack',
            'Pomson 6000',
            'Rescue Ranger',
            'Widowmaker'
        ],

        // Secondary
        [
            'Pistol',
            'Short Circuit',
            'Wrangler'
        ],

        // Melee
        [
            'Wrench',
            'Eureka Effect',
            'Gunslinger',
            'Jag',
            'Southern Hospitality'
        ]
    ],

    // Medic
    [
        // Primary
        [
            'Syringe Gun',
            'Blutsauger',
            'Crusader\'s Crossbow',
            'Overdose',
        ],

        // Secondary
        [
            'Medi Gun',
            'Kritzkrieg',
            'Quick-Fix',
            'Vaccinator'
        ],

        // Melee
        [
            'Bonesaw',
            'Amputator',
            'Solemn Vow',
            'Übersaw',
            'Vita-Saw'
        ]
    ],

    // Sniper
    [
        // Primary
        [
            'Sniper Rifle',
            'Bazaar Bargain',
            'The Classic',
            'Hitman\'s Heatmaker',
            'Huntsman',
            'Machina',
            'Sydney Sleeper'
        ],

        // Secondary
        [
            'Submachine Gun',
            'Cleaner\'s Carbine',
            'Cozy Camper',
            'Darwin\'s Danger Shield',
            'Jarate',
            'Razorback',
        ],

        // Melee
        [
            'Kukri',
            'Bushwacka',
            'Shahanshah',
            'Tribalman\'s Shiv'
        ]
    ],

    // Spy
    [
        // Primary
        [
            'Revolver',
            'Ambassador',
            'Enforcer',
            'Diamondback',
            'L\'Etranger'
        ],

        // Secondary
        [
            'Invis watch',
            'Cloak and Dagger',
            'Dead Ringer'
        ],

        // Melee
        [
            'Knife',
            'Big Earner',
            'Conniver\'s Kunai',
            'Spy-cicle',
            'Your Eternal Reward'
        ]
    ]
]

function getRandomLoadout () {
    let response = 'You\'re playing: ';
    const min = 0;
    let max = 8;
    const random_class_id = Math.floor(Math.random() * (max - min + 1) + min);
    response += classes[random_class_id];

    max = items[random_class_id][0].length-1;
    const random_primary_id = Math.floor(Math.random() * (max - min + 1) + min);
    response += `\n Primary: ${items[random_class_id][0][random_primary_id]}`;

    max = items[random_class_id][1].length-1;
    const random_secondary_id = Math.floor(Math.random() * (max - min + 1) + min);
    response += `\n Secondary: ${items[random_class_id][1][random_secondary_id]}`;

    max = items[random_class_id][2].length-1;
    const random_melee_id = Math.floor(Math.random() * (max - min + 1) + min);
    response += `\n Melee: ${items[random_class_id][2][random_melee_id]}`;

    return response;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('random_loadout')
        .setDescription('Generates a random loadout if you don\'t know what to play.'),
        
        async execute(interaction) {
            const response = getRandomLoadout();

            await interaction.reply({content : response, flags: MessageFlags.Ephemeral});
        }
}