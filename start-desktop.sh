
#!/bin/bash

echo "🚀 Multi-App Social Dashboard - Desktop Mode"
echo "=============================================="
echo ""

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [[ ! -f "main.js" ]]; then
    echo -e "${RED}❌ Error: main.js not found. Please run this script from the app directory.${NC}"
    exit 1
fi

# Function to cleanup processes
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down services...${NC}"
    if [[ ! -z "$NEXT_PID" ]]; then
        kill $NEXT_PID 2>/dev/null
        echo -e "${GREEN}✓ Next.js server stopped${NC}"
    fi
    if [[ ! -z "$PROXY_PID" ]]; then
        kill $PROXY_PID 2>/dev/null
        echo -e "${GREEN}✓ Proxy server stopped${NC}"
    fi
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo -e "${BLUE}📦 Starting Next.js development server...${NC}"
npm run dev > dev.log 2>&1 &
NEXT_PID=$!

echo -e "${BLUE}🔗 Starting enhanced proxy server...${NC}"
node enhanced-proxy-server.js > proxy.log 2>&1 &
PROXY_PID=$!

# Wait for Next.js to be ready
echo -e "${YELLOW}⏳ Waiting for servers to start...${NC}"
for i in {1..30}; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|307"; then
        echo -e "${GREEN}✓ Next.js server is ready (localhost:3000)${NC}"
        break
    fi
    if [[ $i -eq 30 ]]; then
        echo -e "${RED}❌ Next.js server failed to start${NC}"
        cleanup
    fi
    sleep 1
done

# Check proxy server
for i in {1..10}; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health | grep -q "200"; then
        echo -e "${GREEN}✓ Proxy server is ready (localhost:4000)${NC}"
        break
    fi
    if [[ $i -eq 10 ]]; then
        echo -e "${YELLOW}⚠ Proxy server may not be available${NC}"
    fi
    sleep 1
done

echo ""
echo -e "${GREEN}🎉 All services are running!${NC}"
echo -e "${BLUE}📱 Web Version: ${NC}http://localhost:3000"
echo -e "${BLUE}🖥️  Desktop Version: ${NC}Starting Electron..."
echo ""

# Check if we're in a display environment
if [[ -z "$DISPLAY" ]] && [[ "$XDG_SESSION_TYPE" != "wayland" ]]; then
    echo -e "${YELLOW}⚠️  No display detected. Running in headless mode.${NC}"
    echo -e "${BLUE}💡 To run the desktop version:${NC}"
    echo "   1. On a machine with GUI: npx electron ."
    echo "   2. Or access web version at: http://localhost:3000"
    echo ""
    echo -e "${GREEN}✅ Development servers are running. Press Ctrl+C to stop.${NC}"
    
    # Keep running until interrupted
    while true; do
        sleep 10
        # Check if processes are still running
        if ! kill -0 $NEXT_PID 2>/dev/null; then
            echo -e "${RED}❌ Next.js server stopped unexpectedly${NC}"
            break
        fi
    done
else
    echo -e "${GREEN}⚡ Starting Electron application...${NC}"
    # Start Electron (this will block until Electron closes)
    npx electron . 2>/dev/null || echo -e "${YELLOW}Electron closed or failed to start${NC}"
fi

cleanup
