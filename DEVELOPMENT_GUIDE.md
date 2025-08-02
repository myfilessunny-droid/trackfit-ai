# TrackFit AI - Development Guide

## 🎯 Project Overview
- **Type**: Vite-based React web application
- **Goal**: Fitness tracking web app → Mobile app conversion
- **Current Status**: Web app running on localhost:8080

## 📁 Project Structure
```
trackfit-ai/
├── src/
│   ├── components/     # React components
│   ├── pages/         # App pages
│   └── styles/        # CSS/Tailwind
├── package.json       # Vite configuration
└── vite.config.ts     # Web bundler
```

## 🚀 Quick Start Commands

### Web Development
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Access web app
# http://localhost:8080/
```

### Troubleshooting
```bash
# If files are locked (EBUSY error)
taskkill /f /im node.exe
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps

# If expo errors occur (wrong project type)
# This is a VITE project, not Expo
# Use npm run dev, not npx expo start
```

## 🔧 Development Setup

### Environment Variables
```powershell
# Add Android SDK to PATH (if using emulator)
$env:Path += ";C:\Users\shrav\AppData\Local\Android\Sdk\platform-tools;C:\Users\shrav\AppData\Local\Android\Sdk\emulator"
```

### Dependencies
- **Vite**: Web bundler
- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library

## 📱 Mobile Conversion Plan

### Phase 1: Web App (Current)
- ✅ Build core features
- ✅ Test in browser
- ✅ Optimize performance
- ✅ Deploy to web

### Phase 2: Mobile App (Future)
- Create Expo project
- Copy and convert components
- Add mobile-specific features
- Test on emulator/device
- Deploy to app stores

### Conversion Strategy
```bash
# Create new Expo project
npx create-expo-app@latest trackfit-mobile --template blank-typescript

# Install mobile dependencies
npm install @react-navigation/native
npm install react-native-screens
npm install react-native-safe-area-context
```

## 🛠️ Common Issues & Solutions

### Issue 1: EBUSY Error
**Problem**: Files locked by Node processes
**Solution**: 
```bash
taskkill /f /im node.exe
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps
```

### Issue 2: Expo AppEntry Error
**Problem**: Trying to run Expo on Vite project
**Solution**: Use `npm run dev` for web, not `npx expo start`

### Issue 3: Missing "dev" script
**Problem**: Wrong directory
**Solution**: Navigate to `trackfit-ai/` directory

## 🎯 Development Workflow

### Web Development
1. Code in React/TypeScript
2. Test in browser (localhost:8080)
3. Debug with browser dev tools
4. Deploy to web

### Mobile Development (Future)
1. Code in React Native/TypeScript
2. Test on emulator/phone
3. Debug with React Native debugger
4. Deploy to app stores

## 📊 Project Status

### Completed ✅
- Web app setup
- Dependencies installed
- Development server running
- Basic project structure

### In Progress 🔄
- Web app feature development
- Component creation
- UI/UX implementation

### Planned 📋
- Mobile app conversion
- Mobile-specific features
- App store deployment

## 💡 Best Practices

### Code Organization
- Keep components modular
- Use TypeScript for type safety
- Follow React best practices
- Maintain clean code structure

### Testing Strategy
- Test web features thoroughly
- Validate user flows
- Optimize performance
- Get user feedback

### Deployment Strategy
- Web first, mobile second
- Validate ideas quickly
- Iterate based on feedback
- Scale gradually

## 🔗 Useful Resources

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tools
- Browser Dev Tools
- React Developer Tools
- TypeScript Compiler
- Vite Dev Server

## 📝 Notes
- This is a VITE project, not Expo
- Use `npm run dev` for web development
- Web app runs on localhost:8080
- Mobile conversion planned for future
- Keep this guide updated as project evolves

---
*Last Updated: [Current Date]*
*Project: TrackFit AI - Fitness Tracking Application* 