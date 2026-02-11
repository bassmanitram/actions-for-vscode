# Changelog

All notable changes to the "Actions For VSCode" extension.

## [0.1.0] - Initial Release

### Features
- Multiple configurable custom actions in VS Code settings
- Support for Explorer, Source Control, and Editor contexts
- Background command execution (no terminal window)
- Flexible placeholder system:
  - `{file}` - Single file path
  - `{files}` - Multiple selected files
  - `{dir}` - Directory path
  - `{filename}` - Filename only
- Auto-append file path if no placeholder specified
- Per-action configuration:
  - Enable/disable individual actions
  - Custom icons from VS Code icon set
  - Toggle notifications
  - Context filtering
- Quick Pick interface for action selection
- Command timeout configuration
- Proper error handling and logging

### Technical Details
- Written in TypeScript
- Uses Node.js `child_process` for background execution
- Dynamic command registration based on settings
- Configuration change monitoring with automatic reload
- Console logging for debugging

### Inspired By
Based on the concept of [Actions for Nautilus](https://github.com/bassmanitram/actions-for-nautilus) by bassmanitram, adapted for VS Code with similar flexibility and configurability.
