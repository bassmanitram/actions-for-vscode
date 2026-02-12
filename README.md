# Actions For VSCode

A VS Code extension that adds custom commands to context menus in the Explorer, Source Control, and Editor views.

## Features

- Visual settings manager with form-based interface
- Multiple custom actions with configurable commands
- Context-aware menu entries (Explorer, Source Control, Editor)
- Command execution in background with configurable working directory
- Placeholder support for dynamic file paths
- Enable/disable actions, customize notifications, add icons
- Quick picker interface for action selection

## Installation

### Quick Install

```bash
git clone https://github.com/bassmanitram/actions-for-vscode.git
cd actions-for-vscode
./install.sh
```

The script will install dependencies, compile TypeScript, package the extension, and install it into VS Code.

### Manual Install

```bash
npm install
npm run compile
npm run package
code --install-extension $(ls -t *.vsix | head -n1)
```

### NPM Scripts

- `npm run compile` - Compile TypeScript
- `npm run package` - Create .vsix package
- `npm run reinstall` - Compile, package, and install
- `npm run watch` - Watch mode for development

### Development Mode

1. Clone the repository
2. Run `npm install`
3. Run `npm run compile`
4. Press `F5` to open Extension Development Host

## Configuration

### Visual Settings Manager

The extension provides a form-based interface for managing actions:

1. Open Command Palette (`Cmd/Ctrl+Shift+P`)
2. Type "Actions For VSCode: Manage Actions"
3. Add, edit, or delete actions using the visual interface

Alternatively, open VS Code Settings, search for "Actions For VSCode", and click the link at the top of the Actions setting.

The visual manager provides:
- Form validation for required fields and ID format
- Context selection with checkboxes
- Field descriptions and help text
- Duplicate ID detection
- Direct link to icon reference

### JSON Configuration

For direct JSON editing:

1. Open Command Palette
2. Type "Actions For VSCode: Open Settings"
3. Edit the `actionsForVscode.actions` array

Basic example:

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

Multiple actions example:

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
    }
  ]
}
```

## Action Properties

Each action supports the following properties:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | string | Yes | - | Unique identifier (alphanumeric, hyphens, underscores) |
| `label` | string | Yes | - | Text shown in the menu |
| `command` | string | Yes | - | Command to execute |
| `cwd` | string | No | auto | Working directory (supports placeholders) |
| `contexts` | string[] | No | `["explorer"]` | Where to show: `explorer`, `scm`, `editor` |
| `icon` | string | No | - | VS Code icon ID ([reference](https://code.visualstudio.com/api/references/icons-in-labels)) |
| `showNotification` | boolean | No | `true` | Show success/error notifications |
| `enabled` | boolean | No | `true` | Enable or disable this action |

## Command Placeholders

Use these placeholders in commands and working directory paths:

| Placeholder | Files | Folders | Description |
|-------------|-------|---------|-------------|
| `{path}` | `/home/user/project/file.txt` | `/home/user/project/folder` | Full path to selected item |
| `{file}` | `file.txt` | `folder` | Name only (no path) |
| `{dir}` | `/home/user/project` | `/home/user/project` | Parent directory |
| `{filename}` | `file.txt` | `folder` | Alias for `{file}` |
| `{files}` | `"/file1.txt" "/file2.txt"` | - | All selected files (quoted, space-separated) |
| `{workspace}` | `/home/user/project` | `/home/user/project` | Workspace root |

### Placeholder Examples

For file `/home/user/project/src/main.ts`:
- `{path}` → `/home/user/project/src/main.ts`
- `{file}` → `main.ts`
- `{dir}` → `/home/user/project/src`
- `{workspace}` → `/home/user/project`

For folder `/home/user/project/src`:
- `{path}` → `/home/user/project/src`
- `{file}` → `src`
- `{dir}` → `/home/user/project`
- `{workspace}` → `/home/user/project`

### Working Directory

The `cwd` property specifies where commands execute. It supports all placeholders.

Default behavior when `cwd` is not specified:
- Files: Execute in the file's parent directory
- Folders: Execute in the folder itself

Example:

```json
{
  "id": "gitStatus",
  "label": "Git Status",
  "command": "git status",
  "cwd": "{dir}"
}
```

Common patterns:
- `{dir}` - Parent directory (consistent for files and folders)
- `{workspace}` - Workspace root
- `/tmp` - Specific absolute directory

Note: Using `{path}` in `cwd` works for folders but not for files (file path is not a valid directory).

### Auto-append Behavior

If a command contains no placeholder, the full path is automatically appended:

```json
{
  "command": "G"
}
// Executes as: G "/path/to/selected/item"
```

## Usage

### From Explorer
1. Right-click on a file or folder
2. Select "Actions For VSCode..."
3. Choose the action to execute

### From Source Control
1. Right-click on a changed file in the Source Control view
2. Select "Actions For VSCode..."
3. Choose the action

### From Editor
1. Right-click in an open file
2. Select "Actions For VSCode..."
3. Choose the action

## Settings

### Command Timeout

Configure maximum execution time for commands:

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

### Build Commands
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

### File Operations
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
  "label": "Run Script",
  "command": "/home/user/scripts/process.sh {path}",
  "cwd": "{workspace}",
  "contexts": ["explorer"]
}
```

### Multiple File Operations
```json
{
  "id": "compressFiles",
  "label": "Compress Selected",
  "command": "tar -czf archive.tar.gz {files}",
  "cwd": "{dir}",
  "contexts": ["explorer"],
  "icon": "archive"
}
```

## Troubleshooting

### Commands Not Appearing
- Verify `enabled: true` is set (or omitted, as it defaults to true)
- Check the `contexts` array includes the correct context
- Reload VS Code: `Cmd/Ctrl+Shift+P` → "Developer: Reload Window"

### Command Execution Fails
- Open Developer Console: `Help` → `Toggle Developer Tools` → `Console` tab
- Look for `[actionId]` prefixed messages showing command and working directory
- Verify the command exists in your system PATH
- Test the command manually in a terminal from the same working directory

### Working Directory Issues
- Check Developer Console for resolved paths
- For folders, omit `cwd` or use `{dir}` for parent directory
- Avoid using `{path}` in `cwd` for files
- Verify workspace vs user settings (workspace settings override user settings)

### Visual Settings Manager Issues
- If the manager doesn't open, reload VS Code
- Check Developer Console for JavaScript errors
- Verify the extension is activated

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

### Package
```bash
npm run package
```

### Debug
Press `F5` in VS Code to launch Extension Development Host.

### View Logs
1. Open Developer Tools: `Help` → `Toggle Developer Tools`
2. Go to Console tab
3. Filter by extension name or action ID

## Requirements

- VS Code 1.80.0 or higher
- Node.js 18+ (20+ recommended for packaging)
- Commands must be available in system PATH

## Security

This extension executes system commands based on user configuration. Only configure commands you trust and understand.

## Related Projects

[Actions for Nautilus](https://github.com/bassmanitram/actions-for-nautilus) provides similar functionality for the GNOME Files (Nautilus) file manager.

## License

Apache-2.0
