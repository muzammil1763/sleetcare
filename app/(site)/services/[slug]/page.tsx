"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/AppStore";
import { serviceIcons } from "@/data/mock";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="container pt-40 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  if (!service) {
    router.push("/services");
    return null;
  }

  if (!service.active) {
    return (
      <div className="container pt-32 pb-20 text-center">
        <div className="chip mx-auto mb-4">Service Unavailable</div>
        <h1 className="text-3xl font-bold">This service is currently inactive</h1>
        <p className="text-muted-foreground mt-3">Contact our team for availability.</p>
        <Link href="/services">
          <Button variant="outline" className="mt-6">Back to services</Button>
        </Link>
      </div>
    );
  }

  const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] ?? serviceIcons.Server;

  return (
    <div className="container pt-24 pb-12">
      <Link href="/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> All services
      </Link>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          {service.image && (
            <div className="w-full h-64 rounded-xl mb-8 relative overflow-hidden">
              <img 
                src={service.image} 
                alt={service.name} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <span className="chip text-white border-white/30 bg-white/20 backdrop-blur">Active Service</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <div>
              {!service.image && <span className="chip text-primary border-primary/30 bg-primary/10">Active Service</span>}
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-3">{service.name}</h1>
              <p className="text-lg text-primary/80 font-mono mt-1">{service.tagline}</p>
            </div>
          </div>

          <p className="mt-8 text-muted-foreground leading-relaxed text-lg">{service.description}</p>

          <section className="mt-12">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Use Cases</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.useCases.map((uc) => (
                <div key={uc} className="glass-card p-4 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2" />
                  <span className="text-sm">{uc}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-sm font-mono uppercase tracking-wider text-muted-foreground mb-4">Benefits</h2>
            <ul className="space-y-3">
              {service.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-28 space-y-4">
            <InquiryForm type="service" itemName={service.name} itemId={service.id} />
            <div className="glass-card p-6">
              <div className="space-y-2 text-xs font-mono text-muted-foreground">
                <div className="flex justify-between">
                  <span>SLA</span>
                  <span className="text-foreground">99%</span>
                </div>
                <div className="flex justify-between">
                  <span>Onboarding</span>
                  <span className="text-foreground">2–6 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}