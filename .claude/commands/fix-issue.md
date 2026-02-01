# Fix GitHub Issue

Fix GitHub issue #$ARGUMENTS

## Instructions

1. **Read the issue**: Use `gh issue view $ARGUMENTS --comments` to read the issue title, description, and all comments.

2. **Create a branch**:
   - Branch name format: `<short-description>-<issue-number>`
   - Keep it short (3-5 words max)
   - All lowercase, words separated by dashes
   - Example: `add-display-option-1` or `fix-font-size-42`
   - Create with: `git checkout -b <branch-name>`

3. **Understand and fix the issue**:
   - Read the relevant code files mentioned in the issue
   - Implement the fix or feature as described
   - Follow existing code patterns and conventions

4. **Create/update changeset**:
   - Create a changeset file in `.changeset/` with a descriptive name (e.g., `.changeset/fix-font-rendering.md`)
   - Format:
     ```markdown
     ---
     math-svg-mcp: patch
     ---

     Brief description of what changed
     ```
   - Use `patch` for bug fixes, `minor` for new features, `major` for breaking changes
   - **Keep the changeset updated** as you make changes - if the scope or nature of changes evolves, update the changeset description and bump type accordingly

5. **Run tests**: Execute `npm test` and fix any failures.

6. **Run linter**: Execute `npm run lint` and fix any issues. Use `npm run check` if needed.

7. **Commit changes**:
   - Stage all relevant files
   - Write a clear commit message referencing the issue
   - Include "Fixes #$ARGUMENTS" in the commit body to auto-close the issue
   - **Do NOT use conventional commit prefixes** (feat:, fix:, etc.) - they override changeset versioning

8. **Create a pull request**:
   - Push the branch to origin
   - Create PR with `gh pr create`
   - Reference the issue in the PR description
   - Include a summary of changes and test plan
