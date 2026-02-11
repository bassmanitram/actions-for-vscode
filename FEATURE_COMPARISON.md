# Feature Comparison: Actions for Nautilus vs Actions For VSCode

## Core Concept Alignment

Both extensions share the same philosophical approach:
- User-defined custom actions
- JSON-based configuration
- Multiple actions with labels and commands
- Context-aware display
- Enable/disable individual actions

## Feature Matrix

| Feature | Actions for Nautilus | Actions For VSCode (VS Code) |
|---------|---------------------|----------------------------------|
| **Configuration Format** | JSON file | VS Code settings (JSON) |
| **Multiple Actions** | ✓ Arrays of commands/menus | ✓ Array of actions |
| **Custom Labels** | ✓ `label` property | ✓ `label` property |
| **Unique IDs** | ✓ (implicit via structure) | ✓ `id` property (required) |
| **Enable/Disable** | ✓ `disabled` property | ✓ `enabled` property |
| **Command Execution** | ✓ Shell/direct | ✓ Background via child_process |
| **Nested Menus** | ✓ Submenus supported | ⚠️ Single-level Quick Pick |
| **Icons** | ⨯ | ✓ VS Code icon system |
| **Graphical Configurator** | ✓ Web-based UI | ✓ VS Code settings UI |
| **Context Filtering** | ✓ Advanced (mimetype, filetype, count, permissions) | ✓ Basic (explorer/scm/editor) |
| **Placeholders** | ✓ Extensive (%f, %F, %d, etc.) | ✓ Simplified ({file}, {files}, {dir}, {filename}) |
| **Multiple Selection** | ✓ %F for all files | ✓ {files} placeholder |
| **Working Directory** | ✓ `cwd` property | ✓ Workspace root or file directory |
| **Shell Support** | ✓ `use_shell` flag | ✓ Always uses shell |
| **Interpolation Modes** | ✓ v1/v2 interpolation | ⨯ Single mode |
| **External Validation** | ✓ `show-if-true` | ⨯ |
| **Max/Min Items** | ✓ Selection count filters | ⨯ |
| **Pattern Matching** | ✓ Glob/regex patterns | ⨯ |
| **Debug Mode** | ✓ `debug` flag | ✓ Console logging |
| **Hot Reload** | ✓ File watcher | ✓ Config change detection |
| **Backup Config** | ✓ Automatic backups | ⨯ (VS Code handles settings) |

## Configuration Examples Side-by-Side

### Actions for Nautilus
```json
{
  "actions": [
    {
      "type": "command",
      "label": "Open in gedit",
      "command_line": "gedit %F",
      "filetypes": ["!directory", "standard"]
    },
    {
      "type": "menu",
      "label": "Folder Actions",
      "actions": [
        {
          "label": "Exec command here",
          "command_line": "$(zenity --entry)",
          "cwd": "%f",
          "max_items": 1
        }
      ]
    }
  ]
}
```

### Actions For VSCode (VS Code)
```json
{
  "actionsForVscode.actions": [
    {
      "id": "openInEditor",
      "label": "Open in gedit",
      "command": "gedit {file}",
      "contexts": ["explorer"]
    },
    {
      "id": "execCommand",
      "label": "Exec command here",
      "command": "zenity --entry | sh",
      "contexts": ["explorer"]
    }
  ]
}
```

## Placeholder Mapping

| Nautilus | VS Code | Description |
|----------|---------|-------------|
| `%f` | `{file}` | Single file path |
| `%F` | `{files}` | All selected files |
| `%d` | `{dir}` | Directory path |
| `%b` | `{filename}` | Filename only |
| `%u` | - | Single URI |
| `%U` | - | All URIs |
| `%p` | - | Port number |
| `%m` | - | Mimetype |
| ... | - | (Many more) |

## Design Philosophy Similarities

### 1. User Empowerment
Both extensions trust users to configure powerful commands and execute them safely.

### 2. Declarative Configuration
Both use JSON for clear, readable, version-controllable configuration.

### 3. Flexibility Over Constraints
Both prioritize configurability over rigid structure.

### 4. Context Awareness
Both show actions only where relevant (Nautilus: mimetype/filetype, VS Code: explorer/scm/editor).

### 5. Non-Invasive
Both integrate naturally into existing UI without overwhelming the user.

## Key Differences

### VS Code Constraints
- **No dynamic menus**: VS Code API doesn't support dynamic menu items, hence Quick Pick approach
- **Simpler context**: File manager has richer metadata (mimetype, permissions) than VS Code URI
- **No nested menus**: Quick Pick is flat (could be enhanced with separators)
- **Settings-based**: Uses VS Code settings rather than separate config file

### VS Code Advantages
- **Built-in UI**: VS Code settings editor with validation, autocomplete, documentation
- **Icon support**: Rich icon system built into VS Code
- **Type safety**: TypeScript with full type checking
- **Extension ecosystem**: Standard VS Code extension packaging and distribution

## Implementation Approach

### Actions for Nautilus
```
User edits config.json
    ↓
Python extension reads file
    ↓
Builds Nautilus menu items dynamically
    ↓
User clicks menu item
    ↓
Python executes command
```

### Actions For VSCode
```
User edits settings.json
    ↓
Extension reads configuration
    ↓
Registers commands and single menu entry
    ↓
User clicks "Custom Actions..."
    ↓
Quick Pick shows available actions
    ↓
User selects action
    ↓
TypeScript executes command via child_process
```

## Evolution Path

This extension could evolve to include:

### Phase 1 (Current)
- ✓ Multiple actions
- ✓ Basic placeholders
- ✓ Context filtering
- ✓ Background execution

### Phase 2 (Possible)
- Advanced filtering (file extensions, glob patterns)
- Environment variable support
- Conditional visibility
- Output capture options

### Phase 3 (Advanced)
- Command templates library
- Import/export configurations
- Preset action packs
- Community action registry

## Why This Approach?

The Quick Pick approach, while different from Nautilus's direct menu integration, provides:

1. **Scalability**: Works with many actions without cluttering menus
2. **Searchability**: Quick Pick is searchable/filterable
3. **Discoverability**: All actions visible at once
4. **Consistency**: Matches VS Code UX patterns
5. **Maintainability**: Simpler implementation without dynamic menu manipulation

## Summary

This extension successfully captures the **spirit** of Actions for Nautilus:
- Multiple configurable custom commands
- JSON-based configuration
- Context-aware display
- User empowerment through flexibility

While adapting to VS Code's constraints and patterns:
- Settings instead of config files
- Quick Pick instead of dynamic menus
- Simpler placeholders for simpler context
- TypeScript for type safety
