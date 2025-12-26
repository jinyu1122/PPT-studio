// disable eslint for this file
/* eslint-disable */
const fs = require('fs');
const { readFileSync } = require('fs');

const appName = process.argv.slice(2);
const metadata = readFileSync(`../site-metadata.json`,'utf8');
const config = JSON.parse(metadata)

const baseURL = `https://${config['siteDomain']}`;

const singleLanguageUrls = config["singleLanguageUrls"];
const multiLanguageUrls = config['multiLanguageUrls'];

const locales = config['locales'];
const modifiedTime = new Date().toISOString();

let siteMapContent = "";

// add sitemap for home page
let xhtml = `\t<xhtml:link rel="alternate" hreflang="x-default" href="${baseURL}/${locales[0]}"/>`;
locales.map((localeForHref, index) => {
    let href = `${baseURL}/${localeForHref}`;
    xhtml +=
    `\n\t<xhtml:link rel="alternate" hreflang="${localeForHref}" href="${href}"/>`;
});
    
siteMapContent += `<url>
\t<loc>${baseURL}</loc>
${xhtml}
\t<lastmod>${modifiedTime}</lastmod>
</url>\n`;


locales.map(locale => {
    let loc = `${baseURL}/${locale}`;
    let xhtml = `\t<xhtml:link rel="alternate" hreflang="x-default" href="${baseURL}/${locales[0]}"/>`;
    locales.map((localeForHref, index) => {
        let href = `${baseURL}/${localeForHref}`;
        xhtml +=
        `\n\t<xhtml:link rel="alternate" hreflang="${localeForHref}" href="${href}"/>`;
    });
    siteMapContent += 
`<url>
\t<loc>${loc}</loc>
${xhtml}
\t<lastmod>${modifiedTime}</lastmod>
</url>\n`
    });

// add sitemap for single language paths
singleLanguageUrls.map(path => {
    let loc = `${baseURL}/${path}`;
    siteMapContent += `<url>
\t<loc>${loc}</loc>
\t<lastmod>${modifiedTime}</lastmod>
</url>\n`;
});


// add sitemap for multi language paths
multiLanguageUrls.map(path => {
    let loc = `${baseURL}/${path}`;
    let xhtml = `\t<xhtml:link rel="alternate" hreflang="x-default" href="${baseURL}/${locales[0]}/${path}"/>`;
    locales.map((localeForHref, index) => {
        let href = `${baseURL}/${localeForHref}/${path}`;
        xhtml +=
        `\n\t<xhtml:link rel="alternate" hreflang="${localeForHref}" href="${href}"/>`;
    });

    siteMapContent += 
`<url>
\t<loc>${loc}</loc>
${xhtml}
\t<lastmod>${modifiedTime}</lastmod>
</url>\n`

    locales.map(locale => {
        let loc = `${baseURL}/${locale}/${path}`;
        let xhtml = `\t<xhtml:link rel="alternate" hreflang="x-default" href="${baseURL}/${locales[0]}/${path}"/>`;
        locales.map((localeForHref, index) => {
            let href = `${baseURL}/${localeForHref}/${path}`;
            xhtml +=
            `\n\t<xhtml:link rel="alternate" hreflang="${localeForHref}" href="${href}"/>`;
        });
        siteMapContent += 
`<url>
\t<loc>${loc}</loc>
${xhtml}
\t<lastmod>${modifiedTime}</lastmod>
</url>\n`
    });
});

// add content to sitemap
const siteMap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
      xmlns:xhtml="http://www.w3.org/1999/xhtml">
${siteMapContent}
</urlset>`;

try {
    fs.writeFileSync(`../public/sitemap.xml`, siteMap);
} catch (err) {
    console.log(err);
}