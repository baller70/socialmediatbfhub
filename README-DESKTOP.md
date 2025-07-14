
# 🖥️ Multi-App Social Dashboard - Desktop Edition

A powerful desktop application that transforms your web dashboard into a multi-panel workspace similar to Rambox or LiftOS, built with Electron and React.

## ✨ Features

### 🎯 Core Desktop Features
- **WebView Panels**: Isolated web contexts with persistent sessions
- **Dynamic Grid Layouts**: 1×1, 2×1, 2×2, 3×2, and 3×3 configurations
- **Persistent Sessions**: Cookies and local storage persist across app restarts
- **Panel Management**: Drag to reorder, add/remove panels dynamically
- **Desktop Integration**: Native window controls and system integration

### 🔧 Technical Features
- **Dual Mode Support**: Web mode (iframes) and Desktop mode (webviews)
- **Smart Mode Detection**: Automatically detects Electron environment
- **Proxy Integration**: Built-in proxy server for iframe embedding
- **Session Isolation**: Each panel runs in its own isolated context
- **Real-time Navigation**: Back/forward buttons and URL tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- All dependencies already installed

### Quick Start

#### Option 1: Automated Script (Recommended)
```bash
chmod +x start-desktop.sh
./start-desktop.sh
```

#### Option 2: Manual Steps
```bash
# Start Next.js development server
npm run dev

# In another terminal, start Electron
npx electron .
```

#### Option 3: Web Mode Only
```bash
npm run dev
# Open http://localhost:3000
```

## 🎮 Usage Guide

### Adding Panels
1. Click "Add Panel" in the sidebar
2. Enter a website URL (e.g., `gmail.com`, `https://github.com`)
3. Optionally set a custom title
4. Or use quick-add buttons for popular sites

### Managing Panels
- **Reorder**: Drag panels in the sidebar
- **Remove**: Click the trash icon on any panel
- **Navigate**: Use back/forward buttons in each panel
- **External**: Click external link icon to open in system browser

### Grid Layouts
- **Auto-adjust**: Layout changes automatically based on panel count
- **Manual control**: Use layout buttons in the top bar
- **Fullscreen**: Toggle fullscreen mode for focused work

### Popular Sites Included
- Gmail, Slack, Discord, Twitter, LinkedIn
- GitHub, YouTube, Spotify, Notion, Figma
- One-click addition for common productivity tools

## 🏗️ Architecture

### Desktop Mode (Electron)
```
┌─ Electron Main Process (main.js)
├─ Next.js Renderer (localhost:3000)
├─ WebView Panels (isolated contexts)
└─ Enhanced Proxy Server (localhost:4000)
```

### Web Mode (Browser)
```
┌─ Next.js Web App (localhost:3000)
├─ Iframe Panels (limited isolation)
└─ Enhanced Proxy Server (localhost:4000)
```

## 📁 Key Components

### Core Components
- `components/desktop/webview-panel.tsx` - Individual webview wrapper
- `components/desktop/panel-grid.tsx` - Dynamic grid layout system
- `components/desktop/desktop-sidebar.tsx` - Panel management sidebar
- `components/desktop/desktop-dashboard.tsx` - Main dashboard container
- `components/mode-detector.tsx` - Web/Desktop mode switcher

### Electron Integration
- `main.js` - Electron main process with webview support
- `electron-builder.json` - Build configuration
- `run-electron.js` - Development helper script

## 🔧 Development

### File Structure
```
app/
├── main.js                    # Electron main process
├── components/desktop/        # Desktop-specific components
├── app/desktop/              # Desktop page route
├── enhanced-proxy-server.js  # Proxy for iframe embedding
└── start-desktop.sh          # Development script
```

### Mode Detection
The app automatically detects the runtime environment:
- **Electron**: Enables desktop mode with webviews
- **Browser**: Falls back to web mode with iframes
- **User Choice**: Mode selector for manual override

### WebView vs IFrame
| Feature | WebView (Desktop) | IFrame (Web) |
|---------|------------------|--------------|
| Session Isolation | ✅ Full | ⚠️ Limited |
| Persistent Storage | ✅ Yes | ⚠️ Limited |
| Navigation Controls | ✅ Full | ❌ Basic |
| Security Context | ✅ Isolated | ⚠️ Shared |
| X-Frame-Options Bypass | ✅ Native | 🔧 Proxy |

## 🔐 Security Features

### Webview Security
- Isolated contexts prevent cross-contamination
- Sandboxed environments for each panel
- Secure communication with main process
- Prevention of unauthorized window creation

### Proxy Security
- Header stripping for iframe compatibility
- CORS handling for cross-origin requests
- Request filtering and validation
- Rate limiting and abuse prevention

## 🚨 Troubleshooting

### Common Issues

**Electron won't start**
```bash
# Check if main.js exists and is valid
npx electron main.js

# Verify Node.js version
node --version  # Should be 16+
```

**WebViews not loading**
- Ensure webSecurity is disabled in main.js
- Check console for navigation errors
- Verify URL format (include https://)

**Mode detection not working**
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors
- Verify component imports

**Panels not persisting**
- Check localStorage permissions
- Verify partition names in webviews
- Clear app data and restart

### Debug Mode
```bash
# Enable Electron DevTools
NODE_ENV=development npx electron .

# Check Next.js logs
tail -f dev.log

# Check proxy logs  
tail -f proxy.log
```

## 📈 Performance Tips

### Memory Optimization
- Close unused panels regularly
- Use single-page apps when possible
- Monitor memory usage in Task Manager

### Loading Speed
- Use cached versions of frequently accessed sites
- Preload popular panels on startup
- Enable compression in proxy settings

## 🎯 Roadmap

### Planned Features
- [ ] Panel themes and customization
- [ ] Keyboard shortcuts and hotkeys
- [ ] Session export/import
- [ ] Multi-workspace support
- [ ] Plugin system for extensions
- [ ] Auto-update mechanism

### Known Limitations
- Headless environments need GUI for Electron
- Some sites may block webview embedding
- Memory usage scales with panel count
- Limited mobile responsiveness in desktop mode

## 🤝 Contributing

This is a demonstration project showcasing Electron + Next.js integration. The architecture can be extended for:
- Additional panel types
- Advanced session management  
- Custom protocol handlers
- Native desktop integrations

## 📄 License

This project demonstrates desktop app development patterns and is provided as-is for educational purposes.

---

**Happy multitasking! 🚀**
