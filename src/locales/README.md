# Packaged interface catalogs

English and Simplified Chinese are maintained in `../studio_i18n.js`; the 31 JSON files here contain the other requested languages. Every catalog has the same 538 source keys and numbered placeholders.

Additional catalogs are build-time machine translations of public interface text, with technical-token checks and targeted corrections. They have not all received native-speaker review. Portuguese (Portugal) and Portuguese (Brazil), and Simplified/Traditional Chinese, are separate choices. No private user data was used.

The application loads these files from its own server. Switching languages never calls an external translation service. Only the explicit JSON allowlist is available before login; this file is documentation, not a served language catalog. Tests (repository root): `tests/studio_locales.mjs` and `tests/studio_locales_browser.mjs`.

When changing an interface key, update every catalog and run the completeness checks. Unknown upstream free-form errors and system file dialogs may use their original language.
