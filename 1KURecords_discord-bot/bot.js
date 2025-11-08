const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

// Create Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Configuration
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID || 'YOUR_CHANNEL_ID_HERE';
const DATA_FILE_PATH = path.join(__dirname, '../1KU_RUN_DATA.json');
const PROOF_FOLDER = path.join(__dirname, '../Proof');

// Ensure directories exist
fs.ensureDirSync(PROOF_FOLDER);

// Load map data from JSON file
function loadMapData() {
    try {
        // Check if file exists
        if (!fs.existsSync(DATA_FILE_PATH)) {
            console.error(`❌ Data file not found at: ${DATA_FILE_PATH}`);
            console.error(`   Current working directory: ${process.cwd()}`);
            console.error(`   Bot file location: ${__dirname}`);
            return {};
        }
        
        console.log(`📂 Loading data from: ${DATA_FILE_PATH}`);
        const dataContent = fs.readFileSync(DATA_FILE_PATH, 'utf8');
        
        // Parse JSON directly
        const mapRecords = JSON.parse(dataContent);
        const mapCount = Object.keys(mapRecords).length;
        console.log(`✅ Loaded ${mapCount} maps from JSON file`);
        return mapRecords;
    } catch (error) {
        console.error('❌ Error loading map data:', error.message);
        console.error('   Stack:', error.stack);
        return {};
    }
}

// Save map data to JSON file
function saveMapData(mapRecords) {
    try {
        // Write JSON directly with proper formatting
        const jsonContent = JSON.stringify(mapRecords, null, 2);
        fs.writeFileSync(DATA_FILE_PATH, jsonContent, 'utf8');
        
        // Create backup
        const backupPath = path.join(__dirname, `../backups/data-backup-${Date.now()}.json`);
        fs.ensureDirSync(path.dirname(backupPath));
        fs.writeFileSync(backupPath, jsonContent, 'utf8');
        
        return true;
    } catch (error) {
        console.error('Error saving map data:', error);
        return false;
    }
}

// Process and save image
async function processImage(attachment, mapId) {
    try {
        const response = await fetch(attachment.url);
        const buffer = await response.arrayBuffer();
        
        const proofFileName = `${mapId}.jpg`;
        const proofFilePath = path.join(PROOF_FOLDER, proofFileName);
        
        await sharp(Buffer.from(buffer))
            .resize(1920, null, { 
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality: 85 })
            .toFile(proofFilePath);
        
        return `Proof/${proofFileName}`;
    } catch (error) {
        console.error('Error processing image:', error);
        return null;
    }
}

// Validate time format (MM:SS or 'x')
function isValidTime(time) {
    return /^(\d{1,2}):(\d{2})$|^x$/i.test(time);
}

// Bot ready event
client.once('ready', () => {
    console.log(`🤖 Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📁 Data file path: ${DATA_FILE_PATH}`);
    console.log(`📁 Data file exists: ${fs.existsSync(DATA_FILE_PATH)}`);
    console.log(`🖼️  Proof folder: ${PROOF_FOLDER}`);
    console.log(`📂 Current working directory: ${process.cwd()}`);
    console.log(`📂 Bot file location: ${__dirname}`);
    
    // Try to load data on startup to verify it works
    const testData = loadMapData();
    if (Object.keys(testData).length === 0) {
        console.warn('⚠️  WARNING: No maps loaded! Check the data file path.');
    } else {
        console.log(`✅ Successfully loaded ${Object.keys(testData).length} maps`);
    }
});

// Message handler
client.on('messageCreate', async (message) => {
    // Ignore bot messages and messages from other channels
    if (message.author.bot || message.channel.id !== ALLOWED_CHANNEL_ID) return;
    
    const content = message.content.toLowerCase().trim();
    
    // Help command
    if (content === '!help' || content === '!commands') {
        const helpEmbed = {
            color: 0x934739,
            title: '🤖 1kU R.U.N. Records Bot',
            description: 'Update speedrun records directly from Discord!\n\n**How it works:**\nNew records are automatically added to the history with timestamps.\nOlder records fade progressively on the website (20% per step).',
            fields: [
                {
                    name: '!update <map> <new_time>',
                    value: '✅ Add a new record to the map\'s history\nExample: `!update cp_altitude 0:58` (attach proof image)\n→ Adds to records array & updates LATEST tab',
                    inline: false
                },
                {
                    name: '!setproof <map>',
                    value: '📸 Update proof image only (attach image)\nExample: `!setproof pl_upward`',
                    inline: false
                },
                {
                    name: '!check <map>',
                    value: '📊 View record history for a map\nExample: `!check cp_cargo`\n→ Shows all records with timestamps',
                    inline: false
                },
                {
                    name: '!list',
                    value: '📝 List all maps with current records',
                    inline: false
                },
                {
                    name: '!latest',
                    value: '🆕 Show the 10 most recently updated maps',
                    inline: false
                }
            ],
            footer: {
                text: 'Time format: MM:SS (e.g., 1:23) • Proof images are automatically processed'
            }
        };
        
        message.reply({ embeds: [helpEmbed] });
        return;
    }
    
    // Update record command
    if (content.startsWith('!update ')) {
        const args = message.content.slice(8).trim().split(/\s+/);
        
        if (args.length < 2) {
            message.reply('❌ Usage: `!update <map> <new_time>`\nExample: `!update cp_dustbowl 1:23` (attach proof image)');
            return;
        }
        
        const mapId = args[0];
        const newTime = args[1];
        
        if (!isValidTime(newTime)) {
            message.reply('❌ Invalid time format. Use MM:SS (e.g., 1:23)');
            return;
        }
        
        try {
            const mapRecords = loadMapData();
            
            if (!mapRecords[mapId]) {
                message.reply(`❌ Map "${mapId}" not found. Use !list to see available maps.`);
                return;
            }
            
            // Process image if attached
            let proofPath = mapRecords[mapId].proof;
            if (message.attachments.size > 0) {
                const attachment = message.attachments.first();
                if (attachment.contentType.startsWith('image/')) {
                    proofPath = await processImage(attachment, mapId);
                    if (!proofPath) {
                        message.reply('❌ Failed to process image. Please try again.');
                        return;
                    }
                }
            }
            
            // Update record with new array structure
            const currentTimestamp = new Date().toISOString();
            const existingRecords = mapRecords[mapId].records || [];
            
            // Get the previous record (last in array)
            const previousRecord = existingRecords.length > 0 
                ? existingRecords[existingRecords.length - 1].time 
                : mapRecords[mapId].oldRecord || 'x';
            
            // Add new record to the end of the array
            const updatedRecords = [
                ...existingRecords,
                { time: newTime, timestamp: currentTimestamp }
            ];
            
            mapRecords[mapId] = {
                ...mapRecords[mapId],
                newRecord: newTime,
                oldRecord: previousRecord,
                records: updatedRecords,
                proof: proofPath,
                lastUpdated: currentTimestamp
            };
            
            if (saveMapData(mapRecords)) {
                const successEmbed = {
                    color: 0x4d6b1c,
                    title: '✅ Record Updated!',
                    fields: [
                        { name: 'Map', value: `**${mapId}**`, inline: false },
                        { name: 'New Record', value: `🎯 **${newTime}**`, inline: true },
                        { name: 'Previous', value: previousRecord, inline: true },
                        { name: 'Total Records', value: `${updatedRecords.length} in history`, inline: true }
                    ],
                    footer: {
                        text: `Updated by ${message.author.username} • Will appear in LATEST tab`
                    },
                    timestamp: new Date().toISOString()
                };
                
                if (message.attachments.size > 0) {
                    successEmbed.fields.push({ name: 'Proof Image', value: '✅ Uploaded & Processed', inline: false });
                }
                
                message.reply({ embeds: [successEmbed] });
            } else {
                message.reply('❌ Failed to save record. Please try again.');
            }
            
        } catch (error) {
            console.error('Error updating record:', error);
            message.reply('❌ An error occurred while updating the record.');
        }
    }
    
    // Set proof image command
    if (content.startsWith('!setproof ')) {
        const mapId = message.content.slice(10).trim();
        
        if (!mapId) {
            message.reply('❌ Usage: `!setproof <map>`\nExample: `!setproof cp_dustbowl` (with image attachment)');
            return;
        }
        
        if (message.attachments.size === 0) {
            message.reply('❌ Please attach an image to update the proof.');
            return;
        }
        
        try {
            const mapRecords = loadMapData();
            
            if (!mapRecords[mapId]) {
                message.reply(`❌ Map "${mapId}" not found. Use !list to see available maps.`);
                return;
            }
            
            const attachment = message.attachments.first();
            if (!attachment.contentType.startsWith('image/')) {
                message.reply('❌ Please attach a valid image file.');
                return;
            }
            
            const proofPath = await processImage(attachment, mapId);
            if (!proofPath) {
                message.reply('❌ Failed to process image. Please try again.');
                return;
            }
            
            // Update proof
            mapRecords[mapId].proof = proofPath;
            mapRecords[mapId].lastUpdated = new Date().toISOString();
            
            if (saveMapData(mapRecords)) {
                message.reply(`✅ Proof image updated for ${mapId}!`);
            } else {
                message.reply('❌ Failed to save proof image. Please try again.');
            }
            
        } catch (error) {
            console.error('Error updating proof:', error);
            message.reply('❌ An error occurred while updating the proof image.');
        }
    }
    
    // List records command
    if (content === '!list') {
        try {
            const mapRecords = loadMapData();
            const maps = Object.entries(mapRecords).slice(0, 20); // Limit to first 20
            
            if (maps.length === 0) {
                message.reply('📝 No records found.');
                return;
            }
            
            let listText = '📝 **Current Records:**\n\n';
            maps.forEach(([id, data]) => {
                listText += `**${id}**: ${data.newRecord}`;
                if (data.oldRecord !== 'x') {
                    listText += ` (was ${data.oldRecord})`;
                }
                listText += '\n';
            });
            
            if (Object.keys(mapRecords).length > 20) {
                listText += `\n... and ${Object.keys(mapRecords).length - 20} more records`;
            }
            
            message.reply(listText);
            
        } catch (error) {
            console.error('Error listing records:', error);
            message.reply('❌ An error occurred while listing records.');
        }
    }
    
    // Latest updates command
    if (content === '!latest') {
        try {
            const mapRecords = loadMapData();
            
            // Get maps with lastUpdated, sort by most recent
            const latestMaps = Object.entries(mapRecords)
                .filter(([id, data]) => data.lastUpdated)
                .sort((a, b) => new Date(b[1].lastUpdated) - new Date(a[1].lastUpdated))
                .slice(0, 10);
            
            if (latestMaps.length === 0) {
                message.reply('📝 No recently updated records found.');
                return;
            }
            
            let latestText = '';
            latestMaps.forEach(([id, data], index) => {
                const date = new Date(data.lastUpdated).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric'
                });
                const emoji = index === 0 ? '🆕' : '📌';
                latestText += `${emoji} **${id}** - ${data.newRecord} (${date})\n`;
            });
            
            const latestEmbed = {
                color: 0x934739,
                title: '🆕 Latest 10 Updated Records',
                description: latestText,
                footer: {
                    text: 'Use !check <map> to see full history'
                },
                timestamp: new Date().toISOString()
            };
            
            message.reply({ embeds: [latestEmbed] });
            
        } catch (error) {
            console.error('Error getting latest records:', error);
            message.reply('❌ An error occurred while fetching latest records.');
        }
    }
    
    // Check specific map command
    if (content.startsWith('!check ')) {
        const mapId = message.content.slice(7).trim();
        
        if (!mapId) {
            message.reply('❌ Usage: `!check <map>`\nExample: `!check cp_dustbowl`');
            return;
        }
        
        try {
            const mapRecords = loadMapData();
            
            if (!mapRecords[mapId]) {
                message.reply(`❌ Map "${mapId}" not found. Use !list to see available maps.`);
                return;
            }
            
            const data = mapRecords[mapId];
            const checkEmbed = {
                color: 0x934739,
                title: `📊 ${mapId.toUpperCase().replace(/_/g, ' ')}`,
                description: `**Current Record:** 🎯 **${data.newRecord}**`,
                fields: []
            };
            
            // Show record history if available
            if (data.records && data.records.length > 0) {
                let historyText = '';
                data.records.forEach((record, index) => {
                    const date = new Date(record.timestamp).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                    });
                    const isLatest = index === data.records.length - 1;
                    const emoji = isLatest ? '🎯' : '📌';
                    historyText += `${emoji} **${record.time}** - ${date}\n`;
                });
                checkEmbed.fields.push({ 
                    name: `📈 Record History (${data.records.length} total)`, 
                    value: historyText, 
                    inline: false 
                });
            }
            
            // Last updated info
            if (data.lastUpdated) {
                const lastUpdate = new Date(data.lastUpdated).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                checkEmbed.fields.push({ 
                    name: '🕐 Last Updated', 
                    value: lastUpdate, 
                    inline: true 
                });
            }
            
            // Proof status
            checkEmbed.fields.push({ 
                name: '📸 Proof Image', 
                value: data.proof ? '✅ Available' : '❌ Missing', 
                inline: true 
            });
            
            // Category
            checkEmbed.fields.push({ 
                name: '📁 Category', 
                value: data.category.toUpperCase().replace(/-/g, ' '), 
                inline: true 
            });
            
            message.reply({ embeds: [checkEmbed] });
            
        } catch (error) {
            console.error('Error checking record:', error);
            message.reply('❌ An error occurred while checking the record.');
        }
    }
});

// Error handling
client.on('error', console.error);

// Login to Discord
client.login(BOT_TOKEN);

