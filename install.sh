#!/bin/bash
set -e

echo "Installing Actions For VSCode extension..."

# Check if code command exists
if ! command -v code &> /dev/null; then
    echo "ERROR: VS Code 'code' command not found in PATH"
    echo "Please install VS Code and ensure the 'code' command is available"
    echo "See: https://code.visualstudio.com/docs/setup/setup-overview"
    exit 1
fi

# Load NVM if available and use appropriate Node version
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    echo "Loading NVM..."
    source "$HOME/.nvm/nvm.sh"
    
    # Try to use Node 20 or higher for vsce
    if nvm list 20 &> /dev/null || nvm list lts/* &> /dev/null; then
        nvm use --lts 2>/dev/null || nvm use 20 2>/dev/null || true
    fi
fi

# Display Node version
NODE_VERSION=$(node --version 2>/dev/null || echo "not found")
echo "Using Node.js: $NODE_VERSION"

# Install dependencies
echo "Installing dependencies..."
npm install

# Compile TypeScript
echo "Compiling TypeScript..."
npm run compile

# Package extension
echo "Packaging extension..."
if command -v vsce &> /dev/null; then
    vsce package --no-yarn
elif npx vsce --version &> /dev/null 2>&1; then
    npx vsce package --no-yarn
else
    echo "Installing vsce locally..."
    npm install -g @vscode/vsce 2>/dev/null || npm install vsce
    npx vsce package --no-yarn
fi

# Find the .vsix file
VSIX_FILE=$(ls -t *.vsix 2>/dev/null | head -n1)

if [ -z "$VSIX_FILE" ]; then
    echo "ERROR: No .vsix file found"
    exit 1
fi

echo "Found package: $VSIX_FILE"

# Uninstall previous version if exists
EXTENSION_ID=$(grep '"name"' package.json | head -n1 | sed 's/.*"name": "\(.*\)".*/\1/')
if code --list-extensions | grep -q "$EXTENSION_ID"; then
    echo "Uninstalling previous version..."
    code --uninstall-extension "your-publisher-name.$EXTENSION_ID" 2>/dev/null || true
fi

# Install extension
echo "Installing extension into VS Code..."
code --install-extension "$VSIX_FILE"

echo ""
echo "✓ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Reload VS Code window (Cmd/Ctrl+Shift+P → 'Developer: Reload Window')"
echo "2. Configure your actions in Settings (Cmd/Ctrl+,) → Search 'Actions For VSCode'"
echo "3. Right-click a file in Explorer → 'Actions For VSCode...'"
echo ""
