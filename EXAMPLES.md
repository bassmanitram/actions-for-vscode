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
      "contexts": ["explorer", "scm"],
      "icon": "git-commit",
      "showNotification": false
    },
    {
      "id": "gitBlame",
      "label": "Git Blame",
      "command": "git blame {file}",
      "contexts": ["explorer"],
      "icon": "person",
      "showNotification": false
    },
    {
      "id": "gitDiff",
      "label": "Git Diff",
      "command": "git diff {file}",
      "contexts": ["explorer", "scm"],
      "icon": "diff"
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
      "contexts": ["explorer"],
      "icon": "file-binary"
    },
    {
      "id": "duplicateFile",
      "label": "Duplicate File",
      "command": "cp {file} {file}.copy",
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
      "command": "gnome-terminal --working-directory={dir}",
      "contexts": ["explorer"],
      "icon": "terminal"
    },
    {
      "id": "openTerminalAsRoot",
      "label": "Open Terminal as Root",
      "command": "gnome-terminal --working-directory={dir} -- sudo -i",
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
      "contexts": ["explorer"],
      "icon": "edit"
    },
    {
      "id": "compareFiles",
      "label": "Compare with Meld",
      "command": "meld {files}",
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
      "contexts": ["explorer"],
      "icon": "archive"
    },
    {
      "id": "compressToTarGz",
      "label": "Compress to tar.gz",
      "command": "tar -czf {filename}.tar.gz {file}",
      "contexts": ["explorer"],
      "icon": "package"
    },
    {
      "id": "extract",
      "label": "Extract Archive",
      "command": "aunpack {file}",
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
      "contexts": ["explorer"],
      "icon": "beaker"
    },
    {
      "id": "formatPython",
      "label": "Format with Black",
      "command": "black {file}",
      "contexts": ["explorer"],
      "icon": "sparkle"
    },
    {
      "id": "eslintFix",
      "label": "ESLint Fix",
      "command": "eslint --fix {file}",
      "contexts": ["explorer"],
      "icon": "wrench"
    },
    {
      "id": "buildDocker",
      "label": "Build Docker Image",
      "command": "docker build -t myapp {dir}",
      "contexts": ["explorer"],
      "icon": "server"
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
      "contexts": ["explorer"],
      "icon": "graph"
    },
    {
      "id": "processMultiple",
      "label": "Batch Process",
      "command": "/home/user/scripts/batch_process.sh {files}",
      "contexts": ["explorer"],
      "icon": "layers"
    }
  ]
}
```

## Advanced Configuration

### Disable Notifications for Quiet Commands

```json
{
  "id": "silentBackup",
  "label": "Backup File",
  "command": "cp {file} {file}.bak",
  "showNotification": false
}
```

### Multiple Contexts

```json
{
  "id": "universalAction",
  "label": "My Tool",
  "command": "mytool {file}",
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

## Tips

1. **Test commands in terminal first** before adding them to ensure they work
2. **Use absolute paths** for custom scripts to avoid PATH issues
3. **Quote placeholders** if you include them manually (extension auto-quotes them)
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

Full list: [VS Code Icon Reference](https://code.visualstudio.com/api/references/icons-in-labels#icon-listing)
