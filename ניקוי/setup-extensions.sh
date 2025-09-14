#!/bin/bash

# 🧹 LionSpace Cursor Extensions Setup
# =====================================
# רק ה-Extensions החיוניים, בלי שטויות!

echo "🦁 Setting up Cursor with MINIMAL extensions"
echo "==========================================="
echo ""

# Function to install extension
install_ext() {
    echo "Installing: $2"
    cursor --install-extension $1 2>/dev/null || code --install-extension $1 2>/dev/null
}

echo "📦 Installing ONLY essential extensions..."
echo ""

# Core Development (6 extensions בלבד!)
install_ext "googlecloudtools.cloudcode" "Google Cloud Code"
install_ext "golang.go" "Go Language Support"
install_ext "ms-python.python" "Python Support"
install_ext "eamodio.gitlens" "GitLens"
install_ext "esbenp.prettier-vscode" "Prettier"
install_ext "dbaeumer.vscode-eslint" "ESLint"

echo ""
echo "✅ Done! Only 6 essential extensions installed."
echo ""
echo "📊 Installed extensions:"
cursor --list-extensions 2>/dev/null || code --list-extensions