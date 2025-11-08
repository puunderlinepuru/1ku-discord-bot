# 🤖 Discord Bot - Quick Reference for Admins

**One-page summary for server administrators**

---

## 📋 What You Need

1. **Node.js** installed ([Download](https://nodejs.org/))
2. **Discord server admin** permissions
3. **Access to website files** (where bot saves updates)
4. **Bot token from bot creator**

---

## ⚡ Quick Setup (5 Steps)

### 1. Get Bot Token
- Get bot token from the bot creator
- Keep it secret!

### 2. Get Channel ID
- Discord Settings → Advanced → Enable Developer Mode
- Right-click channel → Copy Channel ID

### 3. Install & Configure
```bash
cd discord-bot
npm install
```

Edit `bot.js` line 17-18:
```javascript
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || 'your_bot_token';
const ALLOWED_CHANNEL_ID = process.env.ALLOWED_CHANNEL_ID || 'your_channel_id';
```

**Or use environment variables:**
```bash
export DISCORD_BOT_TOKEN="your_bot_token"
export ALLOWED_CHANNEL_ID="your_channel_id"
```

### 4. Invite Bot
- Use invite URL from bot creator, OR
- Developer Portal → OAuth2 → URL Generator
- Select: **bot** scope
- Permissions: Send Messages, Read Message History, Attach Files
- Copy URL → Open → Authorize

### 5. Start Bot
```bash
npm start
```

Test: Type `!help` in Discord channel

---

## 🎮 Commands

| Command | Example |
|---------|---------|
| `!help` | Show commands |
| `!update <map> <time>` | `!update cp_altitude 0:58` (attach image) |
| `!check <map>` | `!check pl_upward` |
| `!latest` | Show 10 recent updates |
| `!list` | List all maps |

---

## 🔧 Keep Running

**PM2 (Recommended):**
```bash
npm install -g pm2
pm2 start bot.js --name "tf2-records-bot"
pm2 save
pm2 startup
```

---

## 🛠️ Troubleshooting

- **Not responding?** Check bot is online (green dot)
- **Wrong channel?** Verify channel ID in `bot.js`
- **No permissions?** Re-invite bot with correct permissions
- **Not saving?** Check file permissions for `1KU_RUN_DATA.json`

---

## 📖 Full Guide

See `ADMIN_INSTALLATION_GUIDE.md` for detailed instructions.

---

**Questions?** Check console output for error messages.

