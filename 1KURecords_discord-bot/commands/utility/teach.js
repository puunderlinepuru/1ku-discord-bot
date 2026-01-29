const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');

function saveToDictionary(string) {
    const data = fs.readFileSync('D:/1kU website/1ku-discord-bot/1KURecords_discord-bot/dictionary.json');
    const jsonData = JSON.parse(data);

    jsonData.words.push(string);

    fs.writeFileSync('D:/1kU website/1ku-discord-bot/1KURecords_discord-bot/dictionary.json', JSON.stringify(jsonData, null, 2));
    console.log("added");
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('teach')
            .setDescription('Teach the bot a phrase')
            .addStringOption((option) => 
                option.setName('phrase')
                .setDescription('what are we learning?')
                .setRequired(true)
            ),
        async execute(interaction) {
            saveToDictionary(interaction.options.getString('phrase'));
            response = "Added \"" + interaction.options.getString('phrase') + "\" to dictionary.";
    
            await interaction.reply({ content: response});
        }
}