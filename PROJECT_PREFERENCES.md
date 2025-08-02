# TrackFit AI - Project Preferences & Approach

## 👤 Developer Preferences

### Communication Style
- **Preference**: Direct, step-by-step explanations
- **Detail Level**: Comprehensive with explanations of WHY
- **Format**: Use emojis and clear sections for easy reading
- **Error Handling**: Always explain what went wrong and how to fix it

### Development Approach
- **Strategy**: Web-first, then mobile conversion
- **Testing**: Browser debugging preferred over emulator initially
- **Documentation**: Create persistent files for future reference
- **Troubleshooting**: Clean install approach when dependencies break

## 🎯 Project Strategy

### Current Phase: Web Development
- **Goal**: Build functional web app first
- **Testing**: Browser-based debugging
- **Deployment**: Web deployment for validation
- **User Feedback**: Get feedback before mobile conversion

### Future Phase: Mobile Conversion
- **Approach**: Convert web components to React Native
- **Testing**: Emulator + physical device testing
- **Deployment**: App store deployment

## 🛠️ Technical Preferences

### Development Environment
- **Framework**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Package Manager**: npm with --legacy-peer-deps
- **Port**: 8080 (web development)

### Error Resolution Strategy
1. **First**: Check if in correct directory
2. **Second**: Kill Node processes if files locked
3. **Third**: Clean install with --legacy-peer-deps
4. **Fourth**: Check project type (Vite vs Expo)

### Common Commands (User's Preferred)
```bash
# Start development
cd trackfit-ai
npm run dev

# Clean install when issues
taskkill /f /im node.exe
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps

# Check project status
npm run dev
```

## 📁 File Organization Preferences

### Documentation Files
- **DEVELOPMENT_GUIDE.md**: Comprehensive setup and workflow
- **QUICK_REFERENCE.md**: Essential commands and fixes
- **PROJECT_PREFERENCES.md**: This file - user preferences
- **README.md**: Project overview

### Code Organization
- **Components**: Modular, reusable
- **Pages**: Feature-based organization
- **Styles**: Tailwind-first approach
- **Types**: TypeScript for type safety

## 🔄 Workflow Preferences

### Development Process
1. **Plan**: Explain the approach first
2. **Implement**: Step-by-step with explanations
3. **Test**: Browser testing preferred
4. **Document**: Update relevant files
5. **Iterate**: Based on feedback

### Problem-Solving Approach
1. **Identify**: What's the actual issue?
2. **Explain**: Why did this happen?
3. **Solve**: Step-by-step solution
4. **Prevent**: How to avoid in future
5. **Document**: Add to reference files

## 🎨 UI/UX Preferences

### Design Approach
- **Style**: Modern, clean interface
- **Framework**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Responsive**: Mobile-first design
- **Accessibility**: Consider from start

### Component Preferences
- **Reusable**: Modular components
- **TypeScript**: Strong typing
- **Props**: Well-defined interfaces
- **Styling**: Tailwind classes
- **State**: React hooks

## 📱 Mobile Conversion Strategy

### Conversion Priorities
1. **Core Features**: Essential functionality first
2. **UI Adaptation**: Web → Mobile components
3. **Mobile Features**: Camera, GPS, sensors
4. **Performance**: Mobile optimization
5. **Testing**: Real device testing

### Component Conversion Strategy
```typescript
// Web Component (Current)
<div className="bg-blue-500 p-4 rounded">
  <h1 className="text-white">Title</h1>
</div>

// Mobile Component (Future)
<View style={styles.container}>
  <Text style={styles.title}>Title</Text>
</View>
```

### 📋 Mobile Conversion Guidelines
**Reference `MOBILE_CONVERSION_GUIDELINES.md` for detailed instructions on:**
- ✅ **DO's and DON'Ts** for mobile-ready code
- ✅ **Component libraries** to use (shadcn/ui, radix-ui)
- ✅ **Avoiding DOM APIs** that break on mobile
- ✅ **TailwindCSS** for cross-platform styling
- ✅ **Folder structure** for easy conversion
- ✅ **Dependencies** to install/avoid

## 🚀 Deployment Strategy

### Web Deployment
- **Platform**: Vercel/Netlify preferred
- **Domain**: Custom domain when ready
- **Environment**: Production build
- **Monitoring**: Performance tracking

### Mobile Deployment
- **Platform**: Expo managed workflow
- **Stores**: App Store + Google Play
- **Testing**: Internal testing first
- **Release**: Gradual rollout

## 🔧 Troubleshooting Preferences

### Error Handling Priority
1. **File System**: EBUSY, locked files
2. **Dependencies**: Version conflicts
3. **Project Type**: Vite vs Expo confusion
4. **Port Conflicts**: Port already in use
5. **Environment**: PATH, Node version

### Preferred Solutions
```bash
# File locks
taskkill /f /im node.exe

# Dependencies
npm install --legacy-peer-deps

# Wrong project type
# Use npm run dev for Vite, not npx expo start

# Port conflicts
# Change port or kill process
```

## 📊 Project Status Tracking

### Current Status
- ✅ **Web App**: Running on localhost:8080
- ✅ **Dependencies**: Installed with --legacy-peer-deps
- ✅ **Documentation**: Comprehensive guides created
- 🔄 **Features**: In development
- 📋 **Mobile**: Planned for future

### Success Metrics
- **Web App**: Functional and responsive
- **User Experience**: Smooth interactions
- **Performance**: Fast loading times
- **Code Quality**: Clean, maintainable
- **Documentation**: Up-to-date guides

## 💡 Learning Preferences

### Documentation Style
- **Format**: Markdown with clear sections
- **Examples**: Code snippets with explanations
- **Visuals**: Emojis and formatting for clarity
- **Structure**: Logical flow from basic to advanced

### Problem-Solving Style
- **Root Cause**: Explain why issues occur
- **Step-by-Step**: Clear solution process
- **Prevention**: How to avoid future issues
- **Reference**: Add to documentation files

## 🔄 Session Continuity

### What to Remember
- **Project Type**: Vite React web app (not Expo)
- **Commands**: npm run dev, not npx expo start
- **Port**: 8080 for web development
- **Approach**: Web-first, mobile later
- **Documentation**: Always update reference files

### Session Start Checklist
1. **Check Project Type**: Confirm Vite vs Expo
2. **Verify Commands**: Use correct start command
3. **Check Documentation**: Reference existing guides
4. **Confirm Approach**: Web-first development
5. **Update Files**: Keep documentation current

## 📝 Notes for Future Sessions

### Key Reminders
- This is a **Vite React web app**, not Expo
- Use **npm run dev** for development
- Access at **http://localhost:8080/**
- **Web-first approach** before mobile conversion
- **Documentation files** contain all instructions
- **Clean install** when dependencies break

### User's Preferred Workflow
1. **Explain the plan** before implementing
2. **Step-by-step** with explanations
3. **Document** changes in reference files
4. **Test** in browser first
5. **Iterate** based on feedback

---
*This file should be updated as preferences evolve*
*Last Updated: [Current Date]*
*Project: TrackFit AI - Fitness Tracking Application* 