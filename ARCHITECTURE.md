# Actions For VSCode - Architecture Overview

## Extension Flow

```
┌─────────────────────────────────────────────────────────────┐
│  VS Code Settings (settings.json)                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ actionsForVscode.actions: [                           │  │
│  │   { id, label, command, contexts, icon, ... },       │  │
│  │   { id, label, command, contexts, icon, ... },       │  │
│  │   ...                                                 │  │
│  │ ]                                                     │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Extension Activation (onStartupFinished)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  1. Read configuration                                │  │
│  │  2. Register commands for each action                 │  │
│  │  3. Register context menu entries                     │  │
│  │  4. Watch for config changes                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  User Right-clicks in Explorer/SCM/Editor                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Context Menu Shows: "Actions For VSCode..."                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Quick Pick Dialog (filtered by context)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Command Execution (Background via child_process)           │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

### `package.json`
- Extension metadata and display name
- Command contributions
- Menu contributions (explorer, scm, editor)
- Configuration schema with defaults and validation
- Build scripts

### `extension.ts`
- **activate()**: Entry point, registers commands
- **executeAction()**: Executes configured command with placeholder replacement
- **showActionPicker()**: Displays Quick Pick dialog
- **Configuration monitoring**: Auto-reloads on settings change

### Settings Schema
- Defines action array structure
- Provides validation and defaults
- Generates VS Code settings UI

## Key Design Decisions

### Quick Pick Interface
VS Code doesn't support dynamic menu items, so we use a single menu entry that opens a Quick Pick dialog.

### Array-Based Configuration
Inspired by Actions for Nautilus, each action is a self-contained object in an array.

### Background Execution
Uses Node.js `child_process.exec()` for silent background execution.

### Placeholder System
Simple, clear placeholders: `{file}`, `{files}`, `{dir}`, `{filename}`
