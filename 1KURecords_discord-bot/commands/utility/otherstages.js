const { SlashCommandBuilder, MessageFlags } = require('discord.js');

function isValidTimeString(timeStr) {
  const trimmed = timeStr.trim();  
  const regex = /^[0-59]:([0-59])|([0-5][0-9])$/;
  console.log('time got: ', timeStr.trim(), ' - ', regex.test(trimmed))
  return regex.test(trimmed);  
}

function getSeconds(timeStr) {
    const [minutesStr, secondsStr] = timeStr.trim().split(':');
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);
    return minutes*60 + seconds;
}

function calculate(stage_times) {
    const conditions =
            isValidTimeString(stage_times[0]) +
            isValidTimeString(stage_times[1]) +
            isValidTimeString(stage_times[2]) +
            isValidTimeString(stage_times[3]) +
            isValidTimeString(stage_times[4]);
    if (conditions < 3) {
        return 'wrong time format'
    }
    const time_iterator = Iterator.from(stage_times);
    let total_time = 0;
    for (let i = 0; i < stage_times.length; i+=2) {
        total_time += getSeconds(stage_times[i]);
        console.log('added item at: ', i);
    }
    total_time -= getSeconds(stage_times[1]);
    total_time -= getSeconds(stage_times[3]);
    
    const total_minutes = Math.floor(total_time/60);
    const total_seconds = total_time%60;

    return `Map total: ${total_minutes}:${total_seconds}`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('otherstages')
        .setDescription('Sums up the stage times for the total for you :D')
        .addStringOption((option) => 
            option.setName('stage_1_time')
            .setDescription('Time stage 1 finished')
            .setRequired(true)
        )
        .addStringOption((option) => 
            option.setName('stage_2_start')
            .setDescription('Time stage 2 started')
            .setRequired(true)
        )
        .addStringOption((option) => 
            option.setName('stage_2_time')
            .setDescription('Time stage 2 finished')
            .setRequired(true)
        )
        .addStringOption((option) => 
            option.setName('stage_3_start')
            .setDescription('Time stage 3 started')
            .setRequired(true)
        )
        .addStringOption((option) => 
            option.setName('stage_3_time')
            .setDescription('Time stage 3 finished')
            .setRequired(true)
        ),
    async execute(interaction) {
        let response;
        let stage_times = [
            interaction.options.getString('stage_1_time'),
            interaction.options.getString('stage_2_start'),
            interaction.options.getString('stage_2_time'),
            interaction.options.getString('stage_3_start'),
            interaction.options.getString('stage_3_time')
        ]
        response = calculate(stage_times);
        await interaction.reply({ content: response, flags: MessageFlags.Ephemeral});
    }
}

