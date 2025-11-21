const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const config = require('config');

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
// const DATA_FILE_PATH = path.join(__dirname, '../1KU_RUN_DATA.json');
const DATA_FILE_PATH = config.get('map_data_path');
// const PROOF_FOLDER = path.join(__dirname, '../Proof');
const PROOF_FOLDER = config.get('proof_pics_path');

const ROLE_ON_JOIN_ID = config.get('role_on_join_id');

// Ensure directories exist
fs.ensureDirSync(PROOF_FOLDER);

// Make the bot post region pick message
if (process.argv[2] === "1") {
    
    client.once('ready', async () => {
        const test_channel = client.channels.cache.get(ALLOWED_CHANNEL_ID);
        console.log("channel: " + test_channel.name);
        const region_role_message = await test_channel.messages.fetch(REGION_ROLE_MESSAGE_ID);
        console.log(region_role_message.content);

        const role_1 = new ButtonBuilder()
            .setCustomId('button_1')
            .setLabel('1')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);
        const role_2 = new ButtonBuilder()
            .setCustomId('button_2')
            .setLabel('2')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false);

        const row = new ActionRowBuilder().addComponents(role_1, role_2);
        test_channel.send({ content: 'test message', components: [row]});
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

    const guild = client.guilds.cache.get(SERVER_ID)
    const member = await guild.members.fetch(interaction.user.id);


    
    const role_1 =  await guild.roles.fetch(config.role_1_id);
    const role_2 =  await guild.roles.fetch(config.role_2_id);
    if (interaction.customId === 'button_1') {
        member.roles.cache.has(role_1.id) ? member.roles.remove(role_1) : member.roles.add(role_1);
        interaction.deferUpdate();
    } else if (interaction.customId === 'button_2') {
        member.roles.cache.has(role_2.id) ? member.roles.remove(role_2) : member.roles.add(role_2);
        interaction.deferUpdate();
    }
})

// User join event
client.on(Events.GuildMemberAdd, async member => {
    const guild = client.guilds.cache.get(SERVER_ID);
    const role_on_join = await guild.roles.fetch(ROLE_ON_JOIN_ID);
    const test_channel = client.channels.cache.get(ALLOWED_CHANNEL_ID);
    test_channel.send(`hi ${member.displayName}`);
    member.roles.add(role_on_join);
})

// Message handler
client.on('messageCreate', async (message) => {
    // Ignore bot messages and messages from other channels
    if (message.author.bot || message.channel.id !== ALLOWED_CHANNEL_ID) return;
    
    const content = message.content.toLowerCase().trim();
    
    
    
    // Set proof image command
    
});

// Error handling
client.on('error', console.error);

// Login to Discord
client.login(BOT_TOKEN);

