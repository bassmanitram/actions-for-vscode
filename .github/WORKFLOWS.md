# GitHub Actions Workflows

This project includes two GitHub Actions workflows for automated CI/CD.

## Workflows

### 1. CI Workflow (`.github/workflows/ci.yml`)

**Triggers**: Push or PR to `main` or `develop` branches

**Purpose**: Continuous Integration testing

**What it does**:
- Tests on multiple Node.js versions (18, 20, 22)
- Installs dependencies
- Compiles TypeScript
- Checks for TypeScript errors
- Verifies extension can be packaged

**Usage**: Runs automatically on every push/PR to ensure code quality.

---

### 2. Release Workflow (`.github/workflows/release.yml`)

**Triggers**: Push of version tags (e.g., `v0.1.0`, `v1.0.0-beta.1`)

**Purpose**: Build and publish releases

**What it does**:
1. Verifies `package.json` version matches tag
2. Compiles TypeScript
3. Packages extension as `.vsix` file
4. Extracts release notes from `CHANGELOG.md`
5. Creates GitHub Release with `.vsix` artifact
6. Marks as pre-release for tags containing `pre`, `rc`, `alpha`, or `beta`

**How to create a release**:

```bash
# 1. Update version in package.json
npm version 0.2.0  # or patch, minor, major

# 2. Update CHANGELOG.md
# Add entry like:
## [0.2.0] - 2025-02-11
### Added
- New feature description

# 3. Commit changes
git add package.json CHANGELOG.md
git commit -m "Release v0.2.0"

# 4. Create and push tag
git tag v0.2.0
git push origin main
git push origin v0.2.0

# The workflow will automatically:
# - Build the .vsix file
# - Create a GitHub release
# - Attach the .vsix as a downloadable asset
```

---

## Version Format

**Tag format**: `vX.Y.Z[-suffix]`

Examples:
- `v0.1.0` - Standard release
- `v1.0.0-beta.1` - Pre-release (marked as pre-release on GitHub)
- `v2.0.0-rc.1` - Release candidate (marked as pre-release)

**Important**: The version in `package.json` must match the tag (without the `v` prefix).

---

## Release Notes

The release workflow extracts notes from `CHANGELOG.md` automatically.

Format:
```markdown
## [0.2.0] - 2025-02-11

### Added
- New feature

### Fixed
- Bug fix

### Changed
- Modified behavior
```

If no matching version is found in CHANGELOG.md, it generates a default message.

---

## Artifacts

Both workflows upload artifacts:

- **CI**: Packages `.vsix` for verification (90 days retention)
- **Release**: Packages `.vsix` and attaches to GitHub Release (90 days retention)

Download from:
- Actions tab → Select workflow run → Artifacts section
- Releases tab → Select release → Assets section

---

## Comparison to Actions for Nautilus

| Feature | Actions for Nautilus | Actions For VSCode |
|---------|---------------------|-------------------|
| **Build output** | `.deb` package | `.vsix` extension |
| **Package tool** | `fakeroot make deb` | `vsce package` |
| **Version source** | `Makefile` | `package.json` |
| **CI testing** | None | Multiple Node versions |
| **Pre-release detection** | Same logic | Same logic |
| **Release notes** | `RELEASE-NOTES.md` | `CHANGELOG.md` |
| **Version format** | Debian (tildes) | Semantic (hyphens) |

Both workflows share similar structure and philosophy:
- Tag-triggered releases
- Version verification
- Automated artifact creation
- Release note extraction
- Pre-release marking
