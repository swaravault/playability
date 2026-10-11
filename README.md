# PlayAbility

> Build apps for **Web, Android, iOS, macOS, and Windows** from a single shared codebase.

A production-ready starter template built with **React 19 + Vite 6 + Tailwind CSS 4**. Clone this repo, customize `app.config.json`, and start building your app — all platforms share the same `src/` code.

---

## ✨ What's Included

### Tech Stack
| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 19 |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **State Management** | Zustand 5 (with localStorage persistence) |
| **Mobile** | Capacitor 7 (Android + iOS) |
| **Desktop** | Electron 30 (macOS + Windows) |
| **Linting** | ESLint 9 + Prettier |

### Built-in Components
| Component | Description |
|-----------|-------------|
| `Button` | Primary/secondary/danger/ghost variants, sizes, loading state |
| `Modal` | Backdrop, close on Escape, focus management, size variants |
| `Toast` | Context-based notifications (success/error/warning/info) with auto-dismiss |
| `Loading` | Spinner with optional message, full-page or inline |
| `ErrorBoundary` | Catches crashes, shows fallback UI, "Try Again" button |
| `AppLayout` | Responsive nav header with mobile bottom nav |
| `NotFound` | 404 page for unknown routes |

### Built-in Utilities
| Utility | Description |
|---------|-------------|
| `api.js` | Fetch wrapper — GET/POST/PUT/PATCH/DELETE with error handling |
| `storage.js` | localStorage abstraction with namespacing and JSON serialization |
| `validation.js` | Form validation — email, required, minLength, URL, range, compose |
| `format.js` | Date (relative/short/long), number, currency, file size, truncate, slugify |
| `platform.js` | Platform detection — `isMobile()`, `isDesktop()`, `isWeb()` |

### Built-in Hooks
| Hook | Description |
|------|-------------|
| `useLocalStorage` | Sync React state with localStorage |
| `useMediaQuery` | Reactive CSS media query matching |
| `useDebounce` | Debounce rapidly changing values |

### Built-in Pages
| Page | Description |
|------|-------------|
| `Dashboard` | Main landing page (customize this) |
| `Settings` | Theme toggle + About section (developer info, app version, platform) |
| `NotFound` | 404 page |

### Auto-Versioning
Version is automatically generated from the build date: `(YEAR-2025).(MONTH).(DAY)`
- Example: Building on **11-Oct-2026** → version **1.10.11**
- No manual version bumping needed

---

## 🚀 Quick Start

### Step 1: Install Prerequisites

#### Required Packages (All Platforms)

| Package | Version | macOS Install | Windows Install |
|---------|---------|---------------|-----------------|
| **Node.js** | 18+ | `brew install node` | [nodejs.org](https://nodejs.org) |
| **npm** | 9+ | *(comes with Node.js)* | *(comes with Node.js)* |
| **Python** | 3.8+ | `brew install python` | [python.org](https://python.org) *(check "Add to PATH")* |
| **Git** | any | `brew install git` | [git-scm.com](https://git-scm.com) |

> **macOS:** Install [Homebrew](https://brew.sh) first if you don't have it:
> ```bash
> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
> ```

#### Platform-Specific Packages

| Target Platform | Additional Packages | macOS Install | Windows Install |
|----------------|---------------------|---------------|-----------------|
| **Web** | *None* | — | — |
| **Android** | Android Studio, JDK 17+ | [developer.android.com/studio](https://developer.android.com/studio) | Same |
| **iOS** | Xcode 15+, CocoaPods | App Store + `brew install cocoapods` | ❌ *macOS only* |
| **macOS Desktop** | *None* (Electron via npm) | — | ❌ *macOS only* |
| **Windows Desktop** | *None* (Electron via npm) | ❌ *Windows only* | — |

#### Post-Install Setup

<details>
<summary><strong>🍎 macOS — Additional Setup Steps</strong></summary>

**Verify installations:**
```bash
node --version    # Should be 18+
npm --version     # Should be 9+
python3 --version # Should be 3.8+
```

**For Android — Set JAVA_HOME** (add to `~/.zshrc`):
```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"

# Accept Android SDK licenses
~/Library/Android/sdk/tools/bin/sdkmanager --licenses
```

**For iOS — Set Xcode CLI tools:**
```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
```

</details>

<details>
<summary><strong>🪟 Windows — Additional Setup Steps</strong></summary>

**Verify installations:**
```powershell
node --version    # Should be 18+
npm --version     # Should be 9+
python --version  # Should be 3.8+
```

**For Android — Set JAVA_HOME** (System Environment Variables):
```
Variable: JAVA_HOME
Value:    C:\Program Files\Android\Android Studio\jbr
```

**Accept Android SDK licenses:**
```powershell
%LOCALAPPDATA%\Android\Sdk\tools\bin\sdkmanager --licenses
```

> **Note:** Use `python build.py` instead of `./build.py` on Windows.

</details>

### Step 2: Clone and Configure

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_APP_NAME.git
cd YOUR_APP_NAME

# Edit app.config.json with your app details
# Change: name, displayName, description, bundleId, developer info
```

### Step 3: Setup and Run

```bash
# Install root dependencies
npm install

# Setup your target platform
./build.py web:setup        # Web
./build.py android:setup    # Android
./build.py ios:setup        # iOS (macOS only)
./build.py mac:setup        # macOS Desktop
./build.py win:setup        # Windows Desktop

# Start development
./build.py web:dev          # Web → http://localhost:5173
./build.py mac:dev          # macOS Electron app
./build.py win:dev          # Windows Electron app
./build.py android:live     # Android with live reload
./build.py ios:live         # iOS with live reload
```

> **Windows users:** Use `python build.py` instead of `./build.py`

---

## 📁 Project Structure

```
your-app/
├── app.config.json          # 🔧 App configuration (name, version, identifiers)
├── build.py                 # 🔨 Unified build script for all platforms
├── package.json             # 📦 Root dependencies (shared across platforms)
├── eslint.config.js         # ✅ ESLint configuration
├── .prettierrc              # 🎨 Prettier formatting rules
├── .clinerules              # 🤖 AI agent coding conventions
│
├── src/                     # 🔗 SHARED SOURCE — all platforms import from here
│   ├── App.jsx              # Main app (routes + error boundary)
│   ├── main.jsx             # Web entry point
│   ├── index.css            # Base styles & theme variables
│   ├── components/
│   │   ├── ui/              # Button, Modal, Toast, Loading
│   │   ├── layout/          # AppLayout, ErrorBoundary
│   │   └── features/        # Your feature components go here
│   ├── pages/               # Dashboard, Settings, NotFound
│   ├── store/               # Zustand stores (useAppStore)
│   ├── hooks/               # useLocalStorage, useMediaQuery, useDebounce
│   ├── context/             # ThemeContext
│   ├── config/              # app.js, constants.js, env.js
│   └── utils/               # api, storage, validation, format, platform
│
├── public/                  # Shared static assets (favicon, logos)
├── docs/                    # App development guide
│
├── app-web/                 # 🌐 Web platform (BrowserRouter)
├── app-android/             # 📱 Android (Capacitor + MemoryRouter)
├── app-ios/                 # 🍎 iOS (Capacitor + MemoryRouter)
├── app-macos/               # 🖥️ macOS (Electron + HashRouter)
└── app-windows/             # 🪟 Windows (Electron + HashRouter)
```

**Key concept:** Edit files in `src/` once → changes reflect in all platforms.

---

## 🔨 Build Commands

| Command | Description |
|---------|-------------|
| **Web** | |
| `./build.py web:setup` | Install dependencies |
| `./build.py web:dev` | Start dev server (http://localhost:5173) |
| `./build.py web:build` | Production build → `app-web/dist/` |
| **Android** | |
| `./build.py android:setup` | Install deps + init Capacitor |
| `./build.py android:run` | Build + run on device/emulator |
| `./build.py android:live` | Live reload on device |
| `./build.py android:apk` | Build debug APK |
| `./build.py android:studio` | Open in Android Studio |
| **iOS** (macOS only) | |
| `./build.py ios:setup` | Install deps + init Capacitor |
| `./build.py ios:run` | Build + run on simulator |
| `./build.py ios:live` | Live reload on simulator |
| `./build.py ios:xcode` | Open in Xcode |
| **macOS Desktop** | |
| `./build.py mac:setup` | Install dependencies |
| `./build.py mac:dev` | Start Electron dev |
| `./build.py mac:dmg` | Build DMG installer |
| **Windows Desktop** | |
| `./build.py win:setup` | Install dependencies |
| `./build.py win:dev` | Start Electron dev |
| `./build.py win:nsis` | Build NSIS installer |

---

## ⚙️ Configuration

### app.config.json

The central configuration file — edit this first after cloning:

```json
{
  "app": {
    "name": "YourApp",
    "displayName": "Your Application",
    "description": "What your app does"
  },
  "developer": {
    "name": "Your Name",
    "email": "you@example.com",
    "message": "Comments welcome!"
  },
  "identifiers": {
    "bundleId": "com.yourcompany.yourapp",
    "androidPackage": "com.yourcompany.yourapp"
  }
}
```

### Environment Variables

Each platform has a `.env.example` file. Copy it to `.env` and fill in your values:

```bash
cp app-web/.env.example app-web/.env
```

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth (if using auth) |
| `VITE_GEMINI_API_KEY` | Gemini AI (if using AI features) |

---

## 🧑‍💻 Building Your App

### Adding a New Page

1. Create `src/pages/MyPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   import MyPage from './pages/MyPage';
   // Inside <Routes>:
   <Route path="/my-page" element={<MyPage />} />
   ```
3. Add to `src/config/constants.js`:
   ```javascript
   export const ROUTES = {
     // ...existing routes
     MY_PAGE: '/my-page',
   };
   ```

### Using Built-in Components

```jsx
import { Button, Modal, Loading, useToast } from '@/components/ui';

function MyFeature() {
  const { addToast } = useToast();

  const handleSave = () => {
    addToast({ type: 'success', message: 'Saved!' });
  };

  return (
    <Button variant="primary" onClick={handleSave}>
      Save
    </Button>
  );
}
```

### Using the Store

```javascript
import { useAppStore } from '@/store/useAppStore';

function MyComponent() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  // ...
}
```

### Using Utilities

```javascript
import api from '@/utils/api';
import { formatDate, formatCurrency } from '@/utils/format';
import { validateEmail } from '@/utils/validation';
import storage from '@/utils/storage';
```

---

## 🔧 Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| "Invalid hook call" / duplicate React | Ensure `dedupe` is in `vite.config` — already configured |
| Tailwind classes not applying | Add `@source "../../src"` in platform's `index.css` |
| `ELECTRON_RUN_AS_NODE` error | Use `./build.py mac:dev` instead of `npm run dev` |
| Android: "JAVA_HOME not set" | Set `JAVA_HOME` to Android Studio's JBR path |
| iOS: "CocoaPods not installed" | Run `brew install cocoapods` |
| iOS: "xcodebuild requires Xcode" | Install Xcode from App Store, then `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` |
| Electron binary not found | Run `node node_modules/electron/install.js` in the platform directory |

### Debug Checklist

1. ✅ Dependencies installed? → `./build.py {platform}:setup`
2. ✅ `.env` configured? → Copy from `.env.example`
3. ✅ Public assets copied? → Check `{platform}/public/`
4. ✅ Correct Node.js version? → `node --version` (need 18+)
5. ✅ Python available? → `python3 --version` (need 3.8+)

---

## 📚 Documentation

| Document | Location | Description |
|----------|----------|-------------|
| **App Guide** | `docs/app-guide.md` | Architecture, component APIs, hooks, utilities |
| **AI Rules** | `.clinerules` | Coding conventions for AI agents |

---

## 📄 License

MIT
