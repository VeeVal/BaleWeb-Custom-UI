# Bale Web Custom Layout — Firefox

This Firefox Manifest V3 extension applies the requested Bale Web layout changes:

- 555px desktop sidebar by default.
- A draggable sidebar edge (280–720px), with the selected width saved locally.
- Full-width `.K4prvv` layout.

## Install temporarily for testing

1. Open `about:debugging#/runtime/this-firefox`.
2. Select **Load Temporary Add-on**.
3. Select this folder's `manifest.json`.
4. Open or reload `https://web.bale.ai/chat`.

Temporary add-ons are removed when Firefox closes. A signed `.xpi` package is required for normal Firefox installation.
