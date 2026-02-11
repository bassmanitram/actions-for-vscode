# Actions For VSCode

A flexible VS Code extension that allows you to add custom commands to context menus in the Explorer, Source Control, and Editor with fully configurable actions.

## Features

- **Multiple Custom Actions**: Define unlimited custom actions in settings
- **Context-Aware**: Show actions in Explorer, Source Control, or Editor contexts
- **Background Execution**: Commands run silently in the background
- **Working Directory Control**: Specify custom working directory for each action
- **Flexible Placeholders**: Use `{file}`, `{files}`, `{dir}`, `{filename}`, `{workspace}` in commands
- **Rich Configuration**: Enable/disable actions, customize notifications, add icons
- **Quick Access**: Right-click menu shows "Actions For VSCode..." picker

## Installation

1. Clone or download this repository
2. Run `npm install` in the extension directory
3. Run `npm run compile`
4. Press `F5` to open Extension Development Host
5. Configure your actions in Settings

## Configuration

Open VS Code Settings and search for "Actions For VSCode" or edit `settings.json` directly.

### Basic Example

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

### Multiple Actions Example

```json
{
  "actionsForVscode.actions": [
    {
      "id": "gitLog",
      "label": "Git Log",
      "command": "git log --oneline -n 20 {file}",
      "cwd": "{dir}",
      "contexts": ["explorer", "scm"],
      "icon": "git-commit",
      "showNotification": false
    },
    {
      "id": "openInTerminal",
      "label": "Open Terminal Here",
      "command": "gnome-terminal",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "terminal"
    },
    {
      "id": "copyPath",
      "label": "Copy Full Path",
      "command": "echo {file} | xclip -selection clipboard",
      "contexts": ["explorer", "editor"],
      "icon": "clippy"
    },
    {
      "id": "makeExecutable",
      "label": "Make Executable",
      "command": "chmod +x {file}",
      "contexts": ["explorer"],
      "icon": "file-binary"
    }
  ]
}
```

## Action Configuration

Each action supports the following properties:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | string | ✓ | - | Unique identifier (alphanumeric, hyphens, underscores) |
| `label` | string | ✓ | - | Text shown in the menu |
| `command` | string | ✓ | - | Command to execute |
| `cwd` | string | | `{dir}` | Working directory (supports placeholders) |
| `contexts` | string[] | | `["explorer"]` | Where to show: `explorer`, `scm`, `editor` |
| `icon` | string | | - | VS Code icon ID (see [icon reference](https://code.visualstudio.com/api/references/icons-in-labels)) |
| `showNotification` | boolean | | `true` | Show success/error notifications |
| `enabled` | boolean | | `true` | Enable or disable this action |

## Command Placeholders

Use these placeholders in your commands and working directory:

- **`{file}`** - Full path to the selected file
  - Example: `/home/user/project/src/main.ts`
- **`{files}`** - All selected files (space-separated, quoted)
  - Example: `"/file1.txt" "/file2.txt"`
- **`{dir}`** - Directory containing the file
  - Example: `/home/user/project/src`
- **`{filename}`** - Filename without path
  - Example: `main.ts`
- **`{workspace}`** - Workspace root directory
  - Example: `/home/user/project`

### Working Directory (`cwd`)

The `cwd` property specifies where the command executes. It supports the same placeholders:

```json
{
  "id": "gitStatus",
  "label": "Git Status",
  "command": "git status",
  "cwd": "{dir}"
}
```

**Default behavior**: If `cwd` is not specified, commands execute in the file's directory (`{dir}`).

**Examples**:
- `"cwd": "{dir}"` - Execute in file's directory
- `"cwd": "{workspace}"` - Execute in workspace root
- `"cwd": "/tmp"` - Execute in specific directory

### Auto-append Behavior

If your command doesn't contain any placeholder, the file path is automatically appended:

```json
{
  "command": "G"
}
// Executes as: G "/path/to/file"
```

## Usage

### From Explorer
1. Right-click on any file or folder in the Explorer
2. Select "Actions For VSCode..." from the context menu
3. Choose the action you want to execute

### From Source Control
1. Right-click on a file in the Source Control view
2. Select "Actions For VSCode..."
3. Choose the action

### From Editor
1. Right-click in an open file
2. Select "Actions For VSCode..."
3. Choose the action

## Settings

### Command Timeout

Configure the maximum execution time for commands:

```json
{
  "actionsForVscode.commandTimeout": 30000
}
```

Value in milliseconds. Default: 30000 (30 seconds).

## Example Use Cases

### Git Operations
```json
{
  "id": "gitBlame",
  "label": "Git Blame",
  "command": "git blame {file}",
  "cwd": "{dir}",
  "contexts": ["explorer"],
  "icon": "git-commit"
}
```

### Build in Workspace Root
```json
{
  "id": "npmBuild",
  "label": "NPM Build",
  "command": "npm run build",
  "cwd": "{workspace}",
  "contexts": ["explorer"],
  "icon": "tools"
}
```

### File Management
```json
{
  "id": "duplicateFile",
  "label": "Duplicate File",
  "command": "cp {file} {file}.copy",
  "cwd": "{dir}",
  "contexts": ["explorer"],
  "icon": "files"
}
```

### Custom Scripts
```json
{
  "id": "runCustomScript",
  "label": "Run My Script",
  "command": "/home/user/scripts/process.sh {file}",
  "cwd": "{workspace}",
  "contexts": ["explorer"],
  "showNotification": true
}
```

### Multiple File Operations
```json
{
  "id": "compressAll",
  "label": "Compress Selected Files",
  "command": "tar -czf archive.tar.gz {files}",
  "cwd": "{dir}",
  "contexts": ["explorer"],
  "icon": "archive"
}
```

## Troubleshooting

### Commands Not Appearing
- Check that `enabled: true` is set (or omitted, as it defaults to true)
- Verify the `contexts` array includes the correct context
- Reload VS Code window: `Cmd/Ctrl+Shift+P` → "Developer: Reload Window"

### Command Execution Fails
- Check the Developer Console: `Help` → `Toggle Developer Tools` → `Console` tab
- Verify the command exists in your system PATH
- Test the command manually in a terminal from the same working directory
- Check file path has no special characters that need escaping

### No Actions in Settings
- Open Settings: `Cmd/Ctrl+,`
- Search for "Actions For VSCode"
- Click "Edit in settings.json" to add actions manually

## Development

### Setup
```bash
npm install
```

### Compile
```bash
npm run compile
```

### Watch Mode
```bash
npm run watch
```

### Debug
Press `F5` in VS Code to launch Extension Development Host.

## Requirements

- VS Code 1.80.0 or higher
- Commands configured must be available in your system PATH

## Security Note

This extension executes system commands based on user configuration. Only configure commands you trust and understand.

## Inspired By

This extension draws inspiration from [Actions for Nautilus](https://github.com/bassmanitram/actions-for-nautilus), which provides similar functionality for the GNOME Files (Nautilus) file manager.

## License

[Specify your license here]
