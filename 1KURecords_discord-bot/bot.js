const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, Events, GatewayIntentBits, ButtonInteraction } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const config = require('config');
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
const BOT_TOKEN = config.get('token');
const SERVER_ID = config.get('server_id');
const ALLOWED_CHANNEL_ID = config.get('channel_id');
const REGION_ROLE_MESSAGE_ID = config.get('region_role_message_id');
const REGION_ROLE_CHANNEL_ID = config.get('region_role_channel_id');
const DATA_FILE_PATH = config.get('map_data_path');
// const PROOF_FOLDER = path.join(__dirname, '../Proof');
const PROOF_FOLDER = config.get('proof_pics_path');

const ROLE_ON_JOIN_ID = config.get('role_on_join_id');

const magic_ball_answers = [
    // Positive
    "It is certain.", "It is decidedly so.", "Without a doubt.", " Yes – definitely.", "You may rely on it.", 
    "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", " Signs point to yes.",
    
    // Neutral
    "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", " Cannot predict now.", "Concentrate and ask again.",

    // Negative
    "Don’t count on it.", "My reply is no.", "My sources say no.", " Outlook not so good.", "Very doubtful."
];
const magic_ball_answers_size = 20;

// Ensure directories exist
fs.ensureDirSync(PROOF_FOLDER);

// Make the bot post region pick message
if (process.argv[2] === "1") {
    
    client.once('ready', async () => {
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
client.once('ready', () => {
    console.log(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📁 Data file path: ${DATA_FILE_PATH}`);
    console.log(`📁 Data file exists: ${fs.existsSync(DATA_FILE_PATH)}`);
    console.log(`🖼️  Proof folder: ${PROOF_FOLDER}`);
    console.log(`📂 Current working directory: ${process.cwd()}`);
    console.log(`📂 Bot file location: ${__dirname}`);

    loadCommands();
});

// Button press event
client.on(Events.InteractionCreate, async interaction => {
    console.log('event: ' + interaction.type);

    // Commands
    if (interaction.type === 2) {
        console.log('command');

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

        console.log('button');

        if (interaction.channel.id !== REGION_ROLE_CHANNEL_ID) return;

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
client.on('messageCreate', async (message) => {
    // Ignore bot messages
    if (message.author.bot ) return;
    const content = message.content.toLowerCase().trim();

    if (message.mentions.has(client.user)) {
        console.log("bot was pinged");

        if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return;
        
        // Magic 8 ball response
        if (content.includes("is this") || content.includes("is it")) {
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

