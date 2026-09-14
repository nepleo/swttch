# Bedrock Customization Design

## Objective

Maintain a private downstream edition of Swttch from the exact `v0.30.2` source baseline. The downstream keeps the upstream product behavior except for the explicitly requested removals and uses a distinct JetBrains plugin identity.

## Identity and versioning

- Keep every project and package version at `0.30.2`.
- Change the JetBrains plugin ID everywhere it is used at build time or runtime to `com.github.yhk1038.claude-code-gui-bedrock`.
- Keep the Gradle wrapper at 8.13.
- Move the existing `v0.30.2` tag to the final downstream commit so the tag, source, and release artifact match.

## Functional changes

### Remove Fable support

Delete the webview provider, backend probe, handler, tests, message type, and cache invalidations. Model consumers use the CLI-provided model catalog directly without injecting a fallback model.

### Disable Swttch update discovery

Both the webview update hook and backend update handler return a successful empty result without accessing JetBrains Marketplace. Existing consumers remain valid and simply observe no updates.

### Disable extend-kit startup updates

Remove the startup invocation and import from the backend server. Keep manual installation, update, and uninstall paths unchanged.

### Remove the CLI update control

Delete the update control and its dedicated query hook and tests. The About page displays the detected CLI version and its existing refresh button only.

## Verification

- Add focused tests proving plugin update discovery returns an empty result and performs no bridge or network request.
- Run static searches for removed Fable, startup-update, CLI-update-control, old plugin-ID, and accidental version changes.
- Run backend and webview test suites, builds, and the Gradle distribution build using JDK 17 or 21.
- Inspect the ZIP artifact and confirm its embedded plugin descriptor uses the Bedrock plugin ID and version `0.30.2`.

## Publication

Preserve the old remote `main` as `backup/main-before-bedrock-custom`. After verification, force-update `main` with lease, force-update `v0.30.2`, and publish or replace the GitHub Release asset with the generated plugin ZIP.
