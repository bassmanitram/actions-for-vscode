# Quick Start Guide

## 1. Install Dependencies

```bash
cd /home/jbartle9/tmp/actions-for-vscode
npm install
```

## 2. Compile TypeScript

```bash
npm run compile
```

## 3. Test the Extension

Press `F5` in VS Code to launch the Extension Development Host.

## 4. Configure Your First Action

In the Extension Development Host window:

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

## 5. Test Your Action

1. Open any folder in the Extension Development Host
2. Right-click on a file in Explorer
3. Select "Custom Actions..."
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

## Debugging

View command execution in Developer Tools:

1. `Help` → `Toggle Developer Tools`
2. Go to `Console` tab
3. Look for `[actionId]` prefixed messages

## Common Issues

**Commands not appearing?**
- Reload window: `Cmd/Ctrl+Shift+P` → "Developer: Reload Window"
- Check `enabled: true` in your action config

**Command fails?**
- Test command manually in terminal first
- Check Developer Console for error messages
- Verify command exists in PATH

## Next Steps

See [EXAMPLES.md](./EXAMPLES.md) for more configuration examples.
