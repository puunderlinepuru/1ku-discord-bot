# Discord Bot Quick Start

## 🚀 Setup (5 minutes)

### 1. Install Dependencies
```bash
cd discord-bot
npm install
```

### 2. Configure Bot
Create `config.js` from the example:
```bash
cp config.example.js config.js
```

Edit `config.js` and add:
- Your Discord Bot Token
- The Channel ID where the bot should work

### 3. Run the Bot
```bash
node bot.js
```

Or use PM2 for auto-restart:
```bash
pm2 start bot.js --name "1ku-records-bot"
```

---

## 📝 Bot Commands

### For Users:

**`!update <map> <time>`** - Add a new record
- Example: `!update cp_altitude 0:58` (attach proof screenshot)
- Automatically adds to records history with timestamp
- Updates the LATEST tab on website
- Processes and optimizes proof images

**`!check <map>`** - View full record history
- Example: `!check pl_upward`
- Shows all records with dates
- Displays current record, proof status, category

**`!latest`** - Show 10 most recently updated maps
- Matches the LATEST tab on the website

**`!list`** - List all maps with current records

**`!setproof <map>`** - Update proof image only
- Example: `!setproof cp_cargo` (attach new screenshot)

**`!help`** - Show all commands

---

## 🎯 How It Works

1. **User posts**: `!update cp_altitude 0:58` + screenshot
2. **Bot processes**: 
   - Adds record to `records` array with current timestamp
   - Saves proof image to `Proof/` folder
   - Updates `1KU_RUN_DATA.json`
   - Creates backup in `backups/` folder
3. **Website updates**: 
   - New record appears on the right (100% opacity)
   - Older records fade left (80%, 60%, 40%, 20%)
   - Map appears in LATEST tab

---

## 🔒 Security

- Bot only works in the configured channel
- Automatic backups before each update
- Images are processed and optimized (max 1920px, 85% quality)
- All changes are logged to console

---

## 📂 File Structure

```
discord-bot/
├── bot.js           # Main bot code
├── config.js        # Your configuration (create from example)
├── config.example.js # Template
└── package.json     # Dependencies

../1KU_RUN_DATA.json # Updated by bot
../Proof/            # Proof images saved here
../backups/          # Automatic backups
```

---

## 🐛 Troubleshooting

**Bot doesn't respond:**
- Check bot token in `config.js`
- Verify channel ID is correct
- Ensure bot has permissions in Discord

**Images not uploading:**
- Check `Proof/` folder exists
- Verify bot has write permissions

**Data not saving:**
- Check `1KU_RUN_DATA.json` path is correct
- Ensure file has write permissions
- Look for errors in console

---

## 💡 Tips

- Always attach proof images when updating records
- Use exact map IDs (e.g., `cp_altitude` not "CP Altitude")
- Check existing records with `!check <map>` before updating
- Use `!latest` to see what's trending on the website

