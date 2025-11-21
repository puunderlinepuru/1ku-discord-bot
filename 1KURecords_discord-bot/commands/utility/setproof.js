const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');
const config = require('config');
const sharp = require('sharp');
const path = require('path');

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

function setProofPicture(map_name, image, runner_name) {
    
    try {
        const mapRecords = loadMapData();
        
        if (!mapRecords[map_name]) {
            return `❌ Map "${map_name}" not found. Use !list to see available maps.`;
        }
        
        if (!image.contentType.startsWith('image/')) {
            return '❌ Please attach a valid image file.';
        }
        
        const proofPath = processImage(image, map_name);
        if (!proofPath) {
            return '❌ Failed to process image. Please try again.';
        }
        
        // Update proof
        mapRecords[map_name].proof = proofPath;
        mapRecords[map_name].proof_by = runner_name;
        mapRecords[map_name].lastUpdated = new Date().toISOString();
        
        if (saveMapData(mapRecords)) {
            return `✅ Proof image updated for ${map_name}! Image by ${runner_name}`;
        } else {
            return '❌ Failed to save proof image. Please try again.';
        }
        
    } catch (error) {
        console.error('Error updating proof:', error);
        return '❌ An error occurred while updating the proof image.';
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setproof')
        .setDescription('Provide a (better) picture for existing record')
        .addStringOption((option) => 
            option.setName('map_name')
            .setDescription('which map?')
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
            option.setName('image')
            .setDescription('record proof')
            .setRequired(true)
        ),
    async execute(interaction) {
        let map_name = interaction.options.getString('map_name');
        let proof_image = interaction.options.getAttachment('image');
        let runner = interaction.user.username;
        response = setProofPicture(map_name, proof_image, runner);

        await interaction.reply(response);
    }
}