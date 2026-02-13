process.env.NODE_ENV = process.argv[2] ?? "default";

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
    Component
} = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const config = require('config');
const token = require('./token.json');
console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
const dictionary = './dictionary.json';

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

// Configuration
const BOT_TOKEN = token.token;
const SERVER_ID = config.get('server_id');
const ALLOWED_CHANNEL_ID = config.get('allowed_channel_id');
const REGION_ROLE_MESSAGE_ID = config.get('region_role_message_id');
const REGION_ROLE_CHANNEL_ID = config.get('region_role_channel_id');
const DATA_FILE_PATH = config.get('map_data_path');
// const PROOF_FOLDER = path.join(__dirname, '../Proof');
// const PROOF_FOLDER = config.get('proof_pics_path');
const ROLE_ON_JOIN_ID = config.get('role_on_join_id');

let isBotLocked = false;
let pet_count;
let petMessageId;

function givePets(){
    const allowed_channel = client.channels.cache.get(ALLOWED_CHANNEL_ID);
        console.log("channel: " + allowed_channel);
        // const region_role_message = await region_role_channel.messages.fetch(REGION_ROLE_MESSAGE_ID);
        // console.log(region_role_message.content);

        const pet_button = new ButtonBuilder()
            .setCustomId('pet_button')
            .setLabel('Press to pet')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const row = new ActionRowBuilder().addComponents(pet_button);
        allowed_channel.send({ content: 
            `pet pet pet c:<`, components: [row]});
}

const magic_ball_answers = [
    // Positive
    "It is certain.", "It is decidedly so.", "Without a doubt.", " Yes – definitely.", "You may rely on it.", 
    "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", " Signs point to yes.",
    
    // Neutral
    "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", " Cannot predict now.", "Concentrate and ask again.",

    // Negative
    "Don’t count on it.", "My reply is no.", "My sources say no.", " Outlook not so good.", "Very doubtful.", "No."
];
const magic_ball_answers_size = 21;

// Ensure directories exist
// fs.ensureDirSync(PROOF_FOLDER);

// Make the bot post region pick message
if (process.argv[2] === "post_message") {
    client.on(Events.ClientReady, async () => {
        const region_role_channel = client.channels.cache.get(REGION_ROLE_CHANNEL_ID);
        console.log("channel: " + region_role_channel.name);
        // const region_role_message = await region_role_channel.messages.fetch(REGION_ROLE_MESSAGE_ID);
        // console.log(region_role_message.content);

        const role_EU = new ButtonBuilder()
            .setCustomId('button_EU')
            .setLabel('Europe')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);
        const role_NA = new ButtonBuilder()
            .setCustomId('button_NA')
            .setLabel('North America')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);
        const role_AU = new ButtonBuilder()
        .setCustomId('button_AU')
        .setLabel('Australia')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false);
        const role_Asia = new ButtonBuilder()
        .setCustomId('button_Asia')
        .setLabel('Asia')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(false);

        const row = new ActionRowBuilder().addComponents(role_EU, role_NA, role_AU, role_Asia);
        region_role_channel.send({ content: 
            `You can also pick your region here but I will probably be dead often and may not assign it 
:3
            `, components: [row]});
    })
}

function loadCommands() {
    client.commands = new Collection();

    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            // Set a new item in the Collection with the key as the command name and the value as the exported module
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }
    }
}

// Bot ready event
client.on(Events.ClientReady, () => {
    client.user.setPresence({
        // Laptop
        // activities: [{name: 'in pu\'s laptop', type: ActivityType.Playing}]

        // PC
        activities: [{name: 
            // 'silly thoughts :p', 
            'the records are still not working',
            type: ActivityType.Listening}]
    })
    console.log(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📁 Data file path: ${DATA_FILE_PATH}`);
    console.log(`📁 Data file exists: ${fs.existsSync(DATA_FILE_PATH)}`);
    // console.log(`🖼️  Proof folder: ${PROOF_FOLDER}`);
    console.log(`📂 Current working directory: ${process.cwd()}`);
    console.log(`📂 Bot file location: ${__dirname}`);

    loadCommands();
});

// Button press event
client.on(Events.InteractionCreate, async interaction => {
    console.log('[EVENT] event: ' + interaction.type);

    // Commands
    if (interaction.type === 2) {
        console.log('[EVENT] command');

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    } 
    // Buttons
    if (interaction.type === 3) {

        const guild = client.guilds.cache.get(SERVER_ID)
        const member = await guild.members.fetch(interaction.user.id);

        console.log('[EVENT] button');

        if (interaction.channel.id == REGION_ROLE_CHANNEL_ID) {
            const role_EU =  await guild.roles.fetch(config.get('role_EU_id'));
            const role_NA =  await guild.roles.fetch(config.get('role_NA_id'));
            const role_AU =  await guild.roles.fetch(config.get('role_AU_id'));
            const role_Asia =  await guild.roles.fetch(config.get('role_Asia_id'));
            if (interaction.customId === 'button_EU') {
                member.roles.cache.has(role_EU.id) ? member.roles.remove(role_EU) : member.roles.add(role_EU);
                interaction.deferUpdate();
            } else if (interaction.customId === 'button_NA') {
                member.roles.cache.has(role_NA.id) ? member.roles.remove(role_NA) : member.roles.add(role_NA);
                interaction.deferUpdate();
            } else if (interaction.customId === 'button_AU') {
                member.roles.cache.has(role_AU.id) ? member.roles.remove(role_AU) : member.roles.add(role_AU);
                interaction.deferUpdate();
            } else if (interaction.customId === 'button_Asia') {
                member.roles.cache.has(role_Asia.id) ? member.roles.remove(role_Asia) : member.roles.add(role_Asia);
                interaction.deferUpdate();
            }
        }

        if (interaction.customId === 'pet_button') {
            console.log("pet button");
            const petMessage = interaction.message;
            // petMessage.edit(`pet pet pet, pets: ${pet_count}`)
            //     .then(msg => console.log(`Updated the content of a message to ${msg.content}`))
            //     .catch(console.error);
            pet_count ++;
            petMessage.edit(`pet pet pet c:< pet count: ${pet_count}`)
            interaction.deferUpdate();
            console.log('pet_count: ', pet_count);
            if (pet_count >= 10) {
                console.log('bot unlocked');
                petMessage.edit({components: []});
                isBotLocked = false;
                // if (petMessage.deletable) 
                //     {
                //         petMessage.delete().catch(()=> null);
                //         console.log('message deleted');
                //     }
                setTimeout(() => {
                    if (petMessage.deletable) petMessage.delete().catch(() => null);
                }, 4000);
            }
        }
    }

    // if (!interaction.isChatInputCommand() || !interaction.isButton()) return;

	
    
})

// User join event
client.on(Events.GuildMemberAdd, async member => {
    const guild = client.guilds.cache.get(SERVER_ID);
    const role_on_join = await guild.roles.fetch(ROLE_ON_JOIN_ID);
    // const test_channel = client.channels.cache.get(ALLOWED_CHANNEL_ID);
    // test_channel.send(`hi ${member.displayName}`);
    member.roles.add(role_on_join);
})

// Message handler
client.on(Events.MessageCreate, async (message) => {

    // You have hit the rock tax. Pet me meow
    if (message.author.bot && message.content == 'You have hit the rock tax. Pet me meow') {
        isBotLocked = true;
        pet_count = 0;
        console.log('isBotLocked: ', isBotLocked);
        givePets();
    }
    if (message.author.bot && message.content == `pet pet pet`) {
        petMessageId = message.id;
        console.log("pet message id: ", petMessageId);
    }

     // Hunger
    if (message.author.id == '229734102071246850') {
        const data = fs.readFileSync('D:/1kU website/1ku-discord-bot/1KURecords_discord-bot/hungers_messages.json');
            const jsonData = JSON.parse(data);
        
            jsonData.words.push(message.content);
        
            fs.writeFileSync('D:/1kU website/1ku-discord-bot/1KURecords_discord-bot/hungers_messages.json', JSON.stringify(jsonData, null, 2));
            console.log("added");
    }

    // 67
    if (!message.author.bot && message.content.includes('67')) {
        message.reply('https://tenor.com/view/dr-manhattan-gif-18899941');
        message.channel.send(`timed ${message.author.name} for 9 seconds.. I think`)
        message.guild.members.fetch(message.author.id)
            .then(user => {
                user.timeout(9000, `timed out for 10 seconds.. I think`)
                .then(() => {
                console.log('Timed user out for 9000 seconds.')
                })
                .catch(console.error)
            })
            .catch(console.error)
    }

    // Ignore bot messages
    if (message.author.bot || message.type == 19 || message.channelId != ALLOWED_CHANNEL_ID || isBotLocked) return;
    const content = message.content.toLowerCase().trim();

    if (message.mentions.has(client.user)) {
        console.log("[PING] bot was pinged at ", new Date());
        console.log("[MESSAGE] Message type: ", message.type);

        if (message.content.includes("@here") || message.content.includes("@everyone")) return;
        
        // Magic 8 ball response
        if (content.includes("is this") || content.includes("is it") || content.includes("?")) {
            let min = 0;
            let max = magic_ball_answers_size-1;
            let randomInt = Math.floor(Math.random() * (max - min + 1) + min);
            message.reply(magic_ball_answers[randomInt]);
            return;
        } else {
            

            const data = fs.readFileSync(dictionary);
            const jsonData = JSON.parse(data);

            let min = 0;
            let max = jsonData.words.length -1;
            let randomInt = Math.floor(Math.random() * (max - min + 1) + min);

            message.reply(jsonData.words[randomInt]);
            return;
        }
    }
});

// Error handling
client.on('error', console.error);

// Login to Discord
client.login(BOT_TOKEN);

