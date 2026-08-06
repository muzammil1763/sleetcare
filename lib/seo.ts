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
  title = "Sleet Care — 100% Natural Skincare",
  description = "Shop Sleet Care — clean, dermatologist-tested skincare formulated with 100% traceable natural ingredients. Cruelty-free, fragrance-free, delivered across Pakistan.",
  keywords = ["Natural Skincare", "Sleet Care", "Skincare Pakistan", "Cruelty Free Skincare", "Dermatologist Tested", "Clean Beauty", "Face Serum", "Moisturiser", "Cleanser"],
  image = "/logo.png",
  url = process.env.NEXT_PUBLIC_BASE_URL || "https://sleetcare.com",
  type = "website",
  noIndex = false
}: SEOProps = {}): Metadata {
  const siteName = "Sleet Care";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: "Sleet Care Team" }],
    creator: "Sleet Care",
    publisher: "Sleet Care",

    openGraph: {
      type,
      title: fullTitle,
      description,
      url,
      siteName,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      locale: "en_PK",
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@sleetcare",
      site: "@sleetcare",
    },

    robots: noIndex ? "noindex, nofollow" : "index, follow",
    alternates: { canonical: url },

    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION || "" },
    },

    applicationName: siteName,
    category: "E-commerce",
    classification: "Shopping",

    icons: {
      icon: [{ url: '/logo.png', type: 'image/png' }],
      shortcut: '/logo.png',
      apple: '/logo.png',
    },

    other: {
      "theme-color": "#1e2a5e",
      "msapplication-TileColor": "#1e2a5e",
    },
  };
}

export function generateProductSEO(product: {
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  id: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sleetcare.com";
  return generateSEO({
    title: `${product.name} — ${product.category} | Sleet Care`,
    description: `${product.description} Rs. ${product.price.toLocaleString("en-PK")} PKR. Natural ingredients, dermatologist tested.`,
    keywords: ["Natural Skincare", product.category, product.name, "Sleet Care", "Pakistan"],
    image: product.image || "/logo.png",
    url: `${baseUrl}/products/${product.id}`,
    type: "article",
  });
}

export function generateServiceSEO(service: {
  name: string;
  description: string;
  slug: string;
  image?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sleetcare.com";
  return generateSEO({
    title: `${service.name} — Sleet Care Services`,
    description: service.description,
    keywords: ["Skincare Consultation", service.name, "Sleet Care", "Pakistan"],
    image: service.image || "/logo.png",
    url: `${baseUrl}/services/${service.slug}`,
    type: "article",
  });
}
