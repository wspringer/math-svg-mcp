# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

math-svg-mcp is an MCP (Model Context Protocol) server that converts LaTeX math expressions to SVG using MathJax.

## Common Commands

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint and format
npm run lint
npm run check

# Run in development mode
npm run dev
```

## Changesets

This project uses [knope](https://knope.tech) with changesets for versioning. Changeset format:

```markdown
---
math-svg-mcp: patch
---

Description of the change
```

### Choosing the Correct Bump Type

| Bump | When to use | Examples |
|------|-------------|----------|
| `patch` | Bug fixes, small improvements | Fix SVG rendering bug, improve error messages |
| `minor` | New features, new options | Add new tool, add configuration option |
| `major` | Breaking changes | Change tool response format, remove options |

Changesets should be:

- **Atomic**: Each changeset describes one logical change
- **Accurate**: Descriptions should precisely reflect what changed
- **Up-to-date**: Keep changesets current while the PR is open

**Common mistakes to avoid:**

- Don't use quotes: `"math-svg-mcp": patch` -> `math-svg-mcp: patch`
- Never leave front matter empty (`---\n---` will break knope)
- Don't run `knope prepare-release` locally - it's handled automatically by the knope-bot GitHub App

## Commit Messages

**NEVER use conventional commit prefixes** like `feat:`, `fix:`, `chore:`, etc.

The knope-bot parses these prefixes and will override the changeset version bump. A `feat:` commit forces a minor bump even if the changeset says `patch`.

```
# Good
Add fontSize option to latex_to_svg
Fix SVG viewBox calculation
Update documentation

# Bad - will break versioning
feat: add fontSize option
fix: SVG viewBox calculation
docs: update documentation
```
