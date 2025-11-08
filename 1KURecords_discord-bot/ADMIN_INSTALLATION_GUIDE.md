# 🤖 Discord Bot Installation Guide for Server Admins

**Setup guide for Discord server administrators installing an existing bot**

---

## 📋 What This Bot Does

This bot allows users to update TF2 speedrun records directly from Discord. Users can:
- Update records with commands like `!update cp_altitude 0:58`
- Upload proof screenshots
- View record history
- See latest updates

**The bot automatically updates the website files - no manual editing needed!**

---

## ✅ Prerequisites

Before starting, you need:
- ✅ **Node.js** installed (version 14 or higher) - [Download here](https://nodejs.org/)
- ✅ **Discord server admin permissions**
- ✅ **Access to the website files** (where the bot will save updates)
- ✅ **Bot token from the bot creator** (the person who created the bot)
- ✅ **Server access credentials** (SFTP/SSH access to the web server where the bot files are located)

**Important:** The bot files are located on a web server. You'll need to access them via **SFTP** (for file transfers) or **SSH** (for running commands). The server URL will look like `sftp://ssh.strato.de/discord-bot` - this is for server management, not a public website URL.

---

## 🚀 Installation Steps

### **Step 1: Get Required Information from Bot Creator**

You need to get these from the person who created the bot:
1. **Bot Token** - The Discord bot authentication token

##"MTQyMzY1MTYyNjg4Njg4OTQ5Mw.GveY7t.QlUWpeTU1Yq-YFts6-pVRxdIagaFHNs9h4amlU"

2. **Invite URL** - A link to invite the bot to your server (or instructions on how to create one)

##That would be your part

3. **Bot Files** - Either:
   - A zip file containing the bot folder (easiest option), OR
   - Access to the bot folder on the server (if already uploaded)
   
##  https://drive.google.com/file/d/1gk8qnz8oMftKfTsuK2Dz2Kg6G6WgffQf/view?usp=drive_link
   

**⚠️ Important: Keep the bot token secret! Never share it publicly.**

### **Step 2: Get the Channel ID**

1. In Discord, go to **Settings** → **Advanced** → Enable **"Developer Mode"**
2. Right-click the channel where the bot should work
3. Click **"Copy Channel ID"** - **SAVE THIS**

### **Step 3: Install Bot Files**

**What this step does:** This installs all the software packages (dependencies) that the bot needs to run, like the Discord library and image processing tools.

#### **Option A: Received Bot as Zip File (Easiest)**

If you received a zip file from the bot creator:

1. **Extract the zip file** to a location on your computer or server
   
2. **If working on your local computer:**
   - Extract the zip to a folder (e.g., `~/Downloads/discord-bot`)
   - Open terminal and navigate to the extracted folder:
     ```bash
     cd ~/Downloads/discord-bot
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - After configuring (Step 3.4), upload the entire `discord-bot` folder to your server via SFTP

3. **If working directly on the server:**
   - Upload the zip file to your server via SFTP
   - SSH into the server:
     ```bash
     ssh username@ssh.strato.de
     ```
   - Extract the zip file:
     ```bash
     unzip discord-bot.zip
     cd discord-bot
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

#### **Option B: Bot Files Already on Server**

If the bot files are already on the server:

1. **Connect to the server via SSH:**
   ```bash
   ssh username@ssh.strato.de
   ```
   (Replace `username` with your actual SSH username)

2. **Navigate to the bot folder on the server:**
   ```bash
   cd /path/to/website/discord-bot
   ```
   (The exact path depends on where the website files are located on the server)

3. **Install dependencies:**
   ```bash
   npm install
   ```

#### **Option C: Download from Server, Work Locally**

If you need to download the bot files from the server first:

1. **Download the bot files from the server:**
   - Use an SFTP client (like FileZilla, Cyberduck, or your FTP client)
   - Connect to `sftp://ssh.strato.de`
   - Download the `discord-bot` folder to your local computer

2. **Navigate to the local bot folder:**
   ```bash
   cd /path/to/downloaded/discord-bot
   ```

3. **Install dependencies locally:**
   ```bash
   npm install
   ```

4. **After configuring (Step 3.4), upload the files back to the server:**
   - Upload the modified `bot.js` and the new `node_modules` folder back to the server via SFTP

**What `npm install` does:** This command reads the `package.json` file in the bot folder and downloads/installs all the required software packages (like `discord.js`, `sharp`, `fs-extra`, etc.) that the bot needs to function. This may take a minute or two the first time.

**You'll know it worked when:** You see a message like "added X packages" and a new folder called `node_modules` appears in the `discord-bot` folder.

4. **Configure the bot:**

   Open `bot.js` in a text editor and find these lines (around line 17-18):
   ```javascript
   const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
   const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID || 'YOUR_CHANNEL_ID_HERE';
   ```
   
   Replace with your actual values:
   ```javascript
   const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'your_actual_bot_token_here';
   const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID || 'your_actual_channel_id_here';
   ```
   
   **⚠️ Important: Keep your bot token secret! Never commit it to version control.**
   
   **Alternative: Use Environment Variables (Recommended)**
   
   Instead of editing the file, you can set environment variables:
   ```bash
   export DISCORD_BOT_TOKEN="your_bot_token"
   export ALLOWED_CHANNEL_ID="your_channel_id"
   ```
   Then run: `npm start`

### **Step 4: Invite Bot to Server**

**Option A: If you received an invite URL from the bot creator:**
1. Open the invite URL in your browser
2. Select your server and click **"Authorize"**

**Option B: If you need to create the invite URL yourself:**
1. Ask the bot creator for access to the [Discord Developer Portal](https://discord.com/developers/applications) for this bot
2. Go to **"OAuth2"** → **"URL Generator"**
3. Select **"bot"** scope
4. Select these permissions:
   - ✅ Send Messages
   - ✅ Read Message History
   - ✅ Attach Files
   - ✅ Embed Links
5. **Copy the generated URL** and open it in your browser
6. Select your server and click **"Authorize"**

### **Step 5: Start the Bot**

**If working on the server directly (SSH):**
```bash
npm start
```

**If working locally:**
You'll need to upload the configured files to the server, then SSH into the server and run:
```bash
cd /path/to/website/discord-bot
npm start
```

**Note:** For the bot to stay running permanently, see the "Running the Bot Permanently" section below.

The bot should now be online! You should see:
- ✅ Bot appears in your Discord server (green dot)
- ✅ Console shows: "🤖 Bot is ready! Logged in as [bot name]"

### **Step 6: Test It**

In your Discord channel, type:
```
!help
```

The bot should respond with a list of commands.

---

## 🎮 Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `!help` | Show all commands | `!help` |
| `!update <map> <time>` | Update a record | `!update cp_altitude 0:58` (attach image) |
| `!check <map>` | View record history | `!check pl_upward` |
| `!latest` | Show 10 recent updates | `!latest` |
| `!list` | List all maps | `!list` |
| `!setproof <map>` | Update proof image | `!setproof cp_cargo` (attach image) |

---

## 🔧 Running the Bot Permanently

### Option 1: PM2 (Recommended for Servers)

```bash
# Install PM2 globally
npm install -g pm2

# Start the bot
cd discord-bot
pm2 start bot.js --name "tf2-records-bot"

# Save PM2 configuration
pm2 save

# Set to start on boot
pm2 startup
```

### Option 2: Screen/Tmux (Linux/Mac)

```bash
# Using screen
screen -S discord-bot
cd discord-bot
npm start
# Press Ctrl+A then D to detach

# To reattach later:
screen -r discord-bot
```

### Option 3: Windows Service

Use [NSSM](https://nssm.cc/) or Task Scheduler to run the bot as a service.

---

## 🛠️ Troubleshooting

### Bot Won't Start - "BitFieldInvalid" Error?

If you see an error like `RangeError [BitFieldInvalid]: Invalid bitfield flag or number: undefined`:

- ✅ **This has been fixed in the latest bot code** - Make sure you have the updated `bot.js` file
- ✅ The error was caused by an invalid intent (`GuildMessageAttachments` doesn't exist in discord.js v14)
- ✅ If you still see this error, check that your `bot.js` file has the correct intents (only `Guilds`, `GuildMessages`, and `MessageContent`)

### Bot Not Responding?
- ✅ Check if bot is online (green dot in Discord)
- ✅ Verify channel ID is correct in `bot.js`
- ✅ Check bot has permissions in the channel
- ✅ Make sure "Message Content Intent" is enabled in Discord Developer Portal

### Commands Not Working?
- ✅ Make sure you're in the correct channel
- ✅ Check console output for errors
- ✅ Verify bot token is correct

### Records Not Saving?
- ✅ Check file permissions (bot needs write access)
- ✅ Verify `1KU_RUN_DATA.json` path is correct
- ✅ Check console for error messages

### Images Not Uploading?
- ✅ Check `Proof/` folder exists and has write permissions
- ✅ Verify image is under 10MB
- ✅ Check image format (JPG, PNG, WebP)

---

## 📁 File Structure

```
discord-bot/
├── bot.js              # Main bot code
├── config.js           # Your configuration (create this)
├── config.example.js   # Template
├── package.json        # Dependencies
└── README.md          # Full documentation

../1KU_RUN_DATA.json    # Updated by bot
../Proof/               # Proof images saved here
../backups/             # Automatic backups
```

---

## 🔒 Security Notes

- **Keep bot token secret** - never share publicly
- **Bot only works in the configured channel** - safe by default
- **Automatic backups** - created before each update
- **All changes are logged** - check console for activity

---

## 📞 Need Help?

1. Check the console output for error messages
2. Verify all configuration is correct
3. Test with `!help` command first
4. Check Discord bot permissions in server settings

---

## ✅ Quick Checklist

- [ ] Node.js installed
- [ ] Bot token received from bot creator
- [ ] Channel ID copied
- [ ] Dependencies installed (`npm install`)
- [ ] `bot.js` configured with token and channel ID
- [ ] Bot invited to server with correct permissions
- [ ] Bot started and online
- [ ] `!help` command works

---

**Once everything is working, users can update records directly from Discord!** 🎉


