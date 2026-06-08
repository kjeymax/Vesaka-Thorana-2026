# Vesak Thorana - Interactive Digital Pandal

An immersive desktop application celebrating the Sri Lankan Vesak festival with an interactive digital Thorana (pandal). Built with Next.js 16, Electron, and Firebase for real-time global synchronization.

## Features

### 🎨 Interactive Pandal Canvas
- Animated light patterns with multiple modes (sequential, random, wave, spiral)
- Audio-reactive visualizations using Web Audio API
- Customizable light colors and patterns
- Fireworks launch on demand
- Performance mode for mobile/low-end devices

### 🔊 Audio Experience
- 10-track playlist including:
  - Traditional Bodu Bathi Gee (Instrumental)
  - Narasinha Gatha Chanting
  - Metta Sutta (Parts 1 & 2)
  - Relaxation chants
  - Vesak/Poson remixes
  - Seth Piritha (Parts 1 & 2)
- Background audio with volume control and mute
- Audio ducking when story modals open
- Auto-play next track on completion

### 📖 Cultural Content
- **Jataka Stories** - Interactive story panels with audio narration
- **Quiz Mode** - Test your knowledge of Vesak traditions
- **Cultural Guide** - Learn about Thorana history and symbolism
- **Bilingual Support** - Sinhala (සිංහල) and English

### 🌐 Real-time Global Features (Firebase)
- **Pin Potha** - Global message board for devotees worldwide
- **Live Counters** - Synchronized lamp (450+) and lotus (180+) counts across all users
- **Real-time Sync** - Instant updates without page refresh

### 🎁 Sharing & Customization
- **E-Card Generator** - Capture pandal screenshot and send personalized Vesak greetings
- **Custom Light Editor** - Design your own color schemes
- **Screenshot Capture** - Save/share your pandal view
- **Fullscreen Mode** - Immersive borderless experience

### 🖥️ Desktop Application
- Native Windows installer (NSIS, ~542 MB)
- Auto-starts Next.js production server internally
- Desktop shortcuts (Start Menu + Desktop)
- Custom install directory support
- Offline-capable after first launch

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS 4 |
| Animations | Framer Motion, Canvas API |
| Audio | Web Audio API (AnalyserNode) |
| Desktop | Electron 42, electron-builder (NSIS) |
| Backend | Firebase Realtime Database |
| Language | TypeScript-ready (JS with JSDoc) |

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Windows 10/11 (for .exe build)

### Development

```bash
# Install dependencies
npm install

# Run Next.js dev server (web)
npm run dev

# Run Electron + Next.js together (desktop dev)
npm run electron:dev
```

### Build Desktop Installer

```bash
# Build Next.js production bundle + create NSIS installer
npm run dist

# Output: dist-electron/Vesak Thorana-Setup-0.1.0.exe
```

### Build Unpacked (for testing)

```bash
npm run electron:dir
# Output: dist-electron/win-unpacked/Vesak Thorana.exe
```

## Project Structure

```
next-pandal/
├── electron/
│   ├── main.js          # Electron main process (starts Next.js server)
│   └── preload.js       # Secure IPC bridge
├── src/
│   ├── app/
│   │   ├── page.js      # Main pandal experience
│   │   ├── layout.js    # Root layout + metadata
│   │   └── globals.css  # Global styles
│   ├── components/
│   │   ├── PandalCanvas.jsx       # Core canvas animation
│   │   ├── VesakConsole.jsx       # Control panel UI
│   │   ├── StoryModal.jsx         # Jataka stories
│   │   ├── QuizModal.jsx          # Interactive quiz
│   │   ├── PinPothaModal.jsx      # Global message board
│   │   ├── ECardModal.jsx         # Greeting card generator
│   │   ├── CustomLightModal.jsx   # Light color editor
│   │   ├── CulturalGuideModal.jsx # Info guide
│   │   ├── IntroScreen.jsx        # Splash animation
│   │   ├── Marquee.jsx            # Message ticker
│   │   ├── UnifiedPreloader.jsx   # Asset preloader
│   │   └── VesakConsole.jsx       # Main control UI
│   └── lib/
│       ├── firebase.js            # Firebase config + helpers
│       └── thoranaEngine.js       # Canvas animation logic
├── public/
│   ├── Audio/          # 10 soundtrack files (~200MB)
│   ├── Fonts/          # Noto Sans Sinhala
│   └── Images/         # Textures, backgrounds
├── build/
│   └── icon.ico        # Multi-res Windows icon (16/32/48/256)
├── package.json
└── next.config.mjs     # PWA disabled, webpack mode
```

## Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Realtime Database
3. Copy config to `src/lib/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### Audio Files
Place MP3 files in `public/Audio/` matching the playlist in `src/app/page.js`:
- `Bodu Bathi Gee.mp3`
- `Narasinha Gatha.mp3`
- `The Chant of Metta Part 1.mp3`
- `The Chant of Metta Part 2.mp3`
- `Relaxation From The Far East Part 1.mp3`
- `Relaxation From The Far East Part 2.mp3`
- `Poson Mushup 2024 (DNBeats Remix).mp3`
- `Vesak Special Mashup Remix 2025.mp3`
- `Seth Piritha Part 1.mp3`
- `Seth Piritha Part 2.mp3`

## How It Works

### Electron + Next.js Integration
The Electron main process (`electron/main.js`):
1. Finds a free localhost port
2. Spawns a Next.js production server (`next.start`) programmatically
3. Waits for server readiness
4. Opens a `BrowserWindow` loading `http://127.0.0.1:PORT`
5. Handles cleanup on quit

This avoids static export limitations while keeping a native desktop feel.

### Real-time Sync (Firebase)
- **Pin Potha**: Listeners on `pinpotha_messages` path, sorted by timestamp
- **Counters**: Atomic `increment()` on `counters/lamps` and `counters/lotuses`
- Fallback to local state if Firebase unavailable

### Canvas Animation
`thoranaEngine.js` drives a requestAnimationFrame loop with:
- Multiple pattern algorithms (sequential, wave, spiral, random)
- Audio frequency analysis (bass/mid bands) for beat-reactive effects
- Particle systems for lamps, lotuses, fireworks
- Performance scaling (reduced particle count in performance mode)

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (port 3000) |
| `npm run build` | Next.js production build |
| `npm run start` | Start built Next.js server |
| `npm run lint` | ESLint check |
| `npm run electron:dev` | Electron + Next.js dev (concurrent) |
| `npm run electron:build` | Build + package unpacked dir |
| `npm run electron:dir` | Same as above, no installer |
| `npm run dist` | **Full NSIS installer build** |

## Building for Distribution

```bash
# 1. Ensure all audio files in public/Audio/
# 2. Verify Firebase config in src/lib/firebase.js
# 3. Build installer
npm run dist

# Output: dist-electron/Vesak Thorana-Setup-0.1.0.exe
```

The installer includes:
- Electron runtime + Chromium
- Next.js server bundle (.next/)
- All production node_modules
- Audio assets, fonts, images
- Multi-resolution app icon

## Known Limitations

- Windows x64 only (NSIS target)
- Large installer (~542 MB) due to bundled Node.js + Chromium + audio
- Requires internet for Firebase sync (works offline locally)
- Audio auto-play requires user interaction (browser policy)

## License

MIT License - See [LICENSE](LICENSE) for details.

## Credits

**Developed by:** [Brainstorm.lk](https://brainstorm.lk) (EduTechMinds.com)

**Audio Sources:**
- Traditional Pirith chanting (various venerable monks)
- Bodu Bathi Gee instrumental
- DNBeats / DJ Remix (Poson & Vesak mashups)

**Tech Acknowledgements:**
- Next.js team for App Router
- Electron / electron-builder maintainers
- Firebase for real-time backend
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling

---

**Suba Vesak!** 🕊️ සුබ වෙසක්!