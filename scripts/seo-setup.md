# SEO Setup Guide

## 1. Google Search Console Setup

### Step 1: Add Property
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Click "Add Property"
3. Choose "URL prefix" and enter: `https://omnilynk.io`

### Step 2: Verify Ownership
Choose one of these methods:

**Method A: HTML Meta Tag (Recommended)**
1. Copy the verification meta tag from Google
2. Add to your `.env` file:
```bash
GOOGLE_SITE_VERIFICATION=your_verification_code_here
```
3. The meta tag is automatically included via our SEO setup

**Method B: HTML File Upload**
1. Download the HTML file from Google
2. Place it in your `public/` folder
3. Verify in Google Search Console

### Step 3: Submit Sitemap
1. In Google Search Console, go to "Sitemaps"
2. Submit: `https://omnilynk.io/sitemap.xml`

## 2. Bing Webmaster Tools Setup

### Step 1: Add Site
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters/)
2. Click "Add a site"
3. Enter: `https://omnilynk.io`

### Step 2: Verify Ownership
**Method A: Meta Tag**
1. Copy the verification meta tag
2. Add to `.env`:
```bash
BING_SITE_VERIFICATION=your_verification_code_here
```

**Method B: Import from Google**
1. Choose "Import from Google Search Console"
2. Authorize and import settings

### Step 3: Submit Sitemap
1. Go to "Sitemaps" in Bing Webmaster Tools
2. Submit: `https://omnilynk.io/sitemap.xml`

## 3. Environment Variables Setup

Add these to your `.env` file:

```bash
# SEO Configuration
NEXT_PUBLIC_BASE_URL=https://omnilynk.io
GOOGLE_SITE_VERIFICATION=your_google_verification_code
BING_SITE_VERIFICATION=your_bing_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```

## 4. Manual Submission URLs

### Google
- Submit URL: https://www.google.com/ping?sitemap=https://omnilynk.io/sitemap.xml
- Search Console: https://search.google.com/search-console/

### Bing
- Submit URL: https://www.bing.com/ping?sitemap=https://omnilynk.io/sitemap.xml
- Webmaster Tools: https://www.bing.com/webmasters/

### Other Search Engines
- Yandex: https://webmaster.yandex.com/
- DuckDuckGo: Automatically crawls (no submission needed)
- Baidu: https://ziyuan.baidu.com/

## 5. Monitoring & Maintenance

### Weekly Tasks
- Check Google Search Console for errors
- Monitor indexing status
- Review search performance

### Monthly Tasks
- Update sitemap if new content added
- Check for broken links
- Review and update meta descriptions
- Monitor page speed scores

### Tools for Monitoring
- Google Search Console
- Bing Webmaster Tools
- Google PageSpeed Insights
- GTmetrix
- Screaming Frog (for technical SEO)

## 6. SEO Checklist

### Technical SEO ✅
- [x] XML Sitemap generated
- [x] Robots.txt configured
- [x] Meta tags implemented
- [x] Structured data added
- [x] Canonical URLs set
- [x] Mobile-friendly design
- [x] Fast loading times
- [x] HTTPS enabled

### Content SEO
- [ ] Unique page titles (max 60 chars)
- [ ] Meta descriptions (max 160 chars)
- [ ] Header tags (H1, H2, H3) properly used
- [ ] Alt text for images
- [ ] Internal linking strategy
- [ ] Content optimization for keywords

### Local SEO (if applicable)
- [ ] Google My Business setup
- [ ] Local schema markup
- [ ] NAP consistency (Name, Address, Phone)

## 7. Performance Optimization

### Core Web Vitals
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1

### Tools to Test
- Google PageSpeed Insights
- Web.dev Measure
- GTmetrix
- Lighthouse (built into Chrome DevTools)