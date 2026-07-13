# webapp-mobile

This repository is a **dummy placeholder React Native scaffold** for a later mobile-build prompt. It contains no production URLs, credentials, tokens, users, customer data, or implemented feature screens.

## Directory Structure

- `App.js` — minimal placeholder root shell only.
- `index.js` and `app.json` — React Native registration metadata.
- `babel.config.js` and `metro.config.js` — minimal React Native tooling configuration.
- `src/api/client.js` — fixture-only request client using the reserved non-production URL `https://mobile-placeholder.invalid`.
- `src/screens` — intentionally contains only this scaffold documentation; screen implementations belong to the later prompt.
- `src/components` — shared mobile components may be added later.
- `src/navigation` — navigation containers and route names may be added later.

## Conventions for the Later Build

### Screens

Feature files must use the `*Screen.js` suffix and live in `src/screens`. This setup deliberately does **not** include `LoginScreen`, `DashboardScreen`, `InvoiceListScreen`, `SettingsScreen`, or any other feature screen.

### API

Keep shared HTTP behavior in `src/api/client.js`. API modules should use relative endpoint paths, treat the base URL as injected configuration in production, and never commit credentials, real tokens, or production hosts.

### Navigation

Place route constants and React Navigation containers in `src/navigation`. Screens should receive navigation through the navigation library rather than importing one another.

## Running Later

Install the exact versions in `package.json`, then let the separate mobile-build prompt add platform-native projects and feature screens if its target build environment requires them. The current repository is intentionally limited to the reusable JavaScript scaffold on `main`.
