# Chef Portal - Project Rules

## Pre-PR Checklist

Before creating any Pull Request, you MUST run these checks and ensure they pass:

1. **Lint check**: `pnpm run lint` — fix all ESLint errors before committing
2. **Build check**: `pnpm run build` — ensure the project builds without errors
3. **E2E tests**: `pnpm run test:e2e` — ensure all Playwright tests pass

If any check fails, fix the issue before proceeding with the PR. Do NOT create a PR with failing checks.

## Commit Strategy

- Each logical fix gets its own commit with a clear, descriptive message
- Group related changes (e.g., fixing the same bug across multiple files) into a single commit
- Use conventional commit prefixes: `fix:`, `refactor:`, `security:`, `chore:`
- After each commit, show a summary of what was fixed and why

## Icons

- **NEVER use Lucide icons** in this project — use `@shopify/polaris-icons` exclusively
- Import from `@shopify/polaris-icons` (e.g., `import { EditIcon, DeleteIcon } from "@shopify/polaris-icons"`)
- Polaris icons use `fill` not `stroke` — always add `fill-current` or `fill-[color]` class
- When migrating existing code, replace all Lucide imports with Polaris icon equivalents

## Error Handling Standards

- All user-facing errors must be chef-friendly (no technical jargon)
- Never expose stack traces, internal paths, or API details to users
- Provide actionable guidance in error messages (what the chef can do next)
