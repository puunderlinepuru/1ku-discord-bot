const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');
const config = require('config');

const DATA_FILE_PATH = config.get('map_data_path');

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

function listMaps() {
    try {
            const mapRecords = loadMapData();
            const maps = Object.entries(mapRecords).slice(0, 20); // Limit to first 20
            
            if (maps.length === 0) {
                return '📝 No records found.';
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
            
            return (listText);
            
        } catch (error) {
            console.error('Error listing records:', error);
            return '❌ An error occurred while listing records.';
        }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('lists first 20 available maps'),
    async execute(interaction) {
        let reply_text = listMaps();

        await interaction.reply(reply_text)
    }
}