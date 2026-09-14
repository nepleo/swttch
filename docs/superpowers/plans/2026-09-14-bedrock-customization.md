# Bedrock Customization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce and publish a Bedrock-branded Swttch `v0.30.2` plugin with the requested probes and automatic update paths removed.

**Architecture:** Preserve the v0.30.2 three-layer architecture and remove only the specified cross-layer flows. Keep existing message shapes for plugin-update consumers, but resolve them locally to an empty successful result so no UI redesign or unrelated refactor is needed.

**Tech Stack:** Kotlin/JVM, Gradle 8.13, Node.js, TypeScript, React, Vitest, GitHub CLI

---

### Task 1: Remove Fable probing and fallback injection

**Files:**
- Delete: `webview/src/contexts/FableProbeContext.tsx`
- Delete: `webview/src/contexts/__tests__/FableProbeContext.test.tsx`
- Delete: `backend/src/core/features/fable-probe.ts`
- Delete: `backend/src/core/features/__tests__/fable-probe.test.ts`
- Delete: `backend/src/core/handlers/probeFableAvailability.ts`
- Modify: `webview/src/types/models.ts`
- Modify: `webview/src/types/__tests__/models.test.ts`
- Modify: `webview/src/contexts/AppProviders.tsx`
- Modify: `webview/src/contexts/index.ts`
- Modify: `webview/src/pages/SettingsPage/Model/index.tsx`
- Modify: `webview/src/pages/SettingsPage/Model/__tests__/modelSelect.test.tsx`
- Modify: `webview/src/pages/ChatPage/ModelSwitchOverlay/index.tsx`
- Modify: `webview/src/pages/ChatPage/ModelSwitchOverlay/__tests__/scroll.test.tsx`
- Modify: `webview/src/commandPalette/sections/model/SwitchModelItem.tsx`
- Modify: `webview/src/pages/ChatPage/ChatInput/ModelTag.tsx`
- Modify: `webview/src/shared/message-type.ts`
- Modify: `backend/src/shared/message-type.ts`
- Modify: `backend/src/core/handlers/index.ts`
- Modify: `backend/src/core/handlers/switchAccount.ts`
- Modify: `backend/src/core/handlers/sendMessage.ts`
- Modify: `backend/src/core/handlers/__tests__/sendMessage.account-pool.test.ts`

- [ ] Delete the dedicated Fable files and the `withFableFallback` test block.
- [ ] Replace each derived model list with the raw CLI catalog, for example:

```ts
const models = controlResponse?.response?.response?.models ?? [];
```

- [ ] Remove provider wiring, probe effects, message routing, cache invalidation, imports, and obsolete mocks.
- [ ] Run `bash ./scripts/build.sh wv-test -- src/types/__tests__/models.test.ts` and expect PASS.
- [ ] Run `bash ./scripts/build.sh be-test` and expect all backend tests to pass.
- [ ] Commit with `git commit -m "refactor: remove Fable integration"`.

### Task 2: Disable plugin update discovery

**Files:**
- Create: `webview/src/hooks/__tests__/usePluginUpdates.test.tsx`
- Create: `backend/src/core/handlers/__tests__/getPluginUpdates.test.ts`
- Modify: `webview/src/hooks/usePluginUpdates.ts`
- Modify: `backend/src/core/handlers/getPluginUpdates.ts`

- [ ] Add a webview hook test that renders `usePluginUpdates`, expects `updates` to equal `[]`, `isLoading` to be false, `error` to be null, and the bridge `send` function not to be called.
- [ ] Run `bash ./scripts/build.sh wv-test -- src/hooks/__tests__/usePluginUpdates.test.tsx` and confirm the test fails because the current hook calls the bridge.
- [ ] Implement the hook as a stable local empty result:

```ts
export function usePluginUpdates(): UsePluginUpdatesReturn {
  return { updates: [], isLoading: false, error: null, refresh: async () => {} };
}
```

- [ ] Add a backend handler test that spies on `globalThis.fetch`, calls the handler, expects one `ACK` with `{ status: 'ok', updates: [] }`, and expects no fetch call.
- [ ] Run `bash ./scripts/build.sh be-test` and confirm the new backend test fails against the Marketplace implementation.
- [ ] Replace the backend cache/fetch flow with a direct ACK carrying an empty updates array.
- [ ] Re-run both focused tests and expect PASS.
- [ ] Commit with `git commit -m "refactor: disable Swttch update checks"`.

### Task 3: Remove automatic update controls

**Files:**
- Modify: `backend/src/server.ts`
- Delete: `webview/src/pages/SettingsPage/About/CliUpdateControl.tsx`
- Delete: `webview/src/hooks/queries/useCliUpdate.ts`
- Delete: `webview/src/hooks/queries/__tests__/useCliUpdate.test.tsx`
- Modify: `webview/src/pages/SettingsPage/About/index.tsx`

- [ ] Remove only the startup `updateInstalledExtendKit()` invocation and import; retain `backend/src/core/extend-kit-update.ts` for manual paths.
- [ ] Remove the CLI update component and query hook, then remove the component import and JSX from About settings.
- [ ] Run `bash ./scripts/build.sh be-build` and `bash ./scripts/build.sh wv-build`; expect both builds to succeed.
- [ ] Commit with `git commit -m "refactor: remove automatic update controls"`.

### Task 4: Apply the downstream plugin identity

**Files:**
- Modify: `src/main/resources/META-INF/plugin.xml`
- Modify: `build.gradle.kts`
- Modify: `src/main/kotlin/com/github/yhk1038/claudecodegui/bridge/PluginResourceExtractor.kt`

- [ ] Replace exactly the three plugin-ID occurrences with:

```text
com.github.yhk1038.claude-code-gui-bedrock
```

- [ ] Verify `gradle.properties`, backend/package.json, and webview/package.json still declare `0.30.2`; verify `gradle-wrapper.properties` still declares Gradle 8.13.
- [ ] Commit with `git commit -m "chore: use Bedrock plugin identity"`.

### Task 5: Verify and package

**Files:**
- Generated: `build/distributions/*.zip`

- [ ] Run `bash ./scripts/build.sh be-test` and expect zero failures.
- [ ] Run `bash ./scripts/build.sh wv-test` and expect zero failures.
- [ ] Run `bash ./scripts/build.sh be-build` and `bash ./scripts/build.sh wv-build` and expect successful TypeScript builds.
- [ ] Run `JAVA_HOME=/opt/local/Library/Java/JavaVirtualMachines/openjdk17/Contents/Home bash ./scripts/build.sh dist` and expect `BUILD SUCCESSFUL`.
- [ ] Search tracked source for removed symbols and the old exact plugin ID; expect no matches outside historical documentation that is intentionally retained.
- [ ] Inspect the ZIP's `META-INF/plugin.xml`; expect plugin ID `com.github.yhk1038.claude-code-gui-bedrock` and version `0.30.2`.

### Task 6: Publish main, tag, and release

**Files:**
- Remote branch: `main`
- Remote tag: `v0.30.2`
- GitHub Release: `v0.30.2`

- [ ] Confirm `backup/main-before-bedrock-custom` points to the old remote main SHA.
- [ ] Force-update remote main safely with `git push --force-with-lease=refs/heads/main:<old-sha> origin HEAD:main`.
- [ ] Move the local tag with `git tag -f v0.30.2 HEAD` and force-update the remote tag.
- [ ] Create or update the `v0.30.2` GitHub Release and upload the generated ZIP with release notes describing the four downstream customizations and Bedrock plugin identity.
- [ ] Re-read remote refs and release metadata to verify that main, tag, release target, and local HEAD all match.
