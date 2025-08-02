# TrackFit AI - Mobile Conversion Guidelines

## 🎯 Goal: Web-First, Mobile-Ready Approach

Build a web app that is:
- ✅ **Mobile-responsive**
- ✅ **Cursor/AI-compatible**
- ✅ **Easy to convert to React Native or PWA later**

## ✅ COMPULSORY INSTRUCTIONS (Web App with Mobile in Mind)

### 1. Keep Components Clean and Modular

```tsx
// ✅ DO
<Button variant="primary" onClick={handleClick}>Save</Button>

// ❌ DON'T
<button onClick={handleClick} className="text-white bg-blue-500 px-4 py-2 rounded">Save</button>
```

**Use component libraries** (shadcn/ui, lovable.dev, radix-ui) for portable UI logic.

### 2. Use TailwindCSS — Not CSS-in-JS or styled-components

✅ **Tailwind is supported on both Web and React Native** (via tailwind-rn or nativewind).

❌ **Don't use:**
- styled-components
- emotion
- Raw CSS files for layout

### 3. Avoid Browser-Only or DOM APIs

These will break on mobile/native, because React Native has no DOM.

❌ **Don't use:**
```javascript
document.getElementById()
window.location
localStorage (unless behind a safe check)
```

✅ **Use:**
```javascript
React state/context
Supabase client or async storage polyfills
```

### 4. Routing: Use Next.js or React Router, not Browser APIs

- **Web**: Use next/router or react-router-dom
- **Mobile**: You can map these routes to screens later in React Native.

### 5. Icons: Use Lucide or Heroicons

✅ **Compatible with both Web and Mobile.**

❌ **Don't use Material UI (Web-specific).**

### 6. Forms: Use React Hook Form (optional, but modular)

✅ **Works in both Web and React Native with light changes.**

```bash
npm add react-hook-form
```

### 7. State Management: Prefer Local/Context API over Redux

Cursor and GPT work better with readable code. Avoid overengineering early.

### 8. Install These Dependencies Only

```bash
# Web App Starter Stack
npm add react react-dom
npm add -D tailwindcss postcss autoprefixer
npm add lucide-react
npm add classnames
npm add react-router-dom   # or use Next.js

# Optional but helpful
npm add react-hook-form
npm add zustand            # small state manager
```

## ❌ DO NOT INSTALL

| Package | Why Avoid |
|---------|-----------|
| styled-components | Not compatible with React Native |
| Material-UI | Web-specific |
| react-bootstrap | Layout-heavy, not portable |
| jQuery/DOM manipulation | Breaks in React Native |
| chart.js (complex types) | Avoid for now, use Recharts later |

## 📁 Folder Structure for Web-to-Mobile Friendly Code

```
src/
  components/     # All reusable UI blocks
  pages/          # Route-level components
  hooks/          # Custom hooks
  api/            # Frontend-side API calls
  utils/          # Pure functions
  styles/         # Tailwind config only
```

## ⚡ Insights While Building

### ✅ DO:
- Use flex/grid + responsive classes (`sm:`, `md:`, `lg:`) with Tailwind
- Write stateless components (better for portability)
- Use AI for form validation, mobile layout simulation, responsive design tuning
- Test using Chrome DevTools mobile mode

### ❌ DON'T:
- Hardcode pixel sizes (`w-[374px]`, `h-[812px]`)
- Use localStorage unless wrapped in checks
- Use `alert()` or `prompt()` — they don't exist in mobile

## 📦 Bonus: Cursor Prompt for Mobile Conversion (when ready)

```
Convert this React + Tailwind web app into a fully working React Native app using NativeWind. Maintain the same folder structure and convert routing and input components.
```

## ✅ Summary Checklist

| Task | Done? |
|------|-------|
| Tailwind installed | ☐ |
| Use of mobile-friendly icons | ☐ |
| Avoided DOM APIs | ☐ |
| Responsive layout via Tailwind | ☐ |
| Components written modularly | ☐ |
| Cursor-compatible structure | ☐ |

## 🔄 Conversion Strategy

### Phase 1: Web Development (Current)
- Build with mobile-friendly patterns
- Use responsive design
- Avoid web-specific APIs
- Test on mobile browsers

### Phase 2: Mobile Conversion (Future)
- Use NativeWind for Tailwind in React Native
- Convert routing to React Navigation
- Adapt components to React Native
- Add mobile-specific features

## 🛠️ Technical Considerations

### Web-to-Mobile Mapping

| Web Component | Mobile Equivalent |
|---------------|-------------------|
| `<div>` | `<View>` |
| `<button>` | `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| `<img>` | `<Image>` |
| CSS Grid/Flexbox | Flexbox only |

### State Management Strategy
```typescript
// ✅ Use React Context for shared state
const AppContext = createContext();

// ✅ Use local state for component-specific data
const [localState, setLocalState] = useState();

// ❌ Avoid Redux for simple apps
// ❌ Avoid complex state management early
```

### API Strategy
```typescript
// ✅ Use fetch or axios (works on both platforms)
const api = {
  get: (url) => fetch(url),
  post: (url, data) => fetch(url, { method: 'POST', body: JSON.stringify(data) })
};

// ❌ Don't use browser-specific APIs
// localStorage, sessionStorage, etc.
```

## 📱 Mobile-Specific Features (Future)

### Camera Integration
```typescript
// Future: React Native Camera
import { Camera } from 'expo-camera';

// For food photo recognition
const takePicture = async () => {
  const photo = await camera.takePictureAsync();
  // Process image for calorie counting
};
```

### GPS/Location
```typescript
// Future: React Native Location
import * as Location from 'expo-location';

// For workout route tracking
const getLocation = async () => {
  const location = await Location.getCurrentPositionAsync({});
  // Track workout route
};
```

### Device Sensors
```typescript
// Future: React Native Sensors
import { Pedometer } from 'expo-sensors';

// For step counting
const subscribeToSteps = () => {
  Pedometer.watchStepCount(result => {
    // Update step count
  });
};
```

## 🎯 Success Metrics

### Web App Success
- ✅ Responsive on all screen sizes
- ✅ Fast loading times
- ✅ Clean, modular code
- ✅ Mobile-friendly interactions

### Mobile Conversion Success
- ✅ Same functionality as web
- ✅ Native performance
- ✅ Platform-specific features
- ✅ App store ready

## 📝 Notes for Development

### Key Principles
1. **Mobile-first thinking** even in web development
2. **Component reusability** across platforms
3. **API abstraction** for platform independence
4. **Responsive design** from the start
5. **Clean architecture** for easy conversion

### Common Pitfalls to Avoid
1. **DOM manipulation** - won't work on mobile
2. **Browser-specific APIs** - need alternatives
3. **Hardcoded layouts** - use responsive design
4. **Complex state management** - keep it simple
5. **Platform-specific libraries** - use cross-platform alternatives

---
*This file should be referenced during all development to ensure mobile-ready code*
*Last Updated: [Current Date]*
*Project: TrackFit AI - Fitness Tracking Application* 