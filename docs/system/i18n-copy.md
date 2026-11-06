# System: Localization and Interface Copy

## Description

The localization system presents Winterest’s interface in English and Indonesian, with translated defaults available when localized CMS content is missing.

## Requirements

- English is the primary locale and Indonesian is the secondary locale.
- Public and dashboard interface text, including labels, actions, and error messages, is available in both languages.
- The selected locale determines the interface language. Changing it updates visible copy immediately, and the preference persists through cookies or URL parameters.
- Interface copy is kept distinct from structured domain data.
- When CMS content has a translation for the active locale, display it. When it is empty, missing, or not yet available, use the translated default so the interface does not become blank or unusable.
