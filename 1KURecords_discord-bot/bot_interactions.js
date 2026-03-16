process.env.NODE_ENV = process.argv[2] ?? "default";

const command = process.argv[3];
const argument = process.argv[4];

const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    Client, 
    Collection, 
    Events, 
    GatewayIntentBits, 
    ButtonInteraction, 
    ActivityType, 
    Presence, 
    Component,
    Guild
} = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const config = require('config');
const token = require('./token.json');
const readline = require('readline-sync');
const { exit } = require('node:process');
console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ]
});

const BOT_TOKEN = token.token;
const SERVER_ID = config.get('server_id');
const ALLOWED_CHANNEL_ID = config.get('allowed_channel_id');
const REGION_ROLE_MESSAGE_ID = config.get('region_role_message_id');
const REGION_ROLE_CHANNEL_ID = config.get('region_role_channel_id');
const DATA_FILE_PATH = config.get('map_data_path');
// const PROOF_FOLDER = path.join(__dirname, '../Proof');
// const PROOF_FOLDER = config.get('proof_pics_path');
const ROLE_ON_JOIN_ID = config.get('role_on_join_id');

// const guild = await client.guilds.fetch(SERVER_ID)


// const member = guild.members.fetch(interaction.user.id);

client.on(Events.ClientReady, () => {
    console.log(`🤖 Bot is ready to interact! Logged in as ${client.user.tag}`);

    client.user.setPresence({
            // Laptop
            // activities: [{name: 'in pu\'s laptop', type: ActivityType.Playing}]
    
            // PC
            activities: [{name: 
                // 'silly thoughts :p', 
                '67 checks are back c:<',
                type: ActivityType.Listening}]
        })

    if(command == 'say') {
        send_in_chat(argument);
        exit();
    } else if (command == 'timeout') {
        exit();
    }
});


// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });



function send_in_chat(message) {
    const channel = guild.fetch(ALLOWED_CHANNEL_ID);
    channel.send(message);
}


// message.channel.send(`Timed ${message.author.username} out for 15 seconds.`)
//         message.guild.members.fetch(message.author.id)
//             .then(user => {
//                 user.timeout(15000, `timed out for 15 seconds.. I think`)
//                 .then(() => {
//                 console.log(`Timed ${message.author.username} out for 15 seconds.`)
//                 })
//                 .catch(console.error)
//             })
//             .catch(console.error)

client.login(BOT_TOKEN);