# Actions For VSCode - Project Summary

## Overview
VS Code extension inspired by Actions for Nautilus that enables multiple custom commands in context menus.

## Key Features
- Multiple configurable actions (array in settings)
- Context-aware (explorer/scm/editor)
- Background execution
- Placeholders: {file}, {files}, {dir}, {filename}
- Enable/disable per action
- Icon support
- Notification control

## Quick Config Example
```json
{
  "actionsForVscode.actions": [
    {
      "id": "openOrigin",
      "label": "Open Origin",
      "command": "G",
      "contexts": ["explorer"]
    }
  ]
}
```

## Getting Started
```bash
cd /home/jbartle9/tmp/actions-for-vscode
npm install
npm run compile
# Press F5 to test
```

See QUICKSTART.md for detailed instructions.
