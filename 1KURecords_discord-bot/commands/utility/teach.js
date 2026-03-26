const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs-extra');
const path = require('path');
crawlDirectory();

function saveToDictionary(string) {
    const data = fs.readFileSync(path.resolve(__dirname, '..', '..', 'dictionary.json'));
    const jsonData = JSON.parse(data);

    jsonData.words.push(string);

    fs.writeFileSync(path.resolve(__dirname, '..', '..', 'dictionary.json'), JSON.stringify(jsonData, null, 2));
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