const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');
const config = require('config');

const DATA_FILE_PATH = config.get("map_data_path");

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


function getLatest() {
    try {
        const mapRecords = loadMapData();
        
        // Get maps with lastUpdated, sort by most recent
        const latestMaps = Object.entries(mapRecords)
            .filter(([id, data]) => data.lastUpdated)
            .sort((a, b) => new Date(b[1].lastUpdated) - new Date(a[1].lastUpdated))
            .slice(0, 10);
        
        if (latestMaps.length === 0) {
            return '📝 No recently updated records found.';
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
        
        return ({ embeds: [latestEmbed] });
        
    } catch (error) {
        console.error('Error getting latest records:', error);
        return '❌ An error occurred while fetching latest records.';
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('latest')
        .setDescription('get latest records'),
    async execute(interaction) {
        response = getLatest();

        await interaction.reply(response);
    }
}