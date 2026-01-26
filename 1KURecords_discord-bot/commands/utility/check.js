const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
const config = require('config');

const DATA_FILE_PATH = config.get('map_data_path');
// const PROOF_FOLDER = config.get('proof_pics_path');


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

function getMapData(request_map) {

    const mapId = request_map;

    try {
        const mapRecords = loadMapData();
        
        if (!mapRecords[mapId]) {
            return {color: 0x934739,
                title: `📊 ${mapId.toUpperCase().replace(/_/g, ' ')}`,
                description: `❌ Map "${mapId}" not found. Use /list to see available maps.`
            };
        }
        
        const data = mapRecords[mapId];
        const checkEmbed = {
            color: 0x934739,
            title: `📊 ${mapId.toUpperCase().replace(/_/g, ' ')}`,
            // image: {
            //     url: data.pic ? data.pic : null
            // },
            description: `**Current Record:** 🎯 **${data.curr}**`,
            fields: []
        };

        checkEmbed.fields.push({ 
                name: `📁 Previous Record:`, 
                value: data.prev, 
                inline: false 
            });

        console.log('Record data:', data);
        
        // // Show record history if available
        // if (data.records && data.records.length > 0) {
        //     let historyText = '';
        //     data.records.forEach((record, index) => {
        //         const date = new Date(record.timestamp).toLocaleDateString('en-US', { 
        //             month: 'short', 
        //             day: 'numeric',
        //             year: 'numeric'
        //         });
        //         const isLatest = index === data.records.length - 1;
        //         const emoji = isLatest ? '🎯' : '📌';
        //         historyText += `${emoji} **${record.time}** - ${date}\n`;
        //     });
        //     checkEmbed.fields.push({ 
        //         name: `📈 Record History (${data.records.length} total)`, 
        //         value: historyText, 
        //         inline: false 
        //     });
        // }
        
        // // Last updated info
        // if (data.lastUpdated) {
        //     const lastUpdate = new Date(data.lastUpdated).toLocaleString('en-US', {
        //         month: 'short',
        //         day: 'numeric',
        //         year: 'numeric',
        //         hour: '2-digit',
        //         minute: '2-digit'
        //     });
        //     checkEmbed.fields.push({ 
        //         name: '🕐 Last Updated', 
        //         value: lastUpdate, 
        //         inline: true 
        //     });
        // }
        
        // // Proof status
        checkEmbed.fields.push({ 
            name: '📸 Proof Image', 
            // value: data.proof ? '✅ Available' : '❌ Missing',
            value: data.pic ? data.pic : '❌ Missing',
            inline: true 
        });
        
        // // Category
        // checkEmbed.fields.push({ 
        //     name: '📁 Category', 
        //     value: data.category.toUpperCase().replace(/-/g, ' '), 
        //     inline: true 
        // });
        
        return (checkEmbed);
        
    } catch (error) {
        console.error('Error checking record:', error);
        return {};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Check current WR for the map')
        .addStringOption((option) => 
            option.setName('map_name')
            .setDescription('map name')
            .setRequired(true)
        ),
    async execute(interaction) {
        const map_name = interaction.options.getString('map_name') ?? 'wrong input';
        let response = getMapData(map_name);

        await interaction.reply({ embeds: [response], flags: MessageFlags.Ephemeral});
    }
}