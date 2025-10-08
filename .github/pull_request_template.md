## Description
<!-- Provide a clear description of what this PR does -->

## Type of Change
<!-- Mark the relevant option with an 'x' -->

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code quality improvement (refactoring, types, tests)
- [ ] Performance improvement

## Related Issue
<!-- Link to related issue(s) -->
Fixes #(issue number)

## Changes Made
<!-- List the specific changes in this PR -->

-
-
-

## New MCP Tools (if applicable)
<!-- If adding new tools, list them here -->

### Tool Name: `toolName`
- **Description:** What the tool does
- **Parameters:** List required and optional parameters
- **Clockify API Endpoint:** Link to API docs
- **Tested with:** MCP Inspector / Claude Desktop / VSCode

## Testing
<!-- Describe how you tested these changes -->

- [ ] Tested with MCP Inspector
- [ ] Tested with Claude Desktop
- [ ] Tested with VSCode MCP Extension
- [ ] Added/updated unit tests
- [ ] Verified Clockify API behavior matches implementation

### Test Scenario
<!-- Describe the test scenario -->

```
Tool call: toolName
Parameters: { ... }
Expected result: ...
Actual result: ...
```

## Checklist
<!-- Mark completed items with an 'x' -->

- [ ] Code follows the project's style guidelines
- [ ] Self-review performed
- [ ] Code is commented, particularly in complex areas
- [ ] Documentation updated (README.md, AGENTS.md if applicable)
- [ ] TypeScript types added/updated in `types/clockify.ts`
- [ ] No breaking changes (or breaking changes are documented)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes tested locally

## API Compatibility
<!-- If this PR changes API behavior -->

- [ ] Backward compatible with existing tool calls
- [ ] No changes to existing tool schemas
- [ ] New optional parameters only (no required parameter changes)
- [ ] OR: Breaking changes documented in migration guide

## Additional Context
<!-- Any additional information, screenshots, or context -->

## Post-Merge Checklist
<!-- To be completed after merge -->

- [ ] Update version in package.json (if needed)
- [ ] Add to CHANGELOG.md (if maintained)
- [ ] Publish to NPM (if applicable)
