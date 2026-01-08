# 🔄 GitHub Storage Setup Guide

## Overview

This guide will help you set up **GitHub Storage** so your data syncs across all your devices automatically. Your data will be stored as JSON files in your GitHub repository and accessible from any device.

---

## ✅ Benefits of GitHub Storage

- **Cross-Device Sync**: Access your data from any device (desktop, mobile, tablet)
- **Automatic Backup**: All data backed up in your GitHub repository
- **Version History**: GitHub keeps history of all changes
- **Free**: GitHub provides free storage for public/private repositories
- **Secure**: Data stored in your private GitHub repository

---

## 📋 Step-by-Step Setup

### Step 1: Create a Personal Access Token

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens

2. **Generate New Token**
   - Click **"Generate new token"** → **"Generate new token (classic)"**

3. **Configure Token**
   - **Note**: Enter a description like "Pawn Shop Data Sync"
   - **Expiration**: Choose "No expiration" or your preferred duration
   - **Select scopes**: ✅ Check **"repo"** (Full control of private repositories)
     - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events

4. **Generate and Copy**
   - Click **"Generate token"** at the bottom
   - **⚠️ IMPORTANT**: Copy the token immediately (it won't be shown again!)
   - Token format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Configure Your App

1. **Open Your Deployed App**
   - Go to: `https://[your-username].github.io/[your-repo-name]`

2. **Click Settings Button** (⚙️)
   - Located in the top header area

3. **Select Storage Mode**
   - Choose: **"GitHub Storage (Sync Across Devices)"**

4. **Enter GitHub Details**
   - **GitHub Username/Owner**: Your GitHub username (e.g., `john-doe`)
   - **Repository Name**: Your repository name (e.g., `pawn-shop-management`)
   - **Personal Access Token**: Paste the token you copied (starts with `ghp_`)
   - **Branch**: `main` (or `master` if that's your default branch)

5. **Save Settings**
   - Click **"Save Settings"**
   - The app will automatically sync data from GitHub

### Step 3: First Sync

After saving settings:
- Click the **"🔄 Sync"** button in the header
- This will load any existing data from GitHub
- If no data exists, it will create the data files in your repository

---

## 📁 How Data is Stored

Your data is stored in your GitHub repository in a `data/` folder:

```
your-repository/
├── index.html
├── styles.css
├── app-github-storage.js
├── README.md
└── data/
    ├── customers.json         ← Customer data
    ├── loans.json            ← Loan records
    ├── payments.json         ← Payment history
    └── interest_history.json ← Interest calculations
```

---

## 🔄 How Syncing Works

### Automatic Sync
- **When you save data**: Automatically syncs to GitHub
- **When you load the app**: Uses local data (fast)
- **Click Sync button**: Manually sync from GitHub to get latest data

### Using Multiple Devices

1. **Device 1** (e.g., Desktop):
   - Make changes
   - Data automatically syncs to GitHub

2. **Device 2** (e.g., Mobile):
   - Open app
   - Click **"🔄 Sync"** to get latest data from GitHub
   - Your data from Device 1 is now available!

### Best Practice
- **Always click Sync** when opening the app on a different device
- Data is saved to GitHub automatically when you make changes
- Keep the app open on only one device at a time to avoid conflicts

---

## 🔒 Security & Privacy

### Your Token is Secure
- Stored only in your browser's localStorage
- Never sent to any server except GitHub API
- Only you have access to your token

### Data Privacy
- Data stored in **your** GitHub repository
- You own and control all data
- Can be public or private repository

### Token Permissions
The token has access to:
- Read/write files in your repositories
- This is necessary to save/load data files

---

## 🛠️ Troubleshooting

### "GitHub not configured" Error
- Make sure you've entered all fields in Settings
- Verify your token is correct (starts with `ghp_`)
- Check that storage mode is set to "GitHub Storage"

### "Failed to save to GitHub" Error
**Possible causes:**
1. **Token expired**: Create a new token
2. **Wrong repository name**: Check username/repo spelling
3. **Token permissions**: Ensure "repo" scope is checked
4. **Branch doesn't exist**: Try "main" or "master"

**Solution**: Data is automatically saved to localStorage as backup

### "Failed to load from GitHub" Error
**Possible causes:**
1. **First time setup**: No data files exist yet (this is normal!)
2. **Wrong repository**: Check your repository name
3. **Private repo without access**: Ensure token has repo access

**Solution**: Use local data or click Sync again

### Sync Conflicts
If you edit data on two devices simultaneously:
- **Last sync wins**: The most recent sync to GitHub is kept
- **Best practice**: Close app on one device before using another
- **Manual fix**: Click Sync to get latest data from GitHub

---

## 🔄 Switching Between Storage Modes

### From Local to GitHub
1. Open Settings
2. Select "GitHub Storage"
3. Enter GitHub credentials
4. Save settings
5. Your local data will be uploaded to GitHub

### From GitHub to Local
1. Open Settings
2. Select "Local Storage"
3. Save settings
4. Data remains in localStorage
5. No more syncing to GitHub

---

## 📤 Backup & Export

### Manual Backup
Your data is always in your GitHub repository:
1. Go to your repository on GitHub.com
2. Navigate to `data/` folder
3. Download any JSON file to backup

### View Data on GitHub
1. Go to: `https://github.com/[username]/[repo]/tree/main/data`
2. Click any `.json` file to view your data
3. See complete history of changes (commits)

---

## ❓ FAQs

**Q: Is my data safe?**
A: Yes! Data is stored in your private GitHub repository. Only you have access.

**Q: Can others see my data?**
A: Only if your repository is public. Use a private repository for sensitive data.

**Q: What if I lose my token?**
A: Generate a new token and update it in Settings.

**Q: Can I use this without GitHub?**
A: Yes! Choose "Local Storage" mode for browser-only storage.

**Q: How much data can I store?**
A: GitHub repositories have a soft limit of 1GB. Your app data is typically just a few KB to MB.

**Q: Does this work offline?**
A: Yes! App loads from localStorage (works offline). Sync requires internet.

**Q: Can multiple people use the same repository?**
A: Not recommended. Each person should have their own repository and token.

---

## 🆘 Need Help?

1. Check GitHub repository settings
2. Verify token has "repo" permissions
3. Try creating a new token
4. Check browser console for error messages (F12 → Console)

---

## 📝 Quick Reference

### Required Information
- GitHub Username: `your-username`
- Repository Name: `your-repo-name`
- Personal Access Token: `ghp_...` (with "repo" scope)
- Branch: `main` (or `master`)

### Token Creation Link
https://github.com/settings/tokens/new?scopes=repo&description=Pawn%20Shop%20Data%20Sync

### Your Data Location
`https://github.com/[username]/[repo]/tree/main/data`

---

**🎉 You're all set! Your data will now sync across all your devices!**