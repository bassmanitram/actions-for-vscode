# Quick Start Guide

## Installation

### From VS Code Marketplace (Recommended)

**Option 1: Via Extensions View**
1. Open VS Code
2. Click Extensions icon (`Cmd/Ctrl+Shift+X`)
3. Search for "Actions For VSCode"
4. Click Install

**Option 2: Command Line**
```bash
code --install-extension bassmanitram.actions-for-vscode
```

### From GitHub Releases

Download the latest `.vsix` from [Releases](https://github.com/bassmanitram/actions-for-vscode/releases):

```bash
code --install-extension actions-for-vscode-X.Y.Z.vsix
```

### From Source (Development)

```bash
git clone https://github.com/bassmanitram/actions-for-vscode.git
cd actions-for-vscode
npm install
npm run compile
npm run package
code --install-extension $(ls -t *.vsix | head -n1)
```

## After Installation

Reload VS Code: `Cmd/Ctrl+Shift+P` → "Developer: Reload Window"

## Configure Your First Action

### Using Visual Settings Manager (Recommended)

1. Open Command Palette: `Cmd/Ctrl+Shift+P`
2. Type "Actions For VSCode: Manage Actions"
3. Click "+ Add New Action"
4. Fill in the form:
   - ID: `openOrigin`
   - Label: `Open Origin`
   - Command: `G`
   - Contexts: Check "Explorer"
   - Icon: `link-external`
5. Click "Save Action"

### Using JSON Configuration

1. Open Settings: `Cmd/Ctrl+,`
2. Search for "Actions For VSCode"
3. Click the link at the top: "Open Visual Settings Manager"
   - Or click "Edit in settings.json" for direct JSON editing
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

**Using Visual Manager:**
- Click "+ Add New Action" to add another
- Click "Edit" on existing actions to modify them
- Click "Delete" to remove actions

**Using JSON:**

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
      "command": "git log --oneline -n 20 {path}",
      "cwd": "{dir}",
      "contexts": ["explorer", "scm"],
      "showNotification": false
    },
    {
      "id": "copyPath",
      "label": "Copy Path",
      "command": "echo -n {path} | xclip -selection clipboard",
      "contexts": ["explorer", "editor"]
    }
  ]
}
```

## Available Placeholders

- `{path}` - Full path to selected item
- `{file}` - Name only (no path)
- `{files}` - All selected files (quoted, space-separated)
- `{dir}` - Parent directory
- `{filename}` - Alias for `{file}`
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

## Common Examples

### Git Log
```json
{
  "id": "gitLog",
  "label": "Git Log",
  "command": "git log --oneline -n 20 {path}",
  "cwd": "{dir}",
  "contexts": ["explorer", "scm"],
  "icon": "git-commit"
}
```

### Open Terminal
```json
{
  "id": "openTerminal",
  "label": "Open Terminal Here",
  "command": "gnome-terminal",
  "cwd": "{dir}",
  "contexts": ["explorer"],
  "icon": "terminal"
}
```

### Make Executable
```json
{
  "id": "makeExecutable",
  "label": "Make Executable",
  "command": "chmod +x {path}",
  "contexts": ["explorer"],
  "icon": "file-binary"
}
```

## Debugging

View command execution in Developer Tools:

1. `Help` → `Toggle Developer Tools`
2. Go to Console tab
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
- Ensure VS Code 1.80.0 or higher
- Try restarting VS Code
- Check extension is enabled in Extensions view

## Updating the Extension

Updates are automatic via VS Code Marketplace. Or manually:

```bash
code --install-extension bassmanitram.actions-for-vscode --force
```

## Next Steps

- See [README.md](./README.md) for complete documentation
- See [EXAMPLES.md](./EXAMPLES.md) for more configuration examples
- See [CHANGELOG.md](./CHANGELOG.md) for version history

## Getting Help

- [GitHub Issues](https://github.com/bassmanitram/actions-for-vscode/issues)
- [Marketplace Page](https://marketplace.visualstudio.com/items?itemName=bassmanitram.actions-for-vscode)
