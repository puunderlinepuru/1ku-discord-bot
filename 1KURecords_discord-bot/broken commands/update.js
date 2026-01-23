const { SlashCommandBuilder } = require('discord.js');
const config = require('config');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp')

const DATA_FILE_PATH = config.get("map_data_path");
const PROOF_FOLDER = config.get('proof_pics_path');

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

function isValidTime(time) {
    return /^(\d{1,2}):(\d{2})$|^x$/i.test(time);
}

function updateRecord(map_name, new_time, proof_image, runner_name) {

        console.log(map_name + ', ' + new_time + ', ' + proof_image.name);

        if (!isValidTime(new_time)) {
            return {color: 0x934739,
                title: `📊 ${mapId.toUpperCase().replace(/_/g, ' ')}`,
                description: `❌ Invalid time format. Use MM:SS (e.g., 1:23)`
            };
        }

        try {
            const mapRecords = loadMapData();
            
            if (!mapRecords[map_name]) {
                return {color: 0x934739,
                title: `📊 ${mapId.toUpperCase().replace(/_/g, ' ')}`,
                description: `❌ Map "${mapId}" not found. Use /list to see available maps.`
            };
            }
            
            // Process image if attached
            let proofPath = mapRecords[map_name].proof;
            proofPath = processImage(proof_image, map_name);
            
            // Update record with new array structure
            const currentTimestamp = new Date().toISOString();
            const existingRecords = mapRecords[map_name].records || [];
            
            // Get the previous record (last in array)
            const previousRecord = existingRecords.length > 0 
                ? existingRecords[existingRecords.length - 1].time 
                : mapRecords[map_name].oldRecord || 'x';
            
            // Add new record to the end of the array
            const updatedRecords = [
                ...existingRecords,
                { time: new_time, timestamp: currentTimestamp }
            ];
            
            mapRecords[map_name] = {
                ...mapRecords[map_name],
                newRecord: new_time,
                oldRecord: previousRecord,
                records: updatedRecords,
                proof: proofPath,
                proof_by: runner_name,
                record_updated_by: runner_name,
                lastUpdated: currentTimestamp
            };
            
            if (saveMapData(mapRecords)) {
                const successEmbed = {
                    color: 0x4d6b1c,
                    title: '✅ Record Updated!',
                    description: 'Updated record for:',
                    fields: [
                        { name: 'Map', value: `**${map_name}**`, inline: false },
                        { name: 'New Record', value: `🎯 **${new_time}**`, inline: true },
                        { name: 'Previous', value: previousRecord, inline: true },
                        { name: 'Total Records', value: `${updatedRecords.length} in history`, inline: true }
                    ],
                    footer: {
                        text: `Updated by ${runner_name} • Will appear in LATEST tab`
                    },
                    timestamp: new Date().toISOString()
                };
                
                if (proof_image.size > 0) {
                    successEmbed.fields.push({ 
                        name: 'Proof Image', 
                        description: 'Updated image',
                        value: '✅ Uploaded & Processed', inline: false 
                    });
                }
                
                return (successEmbed);
            } else {
                return {color: 0x934739,
                    title: `📊 ${mapId.toUpperCase().replace(/_/g, ' ')}`,
                    description: `❌ Failed to save record. Please try again.`
                };
            }
            
            } catch (error) {
                console.error('Error updating record:', error);
                return {color: 0x934739,
                    title: `📊 ${mapId.toUpperCase().replace(/_/g, ' ')}`,
                    description: `❌ An error occurred while updating the record.`
                };
            }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update a map record')
        .addStringOption((option) => 
            option.setName('map_name')
            .setDescription('what map?') 
            .setRequired(true)       
        )
        .addStringOption((option) => 
            option.setName('new_time')
            .setDescription('what time?')
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
            option.setName('image')
            .setDescription('proof?')
            .setRequired(true)
        ),

    async execute(interaction) {
        const map_name = interaction.options.getString('map_name');
        const new_time = interaction.options.getString('new_time');
        const proof_image = interaction.options.getAttachment('image');
        const runner_name = interaction.user.username;

        let response = updateRecord(map_name, new_time, proof_image, runner_name);

        await interaction.reply({ embeds: [response], ephemeral: true});
    }
}