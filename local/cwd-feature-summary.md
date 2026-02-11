# Working Directory (cwd) Feature - Summary

## What Was Added

The `cwd` (current working directory) option allows you to specify where commands execute.

## Changes Made

### 1. Package Configuration (`package.json`)
- Added `cwd` property to action schema
- Type: `string`
- Optional
- Supports placeholders: `{file}`, `{dir}`, `{workspace}`
- Default: `{dir}` (directory containing the file)

### 2. TypeScript Interface (`src/extension.ts`)
- Added `cwd?: string` to `CustomAction` interface
- Added working directory resolution logic
- Placeholder replacement in `cwd` value
- Quote removal for directory paths
- Logging of working directory for debugging

### 3. Documentation Updates
- `README.md` - Added `cwd` to configuration table and examples
- `EXAMPLES.md` - Added `cwd` to all examples showing best practices
- Added new section "Working Directory Examples"

## How It Works

### Default Behavior
If `cwd` is not specified, commands execute in the file's directory (`{dir}`).

### Placeholder Support
The `cwd` property supports these placeholders:
- `{file}` - Full path to file (resolves to its directory)
- `{dir}` - Directory containing the file
- `{workspace}` - Workspace root directory

### Example Configurations

**Execute in file's directory:**
```json
{
  "id": "gitLog",
  "command": "git log {file}",
  "cwd": "{dir}"
}
```

**Execute in workspace root:**
```json
{
  "id": "npmBuild",
  "command": "npm run build",
  "cwd": "{workspace}"
}
```

**Execute in specific directory:**
```json
{
  "id": "runInTemp",
  "command": "my-command {file}",
  "cwd": "/tmp"
}
```

## Use Cases

### Git Operations
Commands like `git status` should run in the repository root:
```json
{
  "command": "git status",
  "cwd": "{workspace}"
}
```

### File Operations
Commands operating on specific files should run in their directory:
```json
{
  "command": "chmod +x {file}",
  "cwd": "{dir}"
}
```

### Build Tools
Build commands typically need workspace root:
```json
{
  "command": "npm test",
  "cwd": "{workspace}"
}
```

### Terminal Operations
Opening terminals should use the file's directory:
```json
{
  "command": "gnome-terminal",
  "cwd": "{dir}"
}
```

## Implementation Details

### Execution Flow
1. User triggers action on a file
2. Extension resolves placeholders in `command`
3. Extension resolves placeholders in `cwd` (if specified)
4. Extension removes quotes from `cwd` path
5. Command executes with `child_process.exec(command, { cwd: workingDir })`

### Logging
Working directory is logged to console for debugging:
```
[actionId] Executing command: git status
[actionId] Working directory: /home/user/project
```

View logs: `Help` → `Toggle Developer Tools` → `Console` tab

## Comparison to Actions for Nautilus

| Feature | Nautilus | VS Code |
|---------|----------|---------|
| Property name | `cwd` | `cwd` |
| Placeholder support | Yes | Yes |
| Default | Selection directory | File directory |
| Workspace placeholder | No | `{workspace}` |

## Testing

Compile and verify:
```bash
npm run compile
```

No TypeScript errors should appear.

## Next Steps

After committing these changes:
1. Rebuild extension: `npm run compile`
2. Repackage: `vsce package`
3. Reinstall: `code --install-extension actions-for-vscode-0.1.0.vsix`
4. Test with various `cwd` configurations
