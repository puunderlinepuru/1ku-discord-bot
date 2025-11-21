const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Print list of available commands"),
    async execute(interaction) {
        const helpEmbed = {
            color: 0x934739,
            title: '🤖 1kU R.U.N. Records Bot',
            description: 'Update speedrun records directly from Discord!\n\n**How it works:**\nNew records are automatically added to the history with timestamps.\nOlder records fade progressively on the website (20% per step).',
            fields: [
                {
                    name: '/update <map> <new_time>',
                    value: '✅ Add a new record to the map\'s history\nExample: `!update cp_altitude 0:58` (attach proof image)\n→ Adds to records array & updates LATEST tab',
                    inline: false
                },
                {
                    name: '/setproof <map>',
                    value: '📸 Update proof image only (attach image)\nExample: `!setproof pl_upward`',
                    inline: false
                },
                {
                    name: '/check <map>',
                    value: '📊 View record history for a map\nExample: `!check cp_cargo`\n→ Shows all records with timestamps',
                    inline: false
                },
                {
                    name: '/list',
                    value: '📝 List all maps with current records',
                    inline: false
                },
                {
                    name: '/latest',
                    value: '🆕 Show the 10 most recently updated maps',
                    inline: false
                }
            ],
            footer: {
                text: 'Time format: MM:SS (e.g., 1:23) • Proof images are automatically processed'
            }
        };
        await interaction.reply({ embeds: [helpEmbed] });
    }
}