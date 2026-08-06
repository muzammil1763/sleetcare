"use client";

import { useEffect, useState } from "react";
import { Play, Calendar } from "lucide-react";

type Vlog = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  active: boolean;
  order: number;
  createdAt: string;
};

// Convert any YouTube URL to embed URL
function toEmbedUrl(url: string): string {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) return url;
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
  return url;
}

function getYoutubeThumbnail(url: string): string {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return `https://img.youtube.com/vi/${short[1]}/hqdefault.jpg`;
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return `https://img.youtube.com/vi/${watch[1]}/hqdefault.jpg`;
  const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return `https://img.youtube.com/vi/${embed[1]}/hqdefault.jpg`;
  const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return `https://img.youtube.com/vi/${shorts[1]}/hqdefault.jpg`;
  return "";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PK", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function VlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vlogs")
      .then((r) => r.json())
      .then((data) => {
        const active = Array.isArray(data) ? data.filter((v: Vlog) => v.active) : [];
        setVlogs(active);
        // Auto-open first video
        if (active.length > 0) setActiveId(active[0].id);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeVlog = vlogs.find((v) => v.id === activeId) ?? vlogs[0];

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="relative overflow-hidden pt-28 pb-14 bg-[#1e2a5e]">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="container relative">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">Behind the Brand</p>
          <h1
            className="text-[#f7f8fc] leading-[1.1]"
            style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "clamp(40px,6vw,64px)", fontWeight: 400 }}
          >
            Our Vlogs
          </h1>
          <p className="mt-4 text-sm font-light text-[#8fa0d8] max-w-lg leading-relaxed">
            Watch our latest videos — from fabric sourcing and embroidery craftsmanship to styling tips and new collection reveals.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-[#f7f8fc]">
        <div className="container">

          {loading ? (
            /* Skeleton */
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 aspect-video bg-[#E8DDD0] animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-28 h-16 bg-[#E8DDD0] animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-[#E8DDD0] animate-pulse w-3/4" />
                      <div className="h-2 bg-[#E8DDD0] animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : vlogs.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-16 h-16 border border-[#dde2f0] flex items-center justify-center mx-auto mb-5">
                <Play className="w-6 h-6 text-[#8fa0d8]" />
              </div>
              <h3
                className="text-[#1e2a5e] mb-2"
                style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "24px" }}
              >
                No vlogs yet
              </h3>
              <p className="text-sm font-light text-[#5a6380]">Check back soon for our latest videos.</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Main player */}
              <div className="lg:col-span-2">
                {activeVlog && (
                  <>
                    {/* Video */}
                    <div className="aspect-video bg-[#1e2a5e] overflow-hidden">
                      <iframe
                        key={activeVlog.id}
                        src={toEmbedUrl(activeVlog.videoUrl)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={activeVlog.title}
                      />
                    </div>

                    {/* Info */}
                    <div className="mt-5 pb-6 border-b border-[#dde2f0]">
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {formatDate(activeVlog.createdAt)}
                      </p>
                      <h2
                        className="text-[#1e2a5e] leading-snug mb-3"
                        style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "clamp(20px,3vw,28px)", fontWeight: 400 }}
                      >
                        {activeVlog.title}
                      </h2>
                      {activeVlog.description && (
                        <p className="text-sm font-light text-[#5a6380] leading-relaxed">
                          {activeVlog.description}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Playlist sidebar */}
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#5a6380] mb-4">
                  All Videos ({vlogs.length})
                </p>
                <div className="space-y-1">
                  {vlogs.map((v) => {
                    const thumb = v.thumbnail || getYoutubeThumbnail(v.videoUrl);
                    const isActive = v.id === activeId;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setActiveId(v.id)}
                        className={`w-full flex gap-3 p-3 text-left transition-colors ${
                          isActive
                            ? "bg-[#1e2a5e]"
                            : "bg-white border border-[#dde2f0] hover:border-[#8fa0d8]"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-24 h-14 shrink-0 overflow-hidden bg-[#E8DDD0] relative">
                          {thumb ? (
                            <img src={thumb} alt={v.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className={`w-4 h-4 ${isActive ? "text-[#f7f8fc]" : "text-[#8fa0d8]"}`} />
                            </div>
                          )}
                          {/* Play overlay */}
                          <div className={`absolute inset-0 flex items-center justify-center ${isActive ? "bg-[#2d3a8c]/40" : "bg-black/0 hover:bg-black/20"} transition-colors`}>
                            {isActive && <Play className="w-4 h-4 text-white fill-white" />}
                          </div>
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-snug line-clamp-2 ${isActive ? "text-[#f7f8fc]" : "text-[#1e2a5e]"}`}
                            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                          >
                            {v.title}
                          </p>
                          <p className={`text-[10px] font-light mt-1 ${isActive ? "text-[#8fa0d8]" : "text-[#5a6380]"}`}>
                            {formatDate(v.createdAt)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* More vlogs grid — show all below if more than 1 */}
      {vlogs.length > 1 && (
        <section className="py-16 bg-[#eef0f8]">
          <div className="container">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-2">Watch More</p>
                <h2
                  className="text-[#1e2a5e]"
                  style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "28px", fontWeight: 400 }}
                >
                  All Videos
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vlogs.map((v) => {
                const thumb = v.thumbnail || getYoutubeThumbnail(v.videoUrl);
                const isActive = v.id === activeId;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveId(v.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group text-left"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-[#E8DDD0] overflow-hidden relative">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-[#8fa0d8]" />
                        </div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-[#1e2a5e]/0 group-hover:bg-[#1e2a5e]/30 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 text-[#1e2a5e] fill-[#1e2a5e]" />
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute top-3 left-3 bg-[#2d3a8c] px-2 py-1">
                          <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-white">Now Playing</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="pt-4">
                      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#2d3a8c] mb-1">
                        {formatDate(v.createdAt)}
                      </p>
                      <h3
                        className="text-[#1e2a5e] leading-snug group-hover:text-[#2d3a8c] transition-colors line-clamp-2"
                        style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "17px" }}
                      >
                        {v.title}
                      </h3>
                      {v.description && (
                        <p className="text-sm font-light text-[#5a6380] mt-1.5 line-clamp-2">{v.description}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
