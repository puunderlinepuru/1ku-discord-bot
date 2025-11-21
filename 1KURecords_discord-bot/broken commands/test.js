const { InteractionContextType, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('command for testing')
    .addStringOption((option) => option.setName('name').setDescription('option')),
    async execute(interaction) {
        const name = interaction.options.getString('name') ?? 'wrong';

        await interaction.reply(name);
    },
};