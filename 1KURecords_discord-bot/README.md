# TF2 Records Discord Bot

A simple Discord bot for managing TF2 speedrun records. Users can update records, add new ones, and upload proof images directly through Discord commands.

## Features

- ✅ Update existing records with new times
- ✅ Add new map records
- ✅ Upload and process proof images
- ✅ List all current records
- ✅ Check specific map records
- ✅ Automatic data backup
- ✅ Image optimization and resizing

## Commands

| Command | Description | Example |
|---------|-------------|---------|
| `!help` | Show all available commands | `!help` |
| `!update <map> <new_time> [old_time]` | Update a record | `!update cp_dustbowl 1:23 1:45` |
| `!newrecord <map> <time>` | Add a new record | `!newrecord cp_newmap 2:15` |
| `!setproof <map>` | Update proof image | `!setproof cp_dustbowl` (with image) |
| `!list` | List all records | `!list` |
| `!check <map>` | Check specific map | `!check cp_dustbowl` |

## Setup Instructions

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section
4. Click "Add Bot"
5. Copy the bot token (keep it secret!)

### 2. Get Channel ID

1. In Discord, right-click on the channel where you want the bot to work
2. Click "Copy Channel ID"
3. Save this ID

### 3. Install Dependencies

```bash
cd discord-bot
npm install
```

### 4. Configure Bot

1. Copy `config.example.js` to `config.js`
2. Edit `config.js` with your bot token and channel ID:

```javascript
module.exports = {
    botToken: 'YOUR_ACTUAL_BOT_TOKEN',
    allowedChannelId: 'YOUR_ACTUAL_CHANNEL_ID',
    // ... other settings
};
```

### 5. Invite Bot to Server

1. In Discord Developer Portal, go to "OAuth2" > "URL Generator"
2. Select "bot" scope
3. Select permissions: "Send Messages", "Read Message History", "Attach Files"
4. Copy the generated URL and open it to invite the bot

### 6. Start the Bot

```bash
npm start
```

## File Structure

```
discord-bot/
├── bot.js              # Main bot code
├── package.json        # Dependencies
├── config.example.js   # Configuration template
├── config.js          # Your actual config (create this)
└── README.md          # This file
```

## How It Works

1. **User posts command** in Discord channel
2. **Bot reads the message** and extracts map name, times, and image
3. **Bot updates data.js** automatically
4. **Bot processes and saves** the image to Proof folder
5. **Bot confirms** the update with a success message

## Examples

### Update a record with image:
```
!update cp_dustbowl 1:23 1:45
[attach screenshot]
```

### Add new record:
```
!newrecord pl_newmap 3:45
[attach proof image]
```

### Just update proof image:
```
!setproof cp_egypt
[attach new screenshot]
```

## Troubleshooting

- **Bot not responding**: Check if bot is online and has proper permissions
- **"Map not found"**: Use `!list` to see available maps
- **Image upload failed**: Make sure image is under 10MB and is a valid image format
- **Permission denied**: Check file permissions for data.js and Proof folder

## Security Notes

- Keep your bot token secret
- Only allow the bot in trusted channels
- The bot only responds in the specified channel
- All changes are logged and backed up automatically

