import { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export function generateSEO({
  title = "Premium Leather Jackets — Rugged Hides Leather Co.",
  description = "Shop premium leather jackets — biker, bomber, racer, and shearling styles. Full-grain and top-grain hides, hand-finished in the USA. Free shipping over $150.",
  keywords = ["Leather Jackets", "Biker Jacket", "Bomber Jacket", "Full-Grain Leather", "Men's Leather Jacket", "Women's Leather Jacket", "American Leather Goods"],
  image = "/logo.png",
  url = process.env.NEXT_PUBLIC_BASE_URL || "https://ruggedhides.com",
  type = "website",
  noIndex = false
}: SEOProps = {}): Metadata {
  const siteName = "Rugged Hides";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Rugged Hides Team" }],
    creator: "Rugged Hides",
    publisher: "Rugged Hides",
    
    // Open Graph
    openGraph: {
      type,
      title: fullTitle,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    
    // Twitter
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@ruggedhides",
      site: "@ruggedhides",
    },
    
    // Additional meta tags
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: url,
    },
    
    // Verification tags (we'll add these later)
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: {
        "msvalidate.01": process.env.BING_SITE_VERIFICATION || "",
      },
    },
    
    // App-specific
    applicationName: siteName,
    category: "E-commerce",
    classification: "Shopping",
    
    // Icons and manifest
    icons: {
      icon: [
        { url: '/icon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' }
      ],
      shortcut: '/icon.svg',
      apple: '/icon.svg',
    },
    
    // Additional structured data
    other: {
      "theme-color": "#D65E14",
      "msapplication-TileColor": "#D65E14",
      "msapplication-config": "/browserconfig.xml",
    },
  };
}

// Product-specific SEO
export function generateProductSEO(product: {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  id: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ruggedhides.com";
  return generateSEO({
    title: product.name + " — " + product.category + " Leather Jacket",
    description: product.description + " Starting at $" + product.price.toLocaleString() + ". Genuine leather, hand-finished in the USA.",
    keywords: ["Leather Jacket", product.category, product.name, "Full-Grain Leather", "American Made"],
    image: product.image || "/logo.png",
    url: baseUrl + "/products/" + product.id,
    type: "article",
  });
}

// Service-specific SEO
export function generateServiceSEO(service: {
  name: string;
  description: string;
  slug: string;
  image?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ruggedhides.com";
  return generateSEO({
    title: service.name + " — Rugged Hides Services",
    description: service.description,
    keywords: ["Leather Goods", service.name, "Custom Leather", "Leather Repair"],
    image: service.image || "/logo.png",
    url: baseUrl + "/services/" + service.slug,
    type: "article",
  });
}
