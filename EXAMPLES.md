# Actions For VSCode - Example Configurations

## Quick Start

Add this to your VS Code `settings.json`:

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

## Common Examples

### Git Operations

```json
{
  "actionsForVscode.actions": [
    {
      "id": "gitLog",
      "label": "Git Log (last 20)",
      "command": "git log --oneline -n 20 {file}",
      "cwd": "{dir}",
      "contexts": ["explorer", "scm"],
      "icon": "git-commit",
      "showNotification": false
    },
    {
      "id": "gitBlame",
      "label": "Git Blame",
      "command": "git blame {file}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "person",
      "showNotification": false
    },
    {
      "id": "gitDiff",
      "label": "Git Diff",
      "command": "git diff {file}",
      "cwd": "{dir}",
      "contexts": ["explorer", "scm"],
      "icon": "diff"
    },
    {
      "id": "gitStatus",
      "label": "Git Status",
      "command": "git status",
      "cwd": "{workspace}",
      "contexts": ["explorer"],
      "icon": "git-branch"
    }
  ]
}
```

### File Operations

```json
{
  "actionsForVscode.actions": [
    {
      "id": "copyPath",
      "label": "Copy Full Path",
      "command": "echo -n {file} | xclip -selection clipboard",
      "contexts": ["explorer", "editor"],
      "icon": "clippy"
    },
    {
      "id": "makeExecutable",
      "label": "Make Executable",
      "command": "chmod +x {file}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "file-binary"
    },
    {
      "id": "duplicateFile",
      "label": "Duplicate File",
      "command": "cp {file} {file}.copy",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "files"
    },
    {
      "id": "showFileInfo",
      "label": "File Info",
      "command": "stat {file} | zenity --text-info --title='File Info'",
      "contexts": ["explorer"],
      "icon": "info"
    }
  ]
}
```

### Terminal Operations

```json
{
  "actionsForVscode.actions": [
    {
      "id": "openTerminalHere",
      "label": "Open Terminal Here",
      "command": "gnome-terminal",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "terminal"
    },
    {
      "id": "openTerminalAsRoot",
      "label": "Open Terminal as Root",
      "command": "gnome-terminal -- sudo -i",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "terminal-bash"
    }
  ]
}
```

### External Tools

```json
{
  "actionsForVscode.actions": [
    {
      "id": "openInVim",
      "label": "Open in Vim",
      "command": "gnome-terminal -- vim {file}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "edit"
    },
    {
      "id": "compareFiles",
      "label": "Compare with Meld",
      "command": "meld {files}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "diff"
    },
    {
      "id": "openFileManager",
      "label": "Open in File Manager",
      "command": "nautilus {dir}",
      "contexts": ["explorer", "editor"],
      "icon": "folder-opened"
    }
  ]
}
```

### Compression & Archives

```json
{
  "actionsForVscode.actions": [
    {
      "id": "compressToZip",
      "label": "Compress to ZIP",
      "command": "zip -r {filename}.zip {file}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "archive"
    },
    {
      "id": "compressToTarGz",
      "label": "Compress to tar.gz",
      "command": "tar -czf {filename}.tar.gz {file}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "package"
    },
    {
      "id": "extract",
      "label": "Extract Archive",
      "command": "aunpack {file}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "file-zip"
    }
  ]
}
```

### Development Tools

```json
{
  "actionsForVscode.actions": [
    {
      "id": "runPytest",
      "label": "Run pytest",
      "command": "pytest {file}",
      "cwd": "{workspace}",
      "contexts": ["explorer"],
      "icon": "beaker"
    },
    {
      "id": "formatPython",
      "label": "Format with Black",
      "command": "black {file}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "sparkle"
    },
    {
      "id": "eslintFix",
      "label": "ESLint Fix",
      "command": "eslint --fix {file}",
      "cwd": "{workspace}",
      "contexts": ["explorer"],
      "icon": "wrench"
    },
    {
      "id": "buildDocker",
      "label": "Build Docker Image",
      "command": "docker build -t myapp .",
      "cwd": "{workspace}",
      "contexts": ["explorer"],
      "icon": "server"
    },
    {
      "id": "npmBuild",
      "label": "NPM Build",
      "command": "npm run build",
      "cwd": "{workspace}",
      "contexts": ["explorer"],
      "icon": "tools"
    }
  ]
}
```

### Custom Scripts

```json
{
  "actionsForVscode.actions": [
    {
      "id": "runCustomAnalysis",
      "label": "Run Analysis Script",
      "command": "/home/user/scripts/analyze.sh {file}",
      "cwd": "{workspace}",
      "contexts": ["explorer"],
      "icon": "graph"
    },
    {
      "id": "processMultiple",
      "label": "Batch Process",
      "command": "/home/user/scripts/batch_process.sh {files}",
      "cwd": "{dir}",
      "contexts": ["explorer"],
      "icon": "layers"
    }
  ]
}
```

## Advanced Configuration

### Using Custom Working Directory

```json
{
  "id": "runInTemp",
  "label": "Run in /tmp",
  "command": "my-command {file}",
  "cwd": "/tmp"
}
```

### Workspace Root Commands

```json
{
  "id": "runTests",
  "label": "Run All Tests",
  "command": "npm test",
  "cwd": "{workspace}",
  "showNotification": true
}
```

### Disable Notifications for Quiet Commands

```json
{
  "id": "silentBackup",
  "label": "Backup File",
  "command": "cp {file} {file}.bak",
  "cwd": "{dir}",
  "showNotification": false
}
```

### Multiple Contexts

```json
{
  "id": "universalAction",
  "label": "My Tool",
  "command": "mytool {file}",
  "cwd": "{dir}",
  "contexts": ["explorer", "scm", "editor"]
}
```

### Temporarily Disable Action

```json
{
  "id": "dangerousOperation",
  "label": "Dangerous Operation",
  "command": "rm -rf {file}",
  "enabled": false
}
```

## Working Directory Examples

The `cwd` property controls where commands execute:

```json
{
  "actionsForVscode.actions": [
    {
      "id": "gitStatusHere",
      "label": "Git Status (current dir)",
      "command": "git status",
      "cwd": "{dir}",
      "icon": "git-branch"
    },
    {
      "id": "gitStatusWorkspace",
      "label": "Git Status (workspace root)",
      "command": "git status",
      "cwd": "{workspace}",
      "icon": "git-branch"
    },
    {
      "id": "lsHere",
      "label": "List Files",
      "command": "ls -la > /tmp/files.txt",
      "cwd": "{dir}",
      "icon": "folder"
    }
  ]
}
```

## Tips

1. **Test commands in terminal first** before adding them to ensure they work
2. **Use absolute paths** for custom scripts to avoid PATH issues
3. **Set correct `cwd`** - use `{dir}` for file operations, `{workspace}` for project commands
4. **Check console logs** (`Help` → `Toggle Developer Tools`) for debugging
5. **Start simple** with one action, then add more as needed

## Popular Icons

Common VS Code icon IDs you can use:

- `file`, `folder`, `folder-opened`
- `git-commit`, `git-branch`, `git-merge`
- `terminal`, `terminal-bash`
- `edit`, `pencil`, `sparkle`
- `gear`, `settings`, `wrench`
- `archive`, `package`, `file-zip`
- `beaker`, `bug`, `graph`
- `symbol-class`, `symbol-method`, `symbol-file`
- `link`, `link-external`
- `trash`, `close`, `check`
- `tools`

Full list: [VS Code Icon Reference](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing)
