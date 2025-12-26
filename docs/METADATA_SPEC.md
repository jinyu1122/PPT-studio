# Page Metadata Specification for AI Coding Agents

## Purpose

This specification defines how to implement `generateMetadata` functions in Next.js pages. Follow this spec to ensure consistent SEO, social sharing, and internationalization across all pages.

---

## Quick Reference

### What You Need to Implement

Every page with locale support must export a `generateMetadata` function that returns:

1. **Basic SEO**: `title`, `description`, `keywords`
2. **Canonical URL**: Self-referencing canonical
3. **Alternate Languages**: hreflang links for all supported locales + x-default
4. **Open Graph**: Social sharing metadata for Facebook/LinkedIn
5. **Twitter Cards**: Social sharing metadata for Twitter/X

---

## URL Structure Rules

### Pattern

```
/{locale}/{page-path}
```

### Examples

| URL | Type |
|-----|------|
| `/` | Root redirect (not a content page) |
| `/en/` | English homepage |
| `/zh/` | Chinese homepage |
| `/en/text-to-speech/english` | Subpage with locale |

---

## Canonical URL Rules

### Rule 1: Always Include Locale Prefix

Every page's canonical URL must include the locale prefix.

```typescript
// Homepage
const canonicalUrl = `${baseURL}/${locale}`;
// Result: https://example.com/en/

// Subpage
const canonicalUrl = `${baseURL}/${locale}/text-to-speech/${language}`;
// Result: https://example.com/en/text-to-speech/english
```

### Rule 2: Self-Referencing

The canonical URL must point to the current page itself.

---

## Alternate Languages (hreflang) Rules

### Rule 1: Include All Supported Locales

Generate alternate links for every locale in the `locales` array.

```typescript
const languages: Record<string, string> = {};
locales.forEach(loc => {
  languages[loc] = `${baseURL}/${loc}${pagePath}`;
});
```

### Rule 2: x-default Assignment

| Page Type | x-default Points To |
|-----------|---------------------|
| **Homepage** (`/{locale}/`) | Root URL without locale: `${baseURL}` (e.g., `https://example.com/`) |
| **Subpages** (`/{locale}/{path}`) | English version: `${baseURL}/en/${path}` |

```typescript
// Homepage
languages['x-default'] = baseURL;

// Subpage
languages['x-default'] = `${baseURL}/en/${pagePath}`;
```

### HTML Output Example (Homepage)

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/" />
<link rel="alternate" hreflang="zh" href="https://example.com/zh/" />
<link rel="alternate" hreflang="ja" href="https://example.com/ja/" />
<link rel="alternate" hreflang="x-default" href="https://example.com/" />
```

### HTML Output Example (Subpage)

```html
<link rel="alternate" hreflang="en" href="https://example.com/en/text-to-speech/english" />
<link rel="alternate" hreflang="zh" href="https://example.com/zh/text-to-speech/english" />
<link rel="alternate" hreflang="ja" href="https://example.com/ja/text-to-speech/english" />
<link rel="alternate" hreflang="x-default" href="https://example.com/en/text-to-speech/english" />
```

---

## Required Fields Checklist

### Metadata Object Structure

```typescript
{
  // REQUIRED: Basic SEO
  title: string,           // Localized page title
  description: string,     // Localized meta description
  keywords: string,        // Localized keywords

  // REQUIRED: Internationalization
  alternates: {
    canonical: string,     // Full canonical URL
    languages: {           // All locale alternates + x-default
      [locale: string]: string,
      'x-default': string,
    },
  },

  // REQUIRED: Open Graph
  openGraph: {
    title: string,         // Same as title
    description: string,   // Same as description
    type: 'website',       // Always 'website' for pages
    url: string,           // Same as canonical URL
    siteName: string,      // Your site name constant
    images: [{
      url: string,         // Absolute URL to image
      width: number,       // Image width (e.g., 512)
      height: number,      // Image height (e.g., 512)
      alt: string,         // Image description
    }],
  },

  // REQUIRED: Twitter Cards
  twitter: {
    card: 'summary_large_image',  // Card type
    title: string,                // Same as title
    description: string,          // Same as description
    images: [string],             // Array of image URLs
  },
}
```

---

## Implementation Template

### For Homepage (`/[locale]/page.tsx`)

```typescript
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { baseURL, locales } from '@/i18n/config';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  
  // 1. Get localized strings via translation keys (DO NOT hardcode strings)
  const title = t('yourPage.title');
  const description = t('yourPage.description');
  const keywords = t('yourPage.keywords');
  
  // 2. Build canonical URL
  const canonicalUrl = `${baseURL}/${locale}`;
  
  // 3. Build alternate languages
  const languages: Record<string, string> = {};
  locales.forEach(loc => {
    languages[loc] = `${baseURL}/${loc}`;
  });
  // Homepage: x-default = root URL
  languages['x-default'] = baseURL;

  // 4. Return complete metadata object
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'YourSiteName',
      images: [{
        url: `${baseURL}/logo512.png`,
        width: 512,
        height: 512,
        alt: 'Logo Description',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseURL}/logo512.png`],
    },
  };
}
```

### For Subpages (`/[locale]/[path]/page.tsx`)

```typescript
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { baseURL, locales } from '@/i18n/config';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations();
  
  // 1. Get localized strings via translation keys
  const title = t('yourPage.title');
  const description = t('yourPage.description');
  const keywords = t('yourPage.keywords');
  
  // 2. Build canonical URL (include full page path)
  const pagePath = `/your-page/${slug}`;
  const canonicalUrl = `${baseURL}/${locale}${pagePath}`;
  
  // 3. Build alternate languages
  const languages: Record<string, string> = {};
  locales.forEach(loc => {
    languages[loc] = `${baseURL}/${loc}${pagePath}`;
  });
  // Subpage: x-default = English version
  languages['x-default'] = `${baseURL}/en${pagePath}`;

  // 4. Return complete metadata object
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'YourSiteName',
      images: [{
        url: `${baseURL}/logo512.png`,
        width: 512,
        height: 512,
        alt: 'Logo Description',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseURL}/logo512.png`],
    },
  };
}
```

---

## Critical Rules for AI Agents

1. **DO NOT hardcode localized strings** - Always use translation functions like `t('key')`
2. **DO NOT omit any required fields** - All fields in the checklist are mandatory
3. **DO use absolute URLs** - All URLs must start with `${baseURL}`
4. **DO include all locales** - Iterate over the `locales` array, don't hardcode locale list
5. **DO match canonical and openGraph.url** - They must be identical
6. **DO use the correct x-default rule** - Root URL for homepage, /en/ version for subpages

---

## Imports Required

```typescript
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { baseURL, locales } from '@/i18n/config';
```

---

## Validation

After implementing, verify:

- [ ] `title`, `description`, `keywords` use translation keys
- [ ] `canonical` URL includes locale and full path
- [ ] All locales from `locales` array are in `alternates.languages`
- [ ] `x-default` follows the correct rule (root for homepage, /en/ for subpages)
- [ ] `openGraph` includes all required fields
- [ ] `twitter` includes all required fields
- [ ] All URLs are absolute (start with `https://`)
