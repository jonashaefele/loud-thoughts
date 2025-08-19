# LoudThoughts - Next Steps & Roadmap

_Migration from AudioPen Obsidian Plugin completed on August 19, 2025_

## 🎯 Immediate Next Steps (Required)

### 1. Submit to Obsidian Community Store

**Status**: Ready for submission
**Priority**: High (blocks user migration)

**Steps**:

1. **Create GitHub Release**:

   ```bash
   cd /Users/jonas/dev/loud-thoughts
   git tag v1.0.0
   git push origin v1.0.0

   # Create release on GitHub with these files:
   # - plugin/dist/main.js
   # - plugin/dist/manifest.json
   # - plugin/dist/styles.css
   ```

2. **Submit to Obsidian**:
   - Fork [obsidian-releases](https://github.com/obsidianmd/obsidian-releases)
   - Add entry to `community-plugins.json`:
     ```json
     {
       "id": "loud-thoughts",
       "name": "LoudThoughts",
       "author": "Jonas Haefele",
       "description": "Sync your thoughts from AudioPen, VoiceNotes, and Alfie to Obsidian.",
       "repo": "jonashaefele/loud-thoughts"
     }
     ```
   - Submit PR with clear description

**Requirements Documentation**: [Obsidian Plugin Guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)

### 2. AudioPen Plugin Deprecation

**Status**: Deprecation notice prepared, needs final deployment
**Priority**: Medium (prevents user confusion)

**Steps**:

1. **Deploy final AudioPen update**:

   ```bash
   cd /Users/jonas/dev/obsidian/audiopen-obsidian
   # Version bump in manifest.json
   # Deploy with prominent migration notice
   ```

2. **After 3-6 months**: Submit removal request to obsidian-releases `obsolete.json`

### 3. Documentation Updates

**Status**: Needs completion
**Priority**: Medium

**Tasks**:

- Update README webhook instructions for new URL format
- Create migration guide for existing AudioPen users
- Update CLAUDE.md with final architecture decisions

---

## 🚀 Quick Wins & Improvements

### Performance & Reliability

1. **Node.js 20 Runtime Upgrade**

   - Functions will use Node 20 on next code deployment
   - Current: Node 18 (deprecated April 2025)
   - No action needed - already configured in package.json

2. **Error Handling Enhancement**

   - Add retry logic for Firebase database writes
   - Improve user feedback for sync failures
   - Add health check endpoint for webhook

3. **Template System Improvements**
   - Add more variable substitutions (e.g., `{{timestamp}}`, `{{platform}}`)
   - Support for custom date formats
   - Template validation in settings UI

### User Experience

1. **Web Dashboard Enhancements**

   - Add webhook testing functionality
   - Show sync history/status
   - Better onboarding flow

2. **Plugin UX Improvements**
   - Visual sync status indicators
   - Better error messages with actionable steps
   - Settings validation and hints

### Dependency Modernization (High Priority)

**Critical security and compatibility updates needed after GitHub Actions analysis:**

1. **ESLint v9 Upgrade** (30-45 minutes):
   ```bash
   # Update ESLint across all workspaces
   yarn add -D eslint@^9.0.0 @eslint/js@^9.0.0
   # Update existing eslint.config.js files
   ```

2. **Add Missing Peer Dependencies** (15 minutes):
   ```bash
   cd web
   yarn add -D postcss@^8.4.47 @babel/core@^7.25.0
   ```

3. **Fix Workspace Configuration** (5 minutes):
   ```bash
   # Add to root package.json:
   { "private": true, "license": "MIT" }
   # Add to web/package.json:
   { "license": "MIT" }
   ```

4. **Update Vulnerable Dependencies** (30 minutes):
   - Target packages using old glob/inflight versions
   - May require updating rollup plugins and other build tools

**Estimated total effort**: 1.5-2 hours for critical updates

---

## 🧬 Alfie Integration (Major Feature)

### Background Context

- **Alfie**: Jonas's project helping neurodivergent folk find self-regulation rituals and reflections
- **Goal**: Sync reflection data back to Obsidian alongside AudioPen/VoiceNotes
- **Architecture**: Same webhook pattern as existing integrations

### Implementation Plan

#### Phase 1: Alfie Webhook Support

**Estimated effort**: 2-3 hours

1. **Update webhook handler** (`functions/src/index.ts:15-92`):
   Add Alfie data structure detection - ask for alfie webhook payload.

2. **Update templates** (`plugin/templates/`):

   - Add Alfie-specific template with ritual and mood data
   - Include reflection context and outcomes

3. **Test webhook** with sample Alfie data

#### Phase 2: Template Enhancements

**Estimated effort**: 1-2 hours

1. **New template variables**:
   Does Alfie need new template variables? Can we map to existing ones? Remember keep it customisable by the user, provide useful defalts. PKM in Obsidian is VERY personal.

2. **Default Alfie template**: (example)

   ```markdown
   # Alfie Reflection:

   **Date**: {{date}}

   ## Reflection

   {{reflection_text}}

   ---

   _Synced from [Alfie](https://withalfie.com)_
   ```

#### Phase 3: Documentation & Rollout

**Estimated effort**: 1 hour

1. Update README with Alfie setup instructions
2. Update web dashboard with Alfie webhook example
3. Test end-to-end flow

---

## 🏗️ Technical Context & Architecture

### Current System Overview

**Repository**: https://github.com/jonashaefele/loud-thoughts
**Live System**: https://loud-thoughts.web.app

**Architecture**: Monorepo with yarn workspaces

- `plugin/` - Obsidian plugin (TypeScript, Vite build)
- `functions/` - Firebase Cloud Functions (Node.js 18 → 20)
- `web/` - Web dashboard (SolidJS + TailwindCSS)
- `shared/` - Shared types and Firebase config

**Key URLs**:

- Web Dashboard: https://loud-thoughts.web.app
- Webhook Endpoint: `https://europe-west1-loud-thoughts.cloudfunctions.net/webhook/{userKey}`
- Functions: `generateObsidianToken`, `newUser`, `wipe`, `webhook`

### Technology Stack

**Current Versions (August 2025)**:

- Node.js: 20 LTS (configured, deploys on next update)
- Firebase Functions: 6.4.0 (latest)
- Firebase Admin: 13.4.0 (latest)
- TypeScript: 5.9.2 (latest)
- ESLint: 9.x (modern config)

**Database Structure**:

```
/users/{uid}/key - User's webhook key
/buffer/{uid}/ - Pending sync items
/keys/{key} - Key → UID mapping (publicly readable)
```

**Security Model**:

- Keys are 192-bit cryptographically random
- Keys act as bearer tokens for webhook access
- Users can only read/write their own data
- Keys are publicly readable (needed for webhook validation)

### Development Commands

**Plugin Development**:

```bash
cd plugin && yarn build  # Build to dist/
```

**Firebase Functions**:

```bash
cd functions
yarn build    # Compile TypeScript
yarn deploy   # Deploy to Firebase
```

**Web Dashboard**:

```bash
cd web
yarn dev      # Development server
yarn build    # Production build
```

**Testing**:

```bash
yarn lint     # ESLint across all workspaces
```

### Migration Context

**Completed Migration** (AudioPen → LoudThoughts):

- ✅ All branding updated from AudioPen to LoudThoughts
- ✅ Firebase project: `audiopen-obsidian` → `loud-thoughts`
- ✅ Plugin ID: `audiopen-sync` → `loud-thoughts`
- ✅ Web URLs: `audiopen-obsidian.web.app` → `loud-thoughts.web.app`
- ✅ Function URLs: All updated to `loud-thoughts` project
- ✅ Deprecation notices added to old plugin

**Preserved Architecture**:

- Same webhook pattern and data structures
- Same Firebase Functions (1st gen for auth, 2nd gen for HTTP)
- Same template system with variable substitution
- Same security model and database rules

### Known Technical Debt

**Critical/High Priority:**

1. **ESLint v8 End of Life**:
   - `eslint@8.57.1: This version is no longer supported`
   - **Action**: Upgrade to ESLint v9 across all workspaces
   - **Impact**: Security vulnerabilities, no future updates

2. **Missing Peer Dependencies**:
   - Missing `postcss@^8.0.0` for autoprefixer and purgecss
   - Missing `@babel/core@^7.0.0` for babel-preset-solid
   - **Action**: Add missing peer dependencies to web/package.json

3. **Glob Package Vulnerabilities**:
   - `glob@7.2.3: Glob versions prior to v9 are no longer supported`
   - `inflight@1.0.6: This module is not supported, and leaks memory`
   - **Action**: Update dependencies that depend on old glob versions

**Medium Priority:**

4. **Vite CJS Deprecation**:
   - `The CJS build of Vite's Node API is deprecated`
   - **Action**: Update vite configuration to use ESM

5. **Firebase Functions ESLint Module Warning**:
   - `[MODULE_TYPELESS_PACKAGE_JSON]` warning in functions
   - **Action**: Add `"type": "module"` to functions/package.json

6. **Firebase CLI Database Rules Deployment**:
   - Persistent syntax errors when deploying rules via CLI
   - **Workaround**: Manual deployment through Firebase Console
   - Rules file kept in sync for documentation

**Quick Fixes:**

7. **Missing License Field**:
   - `package.json: No license field` in web workspace
   - **Action**: Add appropriate license to web/package.json

8. **Workspace Privacy Warning**:
   - `Workspaces can only be enabled in private projects`
   - **Action**: Add `"private": true` to root package.json

### Critical Files for New Context

**Configuration**:

- `firebase.json` - Firebase project configuration
- `shared/firebase.ts` - Firebase client configuration
- `database.rules.json` - Security rules (deploy via Console)

**Core Logic**:

- `functions/src/index.ts` - Webhook handler and Cloud Functions
- `plugin/main.ts` - Obsidian plugin core
- `plugin/ui/SettingsTab.ts` - Plugin settings interface

**Templates**:

- `plugin/templates/template-links.md` - Tags as Obsidian links
- `plugin/templates/template-tags.md` - Tags as Obsidian tags

---

## 📋 Checklist for Tomorrow

### Before Starting New Work:

- [ ] Verify all systems working at https://loud-thoughts.web.app
- [ ] Confirm Firebase functions responding
- [ ] Test plugin build: `cd plugin && yarn build`
- [ ] Check Firebase Console rules match code

### Priority Order:

1. **Submit to Obsidian Store** (blocks user migration)
2. **Critical Dependency Updates** (security vulnerabilities - ESLint v8 EOL)
3. **Deploy AudioPen deprecation notice**
4. **Plan Alfie integration** (major feature)
5. **Remaining technical debt** (quality improvements)

### Development Setup:

```bash
cd /Users/jonas/dev/loud-thoughts
yarn install
firebase use loud-thoughts
```

---

_This document contains complete context for continuing LoudThoughts development without dependency on the original AudioPen codebase._
