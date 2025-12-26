# How to Add Language Support

This guide explains how to add a new language (locale) to this project. It is designed for AI code tools to follow when adding internationalization support.

## Overview

The project uses `next-intl` for internationalization. Adding a new language requires updating configuration files and creating translation files.

## Key Files

| File | Purpose |
|------|---------|
| `src/i18n/config.ts` | Main i18n configuration (locales, locale names, hreflang mapping) |
| `site-metadata.json` | Site metadata including locales for sitemap generation |
| `src/i18n/messages/{locale}.json` | Translation files for each language |
| `tools/check-json-schema.js` | Validation script to ensure translation files match schema |

## Step-by-Step Instructions

### Step 1: Update `src/i18n/config.ts`

This file contains three locale-related definitions that must all be updated:

#### 1.1 Add to `locales` array

```typescript
export const locales = ['en', 'zh', 'de', 'es', 'fr', 'ru', 'ja', 'ko', 'it', 'id', 'pt', 'vi'] as const;
//                                                                                            ^^^^ Add new locale
```

#### 1.2 Add to `localeNames` object

Add the locale code and its native name:

```typescript
export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  it: 'Italiano',
  id: 'Bahasa Indonesia',
  pt: 'Português',
  vi: 'Tiếng Việt'  // ← Add new locale with native language name
};
```

#### 1.3 Add to `hreflangMap` object

```typescript
export const hreflangMap: Record<Locale, string> = {
  en: 'en',
  zh: 'zh',
  de: 'de',
  es: 'es',
  fr: 'fr',
  ru: 'ru',
  ja: 'ja',
  ko: 'ko',
  it: 'it',
  id: 'id',
  pt: 'pt',
  vi: 'vi',  // ← Add new locale mapping
};
```

### Step 2: Update `site-metadata.json`

Add the new locale code to the `locales` array:

```json
{
    "siteDomain": "allprintabledoc.com",
    "appBrandName": "allprintabledoc",
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
        "pt",
        "vi"  // ← Add new locale here
    ],
    ...
}
```

### Step 3: Create Translation File

Create a new translation file at `src/i18n/messages/{locale}.json` based on the English version.

#### 3.1 Copy the English template

The English file (`src/i18n/messages/en.json`) serves as the source template:

```json
{
  "HomePage": {
    "title": "2025 Printable Calendar",
    "description": "Free printable calendar for 2025. Download and print your own calendar with all months at a glance.",
    "calendarTitle": "Calendar {year}"
  },
  "Navigation": {
    "home": "Home",
    "about": "About",
    "products": "Products",
    "contact": "Contact",
    "calendar": "Calendar"
  },
  "Calendar": {
    "title": "Calendar {year}",
    "description": "Free printable calendar for {year}. Download and print your own calendar.",
    "print": "Print Calendar",
    "previousYear": "Previous Year",
    "nextYear": "Next Year",
    "months": [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    "weekDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  }
}
```

#### 3.2 Translation Rules

1. **Translate all string values** to the target language
2. **Keep all keys unchanged** (e.g., `"HomePage"`, `"title"`, etc.)
3. **Preserve placeholders** like `{year}` exactly as they are
4. **Keep the same JSON structure** (nested objects, arrays)
5. **Translate array items** in the same order (e.g., months, weekdays)

#### 3.3 Example: Vietnamese (`vi.json`)

```json
{
  "HomePage": {
    "title": "Lịch in được 2025",
    "description": "Lịch in miễn phí cho năm 2025. Tải xuống và in lịch của riêng bạn với tất cả các tháng trong một cái nhìn.",
    "calendarTitle": "Lịch {year}"
  },
  "Navigation": {
    "home": "Trang chủ",
    "about": "Giới thiệu",
    "products": "Sản phẩm",
    "contact": "Liên hệ",
    "calendar": "Lịch"
  },
  "Calendar": {
    "title": "Lịch {year}",
    "description": "Lịch in miễn phí cho năm {year}. Tải xuống và in lịch của riêng bạn.",
    "print": "In Lịch",
    "previousYear": "Năm trước",
    "nextYear": "Năm sau",
    "months": [
      "Tháng Một", "Tháng Hai", "Tháng Ba", "Tháng Tư", "Tháng Năm", "Tháng Sáu",
      "Tháng Bảy", "Tháng Tám", "Tháng Chín", "Tháng Mười", "Tháng Mười Một", "Tháng Mười Hai"
    ],
    "weekDays": ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
  }
}
```

### Step 4: Validate Translation Schema

Run the schema validation script to ensure the translation file matches the English structure:

```bash
node tools/check-json-schema.js
```

#### Expected Output (Success)

```
✓ vi.json matches en.json schema

All files match the en.json schema!
```

#### Possible Error Messages

If there are issues, you'll see:

```
Issues found in vi.json:
  - Missing key: Calendar.print
  - Extra key: HomePage.subtitle
  - Type mismatch at Calendar.months: expected array, got object
```

**Fix errors by:**
1. Adding any missing keys from `en.json`
2. Removing any extra keys not in `en.json`
3. Fixing type mismatches (ensure arrays remain arrays, objects remain objects)

### Step 5: Regenerate Sitemap

After adding the new locale, regenerate the sitemap to include all new URLs:

```bash
cd tools && node generate-sitemap.js
```

Or from project root:

```bash
node tools/generate-sitemap.js
```

> **Note**: See [SITEMAP_UPDATE_GUIDE.md](./SITEMAP_UPDATE_GUIDE.md) for more details on sitemap generation.

## Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│              Add New Language Support                         │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 1: Update src/i18n/config.ts                           │
│  - Add to locales array                                       │
│  - Add to localeNames object                                  │
│  - Add to hreflangMap object                                  │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 2: Update site-metadata.json                           │
│  - Add locale to locales array                               │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 3: Create translation file                             │
│  - Copy en.json as template                                   │
│  - Translate all string values                               │
│  - Keep keys and placeholders unchanged                      │
│  - Save as src/i18n/messages/{locale}.json                   │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 4: Validate schema                                      │
│  - Run: node tools/check-json-schema.js                      │
│  - Fix any missing/extra keys if errors                      │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  Step 5: Regenerate sitemap                                   │
│  - Run: cd tools && node generate-sitemap.js                 │
└──────────────────────────────────────────────────────────────┘
```

## Quick Reference Checklist

When adding a new language, ensure you complete all these steps:

- [ ] **Update `src/i18n/config.ts`**:
  - [ ] Add locale code to `locales` array
  - [ ] Add locale name to `localeNames` object
  - [ ] Add locale to `hreflangMap` object
- [ ] **Update `site-metadata.json`**: Add locale to `locales` array
- [ ] **Create `src/i18n/messages/{locale}.json`**: Translate from `en.json`
- [ ] **Validate**: Run `node tools/check-json-schema.js`
- [ ] **Fix any schema errors** reported by validation
- [ ] **Regenerate sitemap**: Run `cd tools && node generate-sitemap.js`

## Common Locale Codes Reference

| Language | Code | Native Name |
|----------|------|-------------|
| English | en | English |
| Chinese (Simplified) | zh | 中文 |
| German | de | Deutsch |
| Spanish | es | Español |
| French | fr | Français |
| Russian | ru | Русский |
| Japanese | ja | 日本語 |
| Korean | ko | 한국어 |
| Italian | it | Italiano |
| Indonesian | id | Bahasa Indonesia |
| Portuguese | pt | Português |
| Vietnamese | vi | Tiếng Việt |
| Thai | th | ไทย |
| Arabic | ar | العربية |
| Hindi | hi | हिन्दी |
| Dutch | nl | Nederlands |
| Polish | pl | Polski |
| Turkish | tr | Türkçe |
