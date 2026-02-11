# Quick Start Guide

## Installation

### Option 1: Quick Install (Recommended)

```bash
git clone https://github.com/bassmanitram/actions-for-vscode.git
cd actions-for-vscode
./install.sh
```

The script handles everything: dependencies, compilation, packaging, and installation.

### Option 2: NPM Script

```bash
git clone https://github.com/bassmanitram/actions-for-vscode.git
cd actions-for-vscode
npm run install-extension
```

### Option 3: Manual Install

```bash
git clone https://github.com/bassmanitram/actions-for-vscode.git
cd actions-for-vscode
npm install
npm run compile
npm run package
code --install-extension $(ls -t *.vsix | head -n1)
```

## After Installation

1. **Reload VS Code**: Press `Cmd/Ctrl+Shift+P` → "Developer: Reload Window"
2. **Configure Actions**: Follow the configuration steps below

## Configure Your First Action

1. Open Settings: `Cmd/Ctrl + ,`
2. Search for "Actions For VSCode"
3. Click "Edit in settings.json"
4. Add your configuration:

```json
{
  "actionsForVscode.actions": [
    {
      "id": "openOrigin",
      "label": "Open Origin",
      "command": "G",
      "contexts": ["explorer"],
      "icon": "link-external"
    }
  ]
}
```

## Test Your Action

1. Open any folder in VS Code
2. Right-click on a file in Explorer
3. Select "Actions For VSCode..."
4. Choose "Open Origin"

## Adding More Actions

Simply add more objects to the `actions` array:

```json
{
  "actionsForVscode.actions": [
    {
      "id": "openOrigin",
      "label": "Open Origin",
      "command": "G",
      "contexts": ["explorer"]
    },
    {
      "id": "gitLog",
      "label": "Git Log",
      "command": "git log --oneline -n 20 {file}",
      "cwd": "{dir}",
      "contexts": ["explorer", "scm"],
      "showNotification": false
    },
    {
      "id": "copyPath",
      "label": "Copy Path",
      "command": "echo -n {file} | xclip -selection clipboard",
      "contexts": ["explorer", "editor"]
    }
  ]
}
```

## Available Placeholders

- `{file}` - Full path to selected file
- `{files}` - All selected files (quoted, space-separated)
- `{dir}` - Directory containing the file
- `{filename}` - Filename only (no path)
- `{workspace}` - Workspace root directory

## Working Directory

Specify where commands execute with `cwd`:

```json
{
  "id": "npmBuild",
  "label": "NPM Build",
  "command": "npm run build",
  "cwd": "{workspace}",
  "contexts": ["explorer"]
}
```

## Development Mode

For extension development:

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile`
4. Press `F5` to open Extension Development Host
5. Test your changes

## Debugging

View command execution in Developer Tools:

1. `Help` → `Toggle Developer Tools`
2. Go to `Console` tab
3. Look for `[actionId]` prefixed messages

## Common Issues

**Commands not appearing?**
- Reload window: `Cmd/Ctrl+Shift+P` → "Developer: Reload Window"
- Check `enabled: true` in your action config
- Verify `contexts` includes the correct context

**Command fails?**
- Test command manually in terminal first
- Check Developer Console for error messages
- Verify command exists in PATH
- Check working directory is correct

**Installation fails?**
- Ensure Node.js 18+ is installed
- Try `npm install -g @vscode/vsce` first
- Check `code` command is in PATH

## Updating the Extension

```bash
cd actions-for-vscode
git pull
./install.sh
```

Or:

```bash
npm run reinstall
```

## Next Steps

See [EXAMPLES.md](./EXAMPLES.md) for more configuration examples.
