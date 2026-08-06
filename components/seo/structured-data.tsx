interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

export function OrganizationSchema({
  name = "Rugged Hides Leather Co.",
  url = "https://ruggedhides.com",
  logo = "https://ruggedhides.com/logo.png",
  description = "Premium American leather jackets — biker, bomber, racer, and shearling styles crafted from full-grain and top-grain hides."
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    foundingDate: "2020",
    industry: "Leather Goods & Apparel",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-555-0182",
      contactType: "Customer Service",
      email: "hello@ruggedhides.com"
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Denver",
      addressRegion: "CO",
      addressCountry: "US"
    },
    sameAs: [
      "https://twitter.com/ruggedhides",
      "https://instagram.com/ruggedhides",
      "https://facebook.com/ruggedhides"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  product: {
    name: string;
    description: string;
    price: number;
    category: string;
    image?: string;
    id: string;
    stock: number;
  };
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.image || "https://ruggedhides.com/logo.png",
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Rugged Hides"
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Rugged Hides Leather Co."
      }
    },
    manufacturer: {
      "@type": "Organization",
      name: "Rugged Hides Leather Co."
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  service: {
    name: string;
    description: string;
    slug: string;
  };
}

export function ServiceSchema({ service }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "Rugged Hides Leather Co."
    },
    serviceType: "Leather Goods",
    areaServed: "US",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ruggedhides.com'}/services/${service.slug}`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rugged Hides Leather Co.",
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://ruggedhides.com',
    description: "Premium leather jackets — biker, bomber, racer, and shearling styles. Full-grain hides, hand-finished in the USA.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ruggedhides.com'}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
