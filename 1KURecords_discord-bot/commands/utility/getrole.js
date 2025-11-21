const { SlashCommandBuilder } = require('discord.js');
const config = require('config');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('getrole')
    .setDescription('Get yourself the role if you haven\'t been assigned one'),
  async execute(interaction) {
    const guild = interaction.guild;
    const member = guild.members.cache.get(interaction.user.id);
    const role = await guild.roles.fetch(config.get('role_on_join_id'))

    try {
      await member.roles.add(role);
      await interaction.reply(`The role ${role.name} has been added to ${member.user.username}.`);
    } catch (error) {
      console.error(error);
      // await interaction.reply('There was an error giving the role.');
    }
  },
}