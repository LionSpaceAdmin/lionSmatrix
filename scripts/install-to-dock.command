#!/bin/bash

# Lionspace - Install to Dock Script
# Double-click this file to add Lionspace Launcher to your dock

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
APP_PATH="$PROJECT_DIR/Lionspace Launcher.app"
APPS_DIR="/Applications"

clear

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║               🦁 ${BOLD}LIONSPACE DOCK INSTALLER${NC} ${CYAN}🦁                ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if app exists
if [ ! -d "$APP_PATH" ]; then
    echo -e "${YELLOW}App not found. Creating it first...${NC}"
    
    # Create the app if it doesn't exist
    mkdir -p "$APP_PATH/Contents/MacOS"
    mkdir -p "$APP_PATH/Contents/Resources"
    
    # Copy Info.plist
    cat > "$APP_PATH/Contents/Info.plist" << 'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>lionspace-launcher</string>
    <key>CFBundleIdentifier</key>
    <string>com.lionspace.launcher</string>
    <key>CFBundleName</key>
    <string>Lionspace Launcher</string>
    <key>CFBundleDisplayName</key>
    <string>Lionspace</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
</dict>
</plist>
PLIST
    
    # Create launcher script
    cat > "$APP_PATH/Contents/MacOS/lionspace-launcher" << LAUNCHER
#!/bin/bash
osascript -e 'tell application "Terminal"
    activate
    do script "cd \"$PROJECT_DIR\" && ./scripts/launch-lionspace.sh"
end tell'
LAUNCHER
    
    chmod +x "$APP_PATH/Contents/MacOS/lionspace-launcher"
    
    echo -e "${GREEN}✓${NC} App bundle created"
fi

# Make scripts executable
chmod +x "$PROJECT_DIR/scripts/launch-lionspace.sh" 2>/dev/null || true
chmod +x "$PROJECT_DIR/scripts/sync-monitor.sh" 2>/dev/null || true

echo -e "${GREEN}✓${NC} Scripts made executable"

# Create a symbolic link in Applications
echo ""
echo -e "${CYAN}Choose installation method:${NC}"
echo "1) Add to Dock only (keeps in project folder)"
echo "2) Copy to Applications folder and add to Dock"
echo ""
read -p "Enter choice [1-2]: " choice

if [ "$choice" = "2" ]; then
    # Copy to Applications
    echo -e "${YELLOW}Copying to Applications folder...${NC}"
    
    # Remove old version if exists
    if [ -d "$APPS_DIR/Lionspace Launcher.app" ]; then
        rm -rf "$APPS_DIR/Lionspace Launcher.app"
    fi
    
    # Copy the app
    cp -R "$APP_PATH" "$APPS_DIR/"
    APP_TO_ADD="$APPS_DIR/Lionspace Launcher.app"
    
    echo -e "${GREEN}✓${NC} Copied to Applications"
else
    APP_TO_ADD="$APP_PATH"
fi

# Add to Dock using AppleScript
echo -e "${YELLOW}Adding to Dock...${NC}"

osascript << EOF
tell application "Dock"
    try
        -- Remove if already exists
        set dock_apps to name of every dock item
        if "Lionspace" is in dock_apps then
            tell application "System Events"
                tell process "Dock"
                    set frontmost to true
                    tell list 1
                        try
                            delete UI element "Lionspace"
                        end try
                    end tell
                end tell
            end tell
        end if
    end try
end tell

-- Add to dock
tell application "Finder"
    try
        set app_path to POSIX file "$APP_TO_ADD" as alias
        tell application "Dock"
            make new dock item at end of dock items with properties {tile data:app_path, tile type:file tile}
        end tell
    on error errMsg
        display dialog "Note: Please drag the Lionspace app to your Dock manually." buttons {"OK"} default button 1
    end try
end tell
EOF

# Final message
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "The Lionspace Launcher has been added to your Dock."
echo ""
echo -e "${BOLD}Quick Start:${NC}"
echo -e "  • Click the Lionspace icon in your Dock"
echo -e "  • Choose your launch mode:"
echo -e "    - Local Development (quick start)"
echo -e "    - DevContainer (with database)"
echo ""
echo -e "${BOLD}Command Line:${NC}"
echo -e "  ${CYAN}cd $PROJECT_DIR${NC}"
echo -e "  ${CYAN}./scripts/launch-lionspace.sh${NC}"
echo ""
echo -e "${YELLOW}Press any key to close this window...${NC}"
read -n 1

# Open the app for the first time
open "$APP_TO_ADD"

exit 0