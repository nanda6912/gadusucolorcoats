# GADUSU Proxy Server for Vercel Deployment

## 📁 Directory Structure

```
gadusu-proxy/
├── package.json                    # Vercel deployment configuration
├── vercel-proxy-server.js          # Main proxy server file
├── README.md                      # Deployment instructions
└── .gitignore                    # Git ignore file
```

## 🚀 Deployment Steps

### 1. Create GitHub Repository
1. Go to https://github.com
2. Click "+" → "New repository"
3. Repository name: `gadusu-proxy`
4. Description: `Proxy server for GADUSU website Google Sheets integration`
5. Click "Create repository"

### 2. Upload Files
1. In the new repository, click "Add file" → "Upload files"
2. Upload these files:
   - `package.json`
   - `vercel-proxy-server.js`
3. Commit message: "Initial proxy server deployment"
4. Click "Commit changes"

### 3. Deploy to Vercel
1. Go to https://vercel.com
2. Sign up/login with GitHub account
3. Click "Add New Project"
4. Click "Import Git Repository"
5. Search and select `gadusu-proxy`
6. Click "Import"
7. Vercel will auto-detect Node.js project
8. Click "Deploy"
9. Wait 1-2 minutes
10. Get your URL: `https://gadusu-proxy.vercel.app`

### 4. Update Website Configuration
1. Open `google-sheets-config.js` in your main project
2. Update line 4:
   ```javascript
   // From:
   PROXY_URL: 'http://localhost:3001/api/google-sheets',
   // To:
   PROXY_URL: 'https://gadusu-proxy.vercel.app/api/google-sheets',
   ```
3. Save and commit changes

### 5. Test Integration
1. Deploy main website to GitHub Pages
2. Visit your live site
3. Fill and submit appointment form
4. Check Google Sheet for new entry

## 🔧 Configuration Details

### Package.json
- Name: gadusu-proxy
- Main: vercel-proxy-server.js
- Start script: node vercel-proxy-server.js
- Dependencies: express, cors, node-fetch

### Proxy Server
- Port: 3001 (or Vercel's PORT)
- Endpoint: /api/google-sheets
- CORS: Enabled
- Target: Google Apps Script

## 🎯 Expected Result

After deployment:
- ✅ Proxy server running on Vercel
- ✅ GitHub Pages can access proxy
- ✅ Google Sheets integration works on live site
- ✅ Form submissions saved to Google Sheet
