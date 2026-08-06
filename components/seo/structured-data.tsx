interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
}

export function OrganizationSchema({
  name = "Sleet Care",
  url = "https://sleetcare.com",
  logo = "https://sleetcare.com/logo.png",
  description = "100% natural skincare — clean formulas, dermatologist tested, cruelty-free and shipped across Pakistan."
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    foundingDate: "2018",
    industry: "Cosmetics & Skincare",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-300-8662833",
      contactType: "Customer Service",
      email: "hello@sleetcare.com",
      availableLanguage: ["English", "Urdu"]
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Faisalabad",
      addressRegion: "Punjab",
      addressCountry: "PK"
    },
    sameAs: [
      "https://www.facebook.com/Sleetcare",
      "https://www.instagram.com/sleetcare"
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
    image: product.image || "https://sleetcare.com/logo.png",
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Sleet Care"
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Sleet Care"
      }
    },
    manufacturer: {
      "@type": "Organization",
      name: "Sleet Care"
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
      name: "Sleet Care"
    },
    serviceType: "Skincare Consultation",
    areaServed: "PK",
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sleetcare.com'}/services/${service.slug}`
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
    name: "Sleet Care",
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://sleetcare.com',
    description: "100% natural skincare — clean formulas, dermatologist tested, cruelty-free and shipped across Pakistan.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://sleetcare.com'}/products?search={search_term_string}`,
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
