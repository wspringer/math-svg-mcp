# Finalize Pull Request

Review and finalize the current pull request before merging.

## Instructions

1. **Get current branch and PR info**:
   - Run `git branch --show-current` to get the current branch
   - First try `gt ls` to check if this is a Graphite-managed stack
   - If using Graphite: run `gt info` to get branch details
   - Run `gh pr view --json title,body,number` to get the PR details
   - If no PR exists yet, inform the user and stop

2. **Review the PR title**:
   - Should be concise and descriptive
   - Should follow conventional format if applicable (e.g., "Fix reconnect logic" or "Add multi-client support")
   - Should NOT include issue numbers (those go in the body)

3. **Review the PR description**:
   - Should have a clear summary of changes
   - Should reference any related issues (e.g., "Fixes #123" or "Closes #123")
   - Should include a test plan if applicable

4. **Review changeset files**:
   - List all `.changeset/*.md` files
   - For each changeset, verify:
     - The package names match those in `knope.toml` (valid packages: `math-svg-mcp`)
     - The bump type is appropriate (`patch` for fixes, `minor` for features, `major` for breaking changes)
     - The description accurately reflects the changes
   - Check that changesets exist for all packages that were modified in this PR
   - Check for stale changesets that don't apply to this PR's changes

5. **Check for issues**:
   - If using Graphite: run `gt log short` to understand the stack structure
   - Determine the base branch (use `gt trunk` if Graphite, otherwise `main`)
   - Run `git diff <base>..HEAD --name-only` to see changed files in this branch
   - Verify changesets cover the changed packages
   - Look for any inconsistencies between PR description and actual changes

6. **Report findings**:
   - Summarize what looks good
   - List any issues found with specific recommendations
   - If everything looks good, confirm the PR is ready to merge

7. **Offer to fix issues**:
   - If there are problems with the PR title/description, offer to update them using `gh pr edit`
   - If changesets need updating, offer to edit them
   - Make changes only after user confirms

8. **Final sync (if using Graphite)**:
   - If changes were made, ask if user wants to run `gt sync` to update the stack
