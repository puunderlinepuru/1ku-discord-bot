// Discord Bot Configuration
module.exports = {
    // Your Discord Bot Token (get from Discord Developer Portal)
    botToken: process.env.DISCORD_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE',
    
    // Channel ID where the bot will listen for commands
    allowedChannelId: process.env.ALLOWED_CHANNEL_ID || 'YOUR_CHANNEL_ID_HERE',
    
    // Path to your data.js file (relative to bot location)
    dataFilePath: '../data.js',
    
    // Path to your Proof folder (relative to bot location)
    proofFolder: '../Proof',
    
    // Backup folder for data backups
    backupFolder: '../backups'
};

