"use client";

import Link from "next/link";
import { ArrowRight, Leaf, FlaskConical, Heart, Recycle, Package, Truck, Star, Shield } from "lucide-react";

const services = [
  {
    icon: FlaskConical,
    title: "Personalised Skincare Consultation",
    tagline: "Formulated for your skin, not everyone's",
    desc: "Book a 1-on-1 consultation with our in-house cosmetic chemist. We analyse your skin type, current routine, and concerns — then recommend a Sleet Care routine built specifically for you.",
    image: "/img1.png",
    features: [
      "Fitzpatrick skin type assessment",
      "Routine gap analysis",
      "Ingredient conflict check",
      "Written routine report",
      "30-minute follow-up call included",
    ],
    price: "Rs. 2,500 per session",
  },
  {
    icon: Package,
    title: "Custom Routine Bundles",
    tagline: "Your routine, curated and discounted",
    desc: "Choose your skin concern and we'll bundle the exact products from our range that address it — cleanser, treatment, moisturiser and SPF — at a discounted bundle price.",
    image: "/img2.png",
    features: [
      "Concern-specific product selection",
      "Up to 15% off individual prices",
      "Custom gift packaging available",
      "Free shipping on all bundles",
      "Refill subscription option",
    ],
    price: "From Rs. 3,500 per bundle",
  },
  {
    icon: Shield,
    title: "Salon & Clinic Supply",
    tagline: "Professional-grade skincare at wholesale",
    desc: "We supply dermatology clinics, beauty salons, and spas across Pakistan with our full range at wholesale pricing. Minimum order of 10 units per SKU with dedicated account support.",
    image: "/img3.png",
    features: [
      "Minimum 10 units per SKU",
      "Up to 30% wholesale discount",
      "Private-label options available",
      "Dedicated account manager",
      "Net-30 payment terms",
    ],
    price: "Contact us for pricing",
  },
  {
    icon: Recycle,
    title: "Empty Bottle Take-Back",
    tagline: "Return your empties, we handle the rest",
    desc: "Drop off or courier your empty Sleet Care packaging to us. We clean, sort, and send glass to local recyclers. You earn loyalty points towards your next order for every bottle returned.",
    image: "/img1.png",
    features: [
      "All glass and aluminium accepted",
      "Earn 50 points per bottle",
      "Nationwide courier pickup available",
      "Certificate of recycling issued",
      "Zero landfill commitment",
    ],
    price: "Free — earn rewards",
  },
];

const process = [
  { step: "01", title: "Reach Out",     desc: "Contact us via WhatsApp, email, or the form below. Tell us your skin type, concerns, and what you're looking for." },
  { step: "02", title: "We Recommend",  desc: "Our team reviews your details and recommends the right service or product bundle within one business day." },
  { step: "03", title: "We Prepare",    desc: "Your consultation is booked or your bundle is packed fresh — we never ship old stock." },
  { step: "04", title: "You Glow",      desc: "Your products or consultation report arrive at your door. Follow-up support is always available on WhatsApp." },
];

export default function Services() {
  return (
    <div className="overflow-x-hidden bg-[#f7f8fc]">

      {/* Hero */}
      <section className="py-24 bg-[#eef0f8]">
        <div className="container text-center max-w-2xl">
          <p className="text-[10px] font-body font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-5">What We Offer</p>
          <h1 className="font-display text-5xl md:text-6xl text-[#1e2a5e] leading-[1.1] mb-6">
            Services built around your skin
          </h1>
          <p className="text-sm font-body font-light text-[#5a6380] leading-relaxed">
            From personalised consultations to wholesale supply — everything Sleet Care offers is rooted in the same principle: honest ingredients, honestly applied.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-[#f7f8fc]">
        <div className="container space-y-16">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const isEven = idx % 2 === 0;
            return (
              <div
                key={service.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${!isEven ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Image */}
                <div className={`overflow-hidden ${!isEven ? "lg:order-2" : ""}`}>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[380px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className={!isEven ? "lg:order-1" : ""}>
                  <div className="w-10 h-10 border border-[#dde2f0] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#2d3a8c]" />
                  </div>
                  <p className="text-[10px] font-body font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-2">{service.tagline}</p>
                  <h2 className="font-display text-3xl text-[#1e2a5e] mb-4">{service.title}</h2>
                  <p className="text-sm font-body font-light text-[#5a6380] leading-relaxed mb-6">{service.desc}</p>

                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2d3a8c] mt-2 shrink-0" />
                        <span className="text-sm font-body font-light text-[#5a6380]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-5 border-t border-[#dde2f0]">
                    <div>
                      <p className="text-[10px] font-body font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-1">Pricing</p>
                      <p className="font-display text-xl text-[#1e2a5e]">{service.price}</p>
                    </div>
                    <Link href="/contact">
                      <button className="flex items-center gap-2 bg-[#1e2a5e] text-white text-[11px] font-body font-medium uppercase tracking-[0.15em] px-6 py-3 hover:bg-[#2d3a8c] transition-colors">
                        Get Started <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#eef0f8]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-body font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">Simple Process</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">How it works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((item) => (
              <div key={item.step} className="bg-white border border-[#dde2f0] p-8">
                <p className="font-display text-5xl text-[#dde2f0] mb-4">{item.step}</p>
                <h3 className="font-display text-lg text-[#1e2a5e] mb-3">{item.title}</h3>
                <p className="text-sm font-body font-light text-[#5a6380] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1e2a5e]">
        <div className="container text-center">
          <p className="text-[10px] font-body font-medium uppercase tracking-[0.3em] text-[#8fa0d8] mb-5">Ready to Start?</p>
          <h2 className="font-display text-4xl md:text-5xl text-white leading-[1.15] mb-6">
            Let's build your<br />
            <em className="italic font-light text-[#c8d0f0]">perfect routine</em>
          </h2>
          <p className="text-sm font-light text-[#c8d0f0]/80 max-w-md mx-auto mb-10">
            Message us on WhatsApp or fill in the contact form — our team replies within one business day.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-white text-[#1e2a5e] text-[11px] font-body font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#eef0f8] transition-colors">
                Contact Us
              </button>
            </Link>
            <Link href="/shop">
              <button className="border border-[#8fa0d8]/50 text-white text-[11px] font-body font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-white hover:text-[#1e2a5e] transition-colors">
                Shop Products
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
