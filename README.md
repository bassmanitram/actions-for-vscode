# Actions For VSCode

A flexible VS Code extension that allows you to add custom commands to context menus in the Explorer, Source Control, and Editor with fully configurable actions.

## Features

- **Multiple Custom Actions**: Define unlimited custom actions in settings
- **Context-Aware**: Show actions in Explorer, Source Control, or Editor contexts
- **Background Execution**: Commands run silently in the background
- **Working Directory Control**: Specify custom working directory for each action
- **Flexible Placeholders**: Use `{path}`, `{file}`, `{files}`, `{dir}`, `{filename}`, `{workspace}` in commands
- **Rich Configuration**: Enable/disable actions, customize notifications, add icons
- **Quick Access**: Right-click menu shows "Actions For VSCode..." picker

## Installation

### Quick Install

```bash
# Clone the repository
git clone https://github.com/bassmanitram/actions-for-vscode.git
cd actions-for-vscode

# Run the install script
./install.sh
```

The script will:
1. Install dependencies
2. Compile TypeScript
3. Package the extension
4. Install into VS Code

### Manual Install

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Package extension
npm run package

# Install into VS Code
npm run reinstall
```

### NPM Scripts

- `npm run compile` - Compile TypeScript
- `npm run package` - Create .vsix package
- `npm run reinstall` - Compile, package, and install
- `npm run install-extension` - Run install.sh script

### Development Mode

1. Clone the repository
2. Run `npm install`
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
      "command": "git log --oneline -n 20 {path}",
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
      "command": "echo {path} | xclip -selection clipboard",
      "contexts": ["explorer", "editor"],
      "icon": "clippy"
    },
    {
      "id": "makeExecutable",
      "label": "Make Executable",
      "command": "chmod +x {path}",
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
| `cwd` | string | | auto | Working directory (supports placeholders) |
| `contexts` | string[] | | `["explorer"]` | Where to show: `explorer`, `scm`, `editor` |
| `icon` | string | | - | VS Code icon ID (see [icon reference](https://code.visualstudio.com/api/references/icons-in-labels)) |
| `showNotification` | boolean | | `true` | Show success/error notifications |
| `enabled` | boolean | | `true` | Enable or disable this action |

## Command Placeholders

Use these placeholders in your commands and working directory configurations:

| Placeholder | Files | Folders | Description |
|-------------|-------|---------|-------------|
| `{path}` | `/home/user/project/file.txt` | `/home/user/project/folder` | Full path to selected item |
| `{file}` | `file.txt` | `folder` | Name only (no path) |
| `{dir}` | `/home/user/project` | `/home/user/project` | Parent directory |
| `{filename}` | `file.txt` | `folder` | Alias for `{file}` |
| `{files}` | `"/file1.txt" "/file2.txt"` | - | All selected files (quoted, space-separated) |
| `{workspace}` | `/home/user/project` | `/home/user/project` | Workspace root |

### Placeholder Examples

**For a file** `/home/user/project/src/main.ts`:
- `{path}` → `/home/user/project/src/main.ts`
- `{file}` → `main.ts`
- `{dir}` → `/home/user/project/src`
- `{workspace}` → `/home/user/project`

**For a folder** `/home/user/project/src`:
- `{path}` → `/home/user/project/src`
- `{file}` → `src`
- `{dir}` → `/home/user/project`
- `{workspace}` → `/home/user/project`

### Working Directory (`cwd`)

The `cwd` property specifies where the command executes. It supports all placeholders.

**Default behavior** (when `cwd` is not specified):
- **For files**: Execute in the file's parent directory
- **For folders**: Execute in the folder itself

```json
{
  "id": "gitStatus",
  "label": "Git Status",
  "command": "git status",
  "cwd": "{dir}"
}
```

**Common patterns**:
- `"cwd": "{path}"` - For folders: execute IN the folder; for files: execute at the file location (usually not what you want for files)
- `"cwd": "{dir}"` - Always execute in parent directory (consistent for files and folders)
- `"cwd": "{workspace}"` - Execute in workspace root
- `"cwd": "/tmp"` - Execute in specific absolute directory

**Important**: When using `{path}` in `cwd`, it works differently for files vs folders:
- Folder: `{path}` = folder path ✓ (works as working directory)
- File: `{path}` = file path ✗ (invalid as working directory)

For most use cases, omit `cwd` to use the smart default, or use `{dir}` for consistent behavior.

### Auto-append Behavior

If your command doesn't contain any placeholder, the full path is automatically appended:

```json
{
  "command": "G"
}
// Executes as: G "/path/to/selected/item"
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
  "command": "git blame {path}",
  "cwd": "{dir}",
  "contexts": ["explorer"],
  "icon": "git-commit"
}
```

### Open Git Remote in Browser
```json
{
  "id": "openOrigin",
  "label": "Open Git Origin",
  "command": "G",
  "contexts": ["explorer", "scm"],
  "icon": "link-external"
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
  "command": "cp {path} {path}.copy",
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
  "command": "/home/user/scripts/process.sh {path}",
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
- Look for `[actionId]` prefixed messages showing the exact command and working directory
- Verify the command exists in your system PATH
- Test the command manually in a terminal from the same working directory
- Check file path has no special characters that need escaping

### Working Directory Issues
- Use Developer Console to see resolved paths
- For folders, omit `cwd` or use `{dir}` for parent directory
- Avoid using `{path}` in `cwd` for files (it points to the file, not a directory)
- Check workspace vs user settings - workspace settings override user settings

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

### Package Extension
```bash
npm run package
```

### Install for Testing
```bash
npm run reinstall
```

### Debug
Press `F5` in VS Code to launch Extension Development Host.

### View Extension Logs
1. `Help` → `Toggle Developer Tools` (or `Cmd/Ctrl+Shift+I`)
2. Go to `Console` tab
3. Filter by extension name or action ID

## Requirements

- VS Code 1.80.0 or higher
- Node.js 18+ (20+ recommended for packaging)
- Commands configured must be available in your system PATH

## Security Note

This extension executes system commands based on user configuration. Only configure commands you trust and understand.

## Inspired By

This extension draws inspiration from [Actions for Nautilus](https://github.com/bassmanitram/actions-for-nautilus), which provides similar functionality for the GNOME Files (Nautilus) file manager.

## License

Apache-2.0
