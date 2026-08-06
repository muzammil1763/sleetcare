"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/AppStore";
import { serviceIcons } from "@/data/mock";
import { Check, ArrowLeft, Loader2, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import InquiryForm from "@/components/site/InquiryForm";

export default function ServiceDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { services, loadServices } = useAppStore();

  useEffect(() => { loadServices(); }, [loadServices]);

  const service = services.find((s) => s.slug === slug);

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#1e2a5e]" />
      </div>
    );
  }

  if (!service || !service.active) {
    router.push("/services");
    return null;
  }

  const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] ?? serviceIcons.Server;

  return (
    <div className="bg-[#f7f8fc] min-h-screen">

      {/* Hero */}
      <section className="py-16 bg-[#1e2a5e]">
        <div className="container">
          <Link href="/services" className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-[#8fa0d8] hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-3.5 h-3.5" /> All Services
          </Link>
          <div className="flex items-start gap-6">
            <div className="w-14 h-14 border border-[#8fa0d8]/30 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6 text-[#8fa0d8]" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8fa0d8] mb-2">{service.tagline}</p>
              <h1 className="font-display text-4xl md:text-5xl text-white leading-[1.1]">{service.name}</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Image */}
            {service.image && (
              <div className="overflow-hidden">
                <img src={service.image} alt={service.name} className="w-full h-64 object-cover" />
              </div>
            )}

            {/* Description */}
            <div className="bg-white border border-[#dde2f0] p-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-4">About this Service</p>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed text-base">{service.description}</p>
            </div>

            {/* Use Cases */}
            {service.useCases && service.useCases.length > 0 && (
              <div className="bg-[#eef0f8] border border-[#dde2f0] p-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-6">Use Cases</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.useCases.map((uc: string) => (
                    <div key={uc} className="bg-white border border-[#dde2f0] p-4 flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#2d3a8c] mt-2 shrink-0" />
                      <span className="text-sm font-light text-[#5a6380]">{uc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="bg-white border border-[#dde2f0] p-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-6">Benefits</p>
                <ul className="space-y-4">
                  {service.benefits.map((b: string) => (
                    <li key={b} className="flex items-start gap-4">
                      <div className="w-5 h-5 bg-[#1e2a5e] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-light text-[#5a6380] leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Link href="/contact">
              <button className="flex items-center gap-2 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#2d3a8c] transition-colors">
                Enquire About This Service <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="sticky top-28">
              <InquiryForm type="service" itemName={service.name} itemId={service.id} />
              <div className="mt-5 bg-white border border-[#dde2f0] p-6">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-4">Service Details</p>
                <div className="space-y-3">
                  {[
                    { label: "Response Time", value: "Within 1 business day" },
                    { label: "Delivery",       value: "Nationwide Pakistan"   },
                    { label: "Support",        value: "WhatsApp & Email"      },
                  ].map(d => (
                    <div key={d.label} className="flex justify-between py-2 border-b border-[#dde2f0] last:border-0">
                      <span className="text-xs font-light text-[#5a6380]">{d.label}</span>
                      <span className="text-xs font-medium text-[#1e2a5e]">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
