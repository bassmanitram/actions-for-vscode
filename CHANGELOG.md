# Changelog

All notable changes to the "Actions For VSCode" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-02-11

### Added
- New `{path}` placeholder for full path to selected item (file or folder)
- Enhanced debug logging for troubleshooting command execution
- Explicit shell and environment configuration for command execution
- Working directory existence validation before command execution
- Comprehensive placeholder documentation with file vs folder behavior

### Changed
- **BREAKING**: `{file}` placeholder now returns filename only (not full path)
- Use `{path}` for full path (previous `{file}` behavior)
- Improved working directory defaults:
  - Files: execute in parent directory
  - Folders: execute in the folder itself
- Updated all documentation examples to use `{path}` where appropriate
- Enhanced error messages with more context

### Fixed
- Fixed directory detection for folder selections
- Fixed `{file}` placeholder in `cwd` causing "directory does not exist" errors
- Fixed shell execution errors (spawn /bin/sh ENOENT)
- Corrected path parsing to properly handle folders vs files

### Documentation
- Added placeholder comparison table showing file vs folder behavior
- Added troubleshooting section for working directory issues
- Added note about workspace settings overriding user settings
- Clarified `cwd` default behavior
- Added developer console instructions for debugging

## [0.1.0] - 2025-02-10

### Added
- Initial release
- Support for custom actions in Explorer, Source Control, and Editor contexts
- Configurable commands with placeholder support
- Working directory control
- Multiple file selection support
- Notification system
- Icon support for actions
- Command timeout configuration
- Auto-append behavior for commands without placeholders
- Installation script for easy setup

### Placeholders
- `{file}` - Full path to selected file (changed in 0.3.0)
- `{files}` - Multiple selected files
- `{dir}` - Directory containing file
- `{filename}` - Filename without path
- `{workspace}` - Workspace root
