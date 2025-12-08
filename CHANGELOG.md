# Changelog

All notable changes to LoudThoughts will be documented in this file.

## [1.2.2] - 2025-12-08

### 🎯 What This Means for You

This release addresses feedback from the Obsidian plugin directory review. No new features, just polish and best practices to ensure the plugin plays nicely with other plugins and follows Obsidian's guidelines.

### 🔧 What We Improved Behind the Scenes

- **CSS class naming** - All CSS classes now use `loud-thoughts-` prefix to avoid conflicts with other plugins
- **Cleaner console output** - Debug logs are now properly guarded and won't clutter your console unless you enable debug mode
- **Better file handling** - Using `Vault.process()` for safer concurrent file modifications
- **Path normalization** - User-defined folder paths are now properly normalized
- **UI text consistency** - Fixed sentence casing throughout the settings panel
- **Moved inline styles to CSS** - Better theme and snippet compatibility for donation buttons
- **Aligned Firebase versions** - All workspaces now use Firebase SDK v12 for consistent behavior

---

## [1.2.0] - 2025-09-01

### 🎯 What This Means for You

Obsidian started blocking Firebase's iframe-based authentication, which broke login for some users. This release fixes that by upgrading to Firebase SDK v12 and forcing WebSocket connections instead.

### 🔧 What We Improved Behind the Scenes

- Upgraded Firebase SDK from v10 to v12
- Forced WebSocket connections to bypass iframe authentication blocks
- Improved connection reliability in Obsidian's environment

---

## [1.1.0] - 2025-08-20

### 🎯 What This Means for You

LoudThoughts now speaks multiple languages - well, multiple voice note services anyway. This release introduces a proper multi-platform architecture, so AudioPen, VoiceNotes, and Alfie all feel like first-class citizens.

### ✨ User Experience Improvements

- **Multi-platform provider architecture** - AudioPen, VoiceNotes, and Alfie all supported through a unified system
- **Smarter transcript display** - Original transcripts now appear in a collapsible callout format
- **Rich Alfie integration** - Automatic metadata tag generation for mood, energy, location, and more
- **Better template variables** - `{content}` replaces `{body}` (backward compatible), plus platform-neutral naming

### 🔧 What We Improved Behind the Scenes

- Semantic naming improvements throughout the codebase
- Conditional rendering for services without transcripts
- Platform-agnostic template variable system
- Enhanced error handling in the provider system

---

## [1.0.0] - 2025-08-20

### 🎯 What This Means for You

Hey! This is the first official release of LoudThoughts - think of it as AudioPen's bigger sibling that plays nice with multiple voice note services. If you've been using the original AudioPen plugin, your webhooks will keep working exactly as they did. But now you can also connect VoiceNotes, and we're getting Alfie ready to join the party soon.

The main thing? Everything should just work. We've fixed those annoying authentication errors that were blocking new users, and the whole system is running on newer, faster infrastructure. Your voice notes will sync reliably to your Obsidian vault, regardless of which service you prefer.

### ✨ User Experience Improvements

- **Multi-service support** - Connect AudioPen AND VoiceNotes to the same vault (Alfie coming soon)
- **Better error messages** - When something goes wrong, you'll actually know what to do about it
- **Faster sync** - Upgraded to Node.js 20 means your notes arrive a bit quicker
- **Secure authentication** - Fixed that 500 error that was blocking new users from getting started

### 🔧 What We Improved Behind the Scenes

- Fixed the `generateObsidianToken` function that was throwing 500 errors (missing IAM permissions)
- Fixed webhook authentication issues - external services can now actually send you notes
- Upgraded all Firebase functions from Node.js 18 to Node.js 20 (better performance, longer support)
- Added missing peer dependencies (postcss, babel-core) that were causing build warnings
- Cleaned up the codebase structure for easier maintenance

### 🛠️ Technical Implementation

This release represents a fork and evolution of the [AudioPen Obsidian Plugin](https://github.com/jonashaefele/audiopen-obsidian). We've maintained full backward compatibility while expanding the architecture to support multiple services.

**Key technical changes:**
- Migrated to Firebase Functions v2 for the webhook endpoint
- Added proper IAM role bindings (`roles/iam.serviceAccountTokenCreator` for token generation)
- Enabled public invoker access for webhook endpoints via Cloud Run
- Updated all dependencies to current versions
- Structured as a monorepo with yarn workspaces for better code organization

**Known quirks:**
- You might see a database indexing warning in the logs - it's harmless and doesn't affect functionality
- ESLint is still on v8 (we'll update to v9 in a future release)

---

_Note: This is our first release after migrating from the original AudioPen plugin. If you spot any issues, please let us know via [GitHub Issues](https://github.com/jonashaefele/loud-thoughts/issues)._