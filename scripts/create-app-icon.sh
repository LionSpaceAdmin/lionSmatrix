#!/bin/bash

# Create a simple lion icon for the app
PROJECT_DIR="/Users/daniel/modern-nextjs-app"
ICON_DIR="$PROJECT_DIR/Lionspace Launcher.app/Contents/Resources"

# Create a simple text-based icon using sips and ImageMagick (or fallback)
# This creates a temporary icon file

cat > "$ICON_DIR/icon_template.svg" << 'EOF'
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f0f23;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="lionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff6b00;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="url(#bgGradient)"/>
  
  <!-- Lion Symbol -->
  <text x="256" y="300" font-family="Arial, sans-serif" font-size="200" text-anchor="middle" fill="url(#lionGradient)">🦁</text>
  
  <!-- Matrix effect dots -->
  <circle cx="100" cy="100" r="3" fill="#00ff00" opacity="0.5"/>
  <circle cx="150" cy="120" r="3" fill="#00ff00" opacity="0.3"/>
  <circle cx="200" cy="90" r="3" fill="#00ff00" opacity="0.6"/>
  <circle cx="300" cy="110" r="3" fill="#00ff00" opacity="0.4"/>
  <circle cx="350" cy="130" r="3" fill="#00ff00" opacity="0.5"/>
  <circle cx="400" cy="100" r="3" fill="#00ff00" opacity="0.3"/>
  
  <circle cx="120" cy="400" r="3" fill="#00ff00" opacity="0.4"/>
  <circle cx="170" cy="420" r="3" fill="#00ff00" opacity="0.6"/>
  <circle cx="220" cy="390" r="3" fill="#00ff00" opacity="0.3"/>
  <circle cx="320" cy="410" r="3" fill="#00ff00" opacity="0.5"/>
  <circle cx="370" cy="430" r="3" fill="#00ff00" opacity="0.4"/>
  <circle cx="420" cy="400" r="3" fill="#00ff00" opacity="0.6"/>
</svg>
EOF

# Check if we can convert SVG to PNG
if command -v convert &> /dev/null; then
    # Use ImageMagick if available
    convert -background none "$ICON_DIR/icon_template.svg" -resize 512x512 "$ICON_DIR/AppIcon.png"
elif command -v qlmanage &> /dev/null; then
    # Use Quick Look as fallback
    qlmanage -t -s 512 -o "$ICON_DIR" "$ICON_DIR/icon_template.svg" 2>/dev/null
    mv "$ICON_DIR/icon_template.svg.png" "$ICON_DIR/AppIcon.png" 2>/dev/null
else
    # Create a simple PNG using base64 encoded image
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==" | base64 -d > "$ICON_DIR/AppIcon.png"
fi

# Try to create icns file if possible
if command -v sips &> /dev/null && [ -f "$ICON_DIR/AppIcon.png" ]; then
    # Create icon set
    mkdir -p "$ICON_DIR/AppIcon.iconset"
    
    # Generate different sizes
    sips -z 16 16     "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_16x16.png" 2>/dev/null
    sips -z 32 32     "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_16x16@2x.png" 2>/dev/null
    sips -z 32 32     "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_32x32.png" 2>/dev/null
    sips -z 64 64     "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_32x32@2x.png" 2>/dev/null
    sips -z 128 128   "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_128x128.png" 2>/dev/null
    sips -z 256 256   "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_128x128@2x.png" 2>/dev/null
    sips -z 256 256   "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_256x256.png" 2>/dev/null
    sips -z 512 512   "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_256x256@2x.png" 2>/dev/null
    sips -z 512 512   "$ICON_DIR/AppIcon.png" --out "$ICON_DIR/AppIcon.iconset/icon_512x512.png" 2>/dev/null
    
    # Convert to icns
    iconutil -c icns "$ICON_DIR/AppIcon.iconset" -o "$ICON_DIR/AppIcon.icns" 2>/dev/null
    
    # Clean up
    rm -rf "$ICON_DIR/AppIcon.iconset"
fi

# Clean up temporary files
rm -f "$ICON_DIR/icon_template.svg"

echo "Icon created successfully"