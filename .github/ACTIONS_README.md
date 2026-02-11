# GitHub Configuration

This directory contains GitHub-specific configuration files.

## Contents

- **workflows/** - GitHub Actions CI/CD workflows
  - `ci.yml` - Continuous Integration testing
  - `release.yml` - Automated release publishing
- **WORKFLOWS.md** - Detailed workflow documentation

## Quick Start

### Running Tests
Tests run automatically on every push/PR to `main` or `develop`.

### Creating a Release
```bash
npm version 0.2.0
# Update CHANGELOG.md
git add package.json CHANGELOG.md
git commit -m "Release v0.2.0"
git tag v0.2.0
git push origin main --tags
```

See [WORKFLOWS.md](WORKFLOWS.md) for complete documentation.
