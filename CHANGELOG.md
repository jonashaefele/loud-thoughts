# Changelog

All notable changes to LoudThoughts will be documented in this file.

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