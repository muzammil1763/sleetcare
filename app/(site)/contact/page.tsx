"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import SocialLinks from "@/components/site/SocialLinks";

type Settings = {
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  contact_address?: string;
};

const PLACEHOLDER: Settings = {
  contact_email: "hello@sleetcare.com",
  contact_phone: "+92 300 8662833",
  contact_whatsapp: "923008662833",
  contact_address: "Faisalabad, Punjab, Pakistan",
};

const faqs = [
  { q: "How long does shipping take?",                   a: "Standard orders are dispatched within 1–2 business days and typically arrive in 3–5 working days across Pakistan." },
  { q: "Can I return something I've opened?",            a: "We accept returns on unopened, unused products within 30 days of delivery. Contact us and we'll arrange a free return pickup." },
  { q: "Are your products suitable for sensitive skin?", a: "Yes — all Sleet Care formulas are tested on all six Fitzpatrick skin types, fragrance-free, and free from common irritants." },
  { q: "Do you offer routine advice?",                   a: "Absolutely. Reach out via WhatsApp or the contact form with your skin type and concerns — our team will suggest a personalised routine." },
  { q: "Do you sell wholesale or to salons?",            a: "Yes, we offer wholesale pricing for salons, clinics, and retailers. Minimum order of 10 units per SKU. Contact us for a price list." },
  { q: "What payment methods do you accept?",            a: "We accept bank transfer to Meezan Bank (Account: Muhammad Hanan Ajmal, IBAN: PK17 MEZN 0004 1301 0517 0552) and cash on delivery across Pakistan." },
  { q: "Can I track my order?",                          a: "Yes — once dispatched you'll receive a tracking number via WhatsApp and email within 24 hours." },
  { q: "Are ingredients listed on the packaging?",       a: "Always. Full INCI ingredient lists appear on every carton, and the exact percentage of every active is listed on our product pages." },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", interest: "skincare" });
  const [settings, setSettings] = useState<Settings>(PLACEHOLDER);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          setSettings({
            contact_email:    d.contact_email    || PLACEHOLDER.contact_email,
            contact_phone:    d.contact_phone    || PLACEHOLDER.contact_phone,
            contact_whatsapp: d.contact_whatsapp || PLACEHOLDER.contact_whatsapp,
            contact_address:  d.contact_address  || PLACEHOLDER.contact_address,
          });
        }
      })
      .catch(() => {});
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ title: "Message sent", description: "We'll respond within one business day." });
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="py-24 bg-[#1e2a5e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(rgba(200,208,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,208,240,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="container relative z-10 max-w-2xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#8fa0d8] mb-6">We'd Love to Hear From You</p>
          <h1 className="font-display text-5xl md:text-6xl text-white leading-[1.1] mb-6">
            Contact Sleet Care
          </h1>
          <p className="text-sm font-light text-[#c8d0f0]/70 leading-relaxed max-w-lg mx-auto">
            Whether you need help choosing a serum, tracking a parcel or stocking us in your salon — a real person will get back to you within one business day.
          </p>
        </div>
      </section>

      {/* 4 Contact Cards */}
      <section className="bg-[#f7f8fc] py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              { icon: Phone,         title: "Call us",          line1: settings.contact_phone    || "+92 300 8662833",    line2: "Mon–Fri, 9am–6pm PKT",       href: `tel:${settings.contact_phone || "+923008662833"}` },
              { icon: Mail,          title: "Email us",         line1: settings.contact_email    || "hello@sleetcare.com", line2: "Replies within 1 business day", href: `mailto:${settings.contact_email || "hello@sleetcare.com"}` },
              { icon: MapPin,        title: "Find us",          line1: settings.contact_address  || "Faisalabad, Pakistan",line2: "Punjab, Pakistan",             href: "https://www.google.com/maps?q=31.411588668823242,73.08773040771484&z=17&hl=en" },
              { icon: MessageCircle, title: "WhatsApp",         line1: "Chat with us anytime",   line2: "+92 300 8662833",                                        href: `https://wa.me/${settings.contact_whatsapp || "923008662833"}?text=${encodeURIComponent("Hi! I'd like to enquire about Sleet Care products.")}` },
            ].map((item) => {
              const Icon = item.icon;
              const isExternal = item.icon === MapPin || item.icon === MessageCircle;
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="bg-white border border-[#dde2f0] p-6 hover:border-[#2d3a8c] hover:shadow-md transition-all group block"
                >
                  <div className="w-10 h-10 border border-[#dde2f0] flex items-center justify-center mb-4 group-hover:bg-[#1e2a5e] group-hover:border-[#1e2a5e] transition-colors">
                    <Icon className="w-4 h-4 text-[#2d3a8c] group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-2">{item.title}</p>
                  <p className="text-sm font-light text-[#1e2a5e] mb-0.5">{item.line1}</p>
                  <p className="text-xs font-light text-[#5a6380]">{item.line2}</p>
                </a>
              );
            })}
          </div>

          {/* Form + Studio Hours */}
          <div className="grid lg:grid-cols-5 gap-10 mb-16">
            {/* Form */}
            <form onSubmit={onSubmit} className="lg:col-span-3 bg-white border border-[#dde2f0] p-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-2">Send a Message</p>
              <h2 className="font-display text-2xl text-[#1e2a5e] mb-6">Tell us what you need</h2>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Full Name</Label>
                    <Input required {...field("name")} placeholder="Jane Doe" className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Email</Label>
                    <Input required type="email" {...field("email")} placeholder="jane@email.com" className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Phone (Optional)</Label>
                    <Input {...field("phone")} placeholder="+92 300 0000000" className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Topic</Label>
                    <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="w-full h-10 border border-[#dde2f0] bg-white px-3 text-sm font-light text-[#1e2a5e] focus:outline-none focus:border-[#1e2a5e]">
                      <option value="skincare">Skincare Advice</option>
                      <option value="order">Order Status</option>
                      <option value="return">Returns & Exchanges</option>
                      <option value="wholesale">Wholesale</option>
                      <option value="general">General Enquiry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Message</Label>
                  <Textarea rows={5} required {...field("message")} placeholder="Tell us about your skin type, concerns or order number..." className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light resize-none" />
                </div>
                <button type="submit" disabled={sent}
                  className="w-full h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                  {sent ? <><CheckCircle2 className="w-4 h-4" /> Message Sent</> : "✈ Send Message"}
                </button>
              </div>
            </form>

            {/* Studio Hours + Social */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-[#eef0f8] border border-[#dde2f0] p-6">
                <h3 className="font-display text-lg text-[#1e2a5e] mb-5">Studio Hours</h3>
                <div className="space-y-0">
                  {[
                    { day: "Monday — Friday", hours: "9:00am – 6:00pm PKT" },
                    { day: "Saturday",        hours: "10:00am – 4:00pm PKT" },
                    { day: "Sunday",          hours: "Closed" },
                  ].map((item) => (
                    <div key={item.day} className="flex justify-between py-3 border-b border-[#dde2f0] last:border-0">
                      <span className="text-sm font-light text-[#5a6380]">{item.day}</span>
                      <span className="text-sm font-normal text-[#1e2a5e]">{item.hours}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-[#dde2f0] space-y-2">
                  <p className="text-xs font-light text-[#5a6380] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2d3a8c] shrink-0" /> Orders placed before 1pm ship the same day.
                  </p>
                  <p className="text-xs font-light text-[#5a6380] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2d3a8c] shrink-0" /> Free shipping on orders over Rs. 5,000.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#dde2f0] p-6">
                <h3 className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#5a6380] mb-4">Follow Us</h3>
                <SocialLinks variant="light" />
              </div>

              <a href={`https://wa.me/${settings.contact_whatsapp || "923008662833"}?text=${encodeURIComponent("Hi! I'd like to enquire about Sleet Care products.")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#25D366] text-white p-5 hover:bg-[#20BA5A] transition-colors">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em]">Chat on WhatsApp</p>
                  <p className="text-xs font-light opacity-80 mt-0.5">Usually replies within minutes</p>
                </div>
              </a>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <div className="text-center mb-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-3">FAQ</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">Frequently asked questions</h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-2">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-[#dde2f0]">
                  <button onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#eef0f8] transition-colors">
                    <span className="text-sm font-normal text-[#1e2a5e] pr-4">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8fa0d8] shrink-0 transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5">
                      <p className="text-sm font-light text-[#5a6380] leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
