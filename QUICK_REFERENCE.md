# TrackFit AI - Quick Reference

## 🚀 Essential Commands

### Start Development
```bash
cd trackfit-ai
npm run dev
# Access: http://localhost:8080/
```

### Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Clean & Reinstall
```bash
taskkill /f /im node.exe
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
```

## 🛠️ Troubleshooting

### Common Errors & Solutions

| Error | Solution |
|-------|----------|
| `EBUSY: resource busy` | Kill Node processes, clean install |
| `expo/AppEntry not found` | Use `npm run dev`, not `npx expo start` |
| `Missing script: "dev"` | Navigate to `trackfit-ai/` directory |
| Port 8080 in use | Use different port or kill process |

### Quick Fixes
```bash
# If server won't start
npm run dev

# If dependencies broken
npm install --legacy-peer-deps

# If files locked
taskkill /f /im node.exe
```

## 📁 Project Info
- **Type**: Vite React Web App
- **Port**: 8080
- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui

## 🔗 Quick Links
- **Web App**: http://localhost:8080/
- **Documentation**: DEVELOPMENT_GUIDE.md
- **Package.json**: trackfit-ai/package.json

---
*Keep this file updated with new commands and solutions* 