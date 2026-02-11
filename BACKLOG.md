# Backlog

## Technical Debt

### Functions: ESM Module Migration
**Priority**: Low
**Effort**: Medium

The functions package triggers a Node.js warning about module type:
```
Module type of eslint.config.js is not specified and it doesn't parse as CommonJS.
```

To fix properly, would need to:
1. Add `"type": "module"` to `functions/package.json`
2. Update all imports to include `.js` extensions (TypeScript ESM requirement)
3. Update tsconfig.json `moduleResolution` if needed

This is a performance overhead warning, not a breaking issue.

---

### Functions: Node.js Runtime Upgrade
**Priority**: Medium
**Deadline**: 2026-04-30 (deprecation), 2026-10-30 (decommission)

Current runtime: Node.js 20

Firebase warning:
> Runtime Node.js 20 will be deprecated on 2026-04-30 and will be decommissioned on 2026-10-30

**Action**: Upgrade to Node.js 22 before April 2026.

---

### Functions: firebase-functions Package Upgrade
**Priority**: Low
**Effort**: Medium (breaking changes expected)

Firebase warning:
> package.json indicates an outdated version of firebase-functions. Please upgrade using npm install --save firebase-functions@latest

Current version: `^6.4.0`

Note: Firebase warns there will be breaking changes when upgrading.

---

## Future Enhancements

### Alfie Daily Review: Separate Template
**Priority**: Low

Consider adding a separate template option for daily reviews to better handle the structured `captured` object (bodyState, intense, reflections, tomorrow, letGo).

Template variables could include:
- `{bodyState}`
- `{intense}` (formatted list)
- `{tomorrow}` (formatted list)
- `{letGo}` (formatted list)
