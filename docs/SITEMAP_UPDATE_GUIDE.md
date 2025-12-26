# How to Update Sitemap

This guide explains how to update the sitemap for this project. It is designed for AI code tools to follow when making changes that require sitemap updates.

## Overview

The sitemap is generated from configuration in [`site-metadata.json`](../site-metadata.json) using the script [`tools/generate-sitemap.js`](../tools/generate-sitemap.js). The generated sitemap is output to [`public/sitemap.xml`](../public/sitemap.xml).

## Key Files

| File | Purpose |
|------|---------|
| `site-metadata.json` | Configuration file containing locales and URL paths |
| `tools/generate-sitemap.js` | Node.js script that generates the sitemap |
| `public/sitemap.xml` | Generated output file (do not edit manually) |

## Configuration Structure

The `site-metadata.json` file has the following structure:

```json
{
    "siteDomain": "allprintabledoc.com",
    "appBrandName": "allprintabledoc",
    "locales": ["en", "zh", "de", ...],
    "singleLanguageUrls": [],
    "multiLanguageUrls": ["calendar/2024", "calendar/2025", ...]
}
```

### Fields Explanation

- **`locales`**: Array of supported language codes (e.g., "en", "zh", "de")
- **`singleLanguageUrls`**: URL paths that only exist in one language (no locale variants)
- **`multiLanguageUrls`**: URL paths that have versions in all supported locales

## Update Steps

### Scenario 1: Adding a New Page

When you add a new page to the application that should be included in the sitemap:

1. **Edit `site-metadata.json`**
2. **Add the new page path to the `multiLanguageUrls` array**

**Example**: Adding a new "about" page

```json
{
    "multiLanguageUrls": [
        "calendar/2024",
        "calendar/2025",
        "about"  // ← Add new page path here
    ]
}
```

> **Note**: Do not include the locale prefix (e.g., use `"about"` not `"en/about"`)

### Scenario 2: Adding a New Locale

When you add support for a new language:

1. **Edit `site-metadata.json`**
2. **Add the new locale code to the `locales` array**

**Example**: Adding Portuguese (pt)

```json
{
    "locales": [
        "en",
        "zh",
        "de",
        "es",
        "fr",
        "ru",
        "ja",
        "ko",
        "it",
        "id",
        "pt"  // ← Add new locale here
    ]
}
```

### Step 3: Regenerate Sitemap

After making changes to `site-metadata.json`, regenerate the sitemap by running:

```bash
cd tools
node generate-sitemap.js
```

Or from the project root:

```bash
node tools/generate-sitemap.js
```

> **Important**: The script must be run from the `tools` directory OR you need to adjust the relative paths. Currently the script uses `../site-metadata.json` and `../public/sitemap.xml`.

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                  Need to update sitemap?                     │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │      What type of change?       │
         └────────────────┬───────────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│    New Page?        │       │    New Locale?      │
└─────────┬───────────┘       └─────────┬───────────┘
          │                             │
          ▼                             ▼
┌─────────────────────┐       ┌─────────────────────┐
│ Add path to         │       │ Add locale to       │
│ multiLanguageUrls   │       │ locales array       │
│ in site-metadata.json       │ in site-metadata.json
└─────────┬───────────┘       └─────────┬───────────┘
          │                             │
          └───────────────┬─────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │  Run tools/generate-sitemap.js │
         └────────────────┬───────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │  New sitemap.xml generated in  │
         │  public folder                 │
         └────────────────────────────────┘
```

## Quick Reference Checklist

- [ ] **New page added?** → Add path to `multiLanguageUrls` in `site-metadata.json`
- [ ] **New locale added?** → Add locale code to `locales` in `site-metadata.json`
- [ ] **Run** `node tools/generate-sitemap.js` from project root (or `cd tools && node generate-sitemap.js`)
- [ ] **Verify** `public/sitemap.xml` has been updated
