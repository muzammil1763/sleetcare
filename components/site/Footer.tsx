"use client";

import Link from "next/link";
import SocialLinks from "@/components/site/SocialLinks";
import { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

type Settings = {
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  contact_address?: string;
  company_tagline?: string;
};

const PLACEHOLDER_SETTINGS: Settings = {
  contact_email: "hello@sleetcare.com",
  contact_phone: "+92 300 8662833",
  contact_whatsapp: "923008662833",
  contact_address: "Faisalabad, Punjab, Pakistan",
  company_tagline: "Clean beauty. Conscious choices. Confidence, naturally.",
};

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings({
            contact_email: data.contact_email || PLACEHOLDER_SETTINGS.contact_email,
            contact_phone: data.contact_phone || PLACEHOLDER_SETTINGS.contact_phone,
            contact_whatsapp: data.contact_whatsapp || PLACEHOLDER_SETTINGS.contact_whatsapp,
            contact_address: data.contact_address || PLACEHOLDER_SETTINGS.contact_address,
            company_tagline: data.company_tagline || PLACEHOLDER_SETTINGS.company_tagline,
          });
        } else {
          setSettings(PLACEHOLDER_SETTINGS);
        }
      })
      .catch(() => { setSettings(PLACEHOLDER_SETTINGS); });
  }, []);

  const waUrl = settings.contact_whatsapp
    ? `https://wa.me/${settings.contact_whatsapp}?text=${encodeURIComponent("Hi! I'm interested in your leather jacket collection.")}`
    : "#";

  return (
    <footer className="bg-[#1e2a5e] text-[#c8d0f0]">
      {/* Top decorative line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#8fa0d8]/40 to-transparent" />

      <div className="container py-16 grid gap-12 md:grid-cols-4">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-6">
            <img src="/logo.png" alt="Sleet Care" className="h-20 w-auto" />
          </div>
          <p className="text-sm font-body font-light text-[#c8d0f0]/80 leading-relaxed">
            {settings.company_tagline || "Clean beauty. Conscious choices. Confidence, naturally."}
          </p>
          <div className="mt-6">
            <SocialLinks variant="dark" />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[10px] font-body font-medium uppercase tracking-[0.25em] text-white mb-5">Quick Links</h4>
          <ul className="space-y-3 text-sm font-body font-light">
            {[
              { href: "/",        label: "Home" },
              { href: "/shop",    label: "Shop" },
              { href: "/about",   label: "About Us" },
              { href: "/contact", label: "Contact Us" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[#c8d0f0]/70 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-[10px] font-body font-medium uppercase tracking-[0.25em] text-white mb-5">Customer Care</h4>
          <ul className="space-y-3 text-sm font-body font-light">
            {[
              { href: "/contact", label: "Shipping Policy" },
              { href: "/contact", label: "Return Policy" },
              { href: "/contact", label: "Terms & Conditions" },
              { href: "/contact", label: "Privacy Policy" },
              { href: "/contact", label: "Track Order" },
              { href: "/contact", label: "FAQs" },
            ].map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="text-[#c8d0f0]/70 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-body font-medium uppercase tracking-[0.25em] text-white mb-5">Contact Us</h4>
          <div className="space-y-3 mb-6">
            {settings.contact_phone && (
              <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-3 text-[#c8d0f0]/70 hover:text-white transition-colors text-sm font-body font-light">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{settings.contact_phone}</span>
              </a>
            )}
            {settings.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-3 text-[#c8d0f0]/70 hover:text-white transition-colors text-sm font-body font-light">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{settings.contact_email}</span>
              </a>
            )}
            {settings.contact_address && (
              <div className="flex items-start gap-3 text-[#c8d0f0]/70 text-sm font-body font-light">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{settings.contact_address}</span>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-[10px] font-body font-medium uppercase tracking-[0.2em] text-[#c8d0f0]/60 mb-2">Newsletter</p>
            <p className="text-xs font-body font-light text-[#c8d0f0]/60 mb-3">Subscribe for special offers and once-in-a-lifetime deals.</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2.5 bg-white/10 border border-[#8fa0d8]/30 text-sm font-body font-light text-white placeholder-[#c8d0f0]/40 focus:outline-none focus:border-[#8fa0d8] transition-colors"
              />
              <button className="w-full py-2.5 bg-[#2d3a8c] text-white text-[10px] font-body font-medium uppercase tracking-[0.2em] hover:bg-[#3a4aa0] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#8fa0d8]/15">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-body font-light text-[#c8d0f0]/50 tracking-[0.1em]">
          <span>© {new Date().getFullYear()} Sleet Care. All Rights Reserved.</span>
          <span>100% Natural Ingredients · Cruelty Free</span>
        </div>
      </div>
    </footer>
  );
}
