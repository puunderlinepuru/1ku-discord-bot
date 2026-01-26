const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs-extra');

function findCommands(){
    const files = fs.readdirSync('./commands/utility');
    let helpEmbed = {
         color: 0x934739,
            title: '🤖 1kU R.U.N. Records Bot',
            description: 'Update speedrun records directly from Discord!\n\n**How it works:**\nNew records are automatically added to the history with timestamps.\nOlder records fade progressively on the website (20% per step).',
            fields: []
    }
    
    const files_iterator = Iterator.from(files);
    files_iterator.forEach (function(value) {
        let command = '/' + value.substring(0, value.length - 3);
        helpEmbed.fields.push({
            name: command, 
            value: 'I hope name is self explanatory, I haven\'t figured out how to automate it'
        });
    })
    return helpEmbed;
}

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Print list of available commands"),
    async execute(interaction) {
        
        const helpEmbed = findCommands();
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    }
}