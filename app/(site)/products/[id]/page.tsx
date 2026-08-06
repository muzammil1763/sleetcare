"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/AppStore";
import { productIcons } from "@/data/mock";
import { ArrowLeft, Package, Plus, Minus, Loader2, Heart, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

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

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { products, loadProducts, addToCart } = useAppStore();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const product = products.find((p) => p.id === id);

  if (products.length === 0) {
    return (
      <div className="container pt-40 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#8fa0d8] mx-auto" />
      </div>
    );
  }

  if (!product) {
    router.push("/products");
    return null;
  }

  const Icon = productIcons[product.icon as keyof typeof productIcons] ?? Package;
  const galleryImages = (product.images || []).filter(Boolean);
  const currentImage = selectedImage !== null && galleryImages[selectedImage]
    ? galleryImages[selectedImage]
    : product.image;

  const embedUrl = product.videoUrl ? toEmbedUrl(product.videoUrl) : null;

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="container pt-10 pb-16">

        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#5a6380] hover:text-[#1e2a5e] transition-colors mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-14">

          {/* ── Left: Images + Video ── */}
          <div>
            {/* Main image / video toggle */}
            <div className="relative aspect-[3/4] overflow-hidden bg-[#dde8f8]">
              {showVideo && embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={product.name}
                />
              ) : currentImage ? (
                <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <img src="/img1.png" alt={product.name} className="w-full h-full object-cover" />
              )}

              {/* Category badge */}
              {!showVideo && (
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em] bg-[#1e2a5e] text-white px-3 py-1.5">
                    {product.category}
                  </span>
                </div>
              )}

              {/* Video play button overlay */}
              {!showVideo && embedUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#1e2a5e]/90 backdrop-blur-sm text-white px-4 py-2.5 hover:bg-[#1e2a5e] transition-colors group"
                >
                  <div className="w-6 h-6 bg-[#2d3a8c] flex items-center justify-center shrink-0">
                    <Play className="w-3 h-3 fill-white text-white" />
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em]">Watch Video</span>
                </button>
              )}
            </div>

            {/* Thumbnails row */}
            <div className="grid grid-cols-5 gap-2 mt-3">
              {product.image && (
                <div
                  onClick={() => { setSelectedImage(null); setShowVideo(false); }}
                  className={`aspect-square overflow-hidden bg-[#dde8f8] cursor-pointer transition-all ${
                    selectedImage === null && !showVideo ? "ring-2 ring-[#1e2a5e]" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}
              {/* Local image thumbnails when no product images */}
              {!product.image && ["/img1.png", "/img2.png", "/img3.png"].map((src, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedImage(i); setShowVideo(false); }}
                  className={`aspect-square overflow-hidden bg-[#dde8f8] cursor-pointer transition-all ${
                    selectedImage === i && !showVideo ? "ring-2 ring-[#1e2a5e]" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {galleryImages.slice(0, 3).map((img, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedImage(i); setShowVideo(false); }}
                  className={`aspect-square overflow-hidden bg-[#dde8f8] cursor-pointer transition-all ${
                    selectedImage === i && !showVideo ? "ring-2 ring-[#1e2a5e]" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {embedUrl && (
                <div
                  onClick={() => setShowVideo(true)}
                  className={`aspect-square bg-[#1e2a5e] cursor-pointer flex flex-col items-center justify-center gap-1 transition-all ${
                    showVideo ? "ring-2 ring-[#8fa0d8]" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <Play className="w-5 h-5 text-white fill-white" />
                  <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#c8d0f0]">Video</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="lg:pt-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-3">
              {product.category}
            </p>
            <h1
              className="text-[#1e2a5e] leading-[1.15] mb-4"
              style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 400 }}
            >
              {product.name}
            </h1>
            <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-6">{product.shortDesc}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-[#dde2f0]">
              <span
                className="text-[#1e2a5e]"
                style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "32px", fontWeight: 400 }}
              >
                Rs. {product.price.toLocaleString("en-PK")}
              </span>
              <span className="text-[10px] font-light uppercase tracking-[0.15em] text-[#5a6380]">PKR</span>
            </div>

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#5a6380] mb-4">
                  Specifications
                </p>
                <div className="space-y-0">
                  {product.specs.map((s) => (
                    <div key={s.label} className="flex justify-between items-center py-2.5 border-b border-[#dde2f0]">
                      <span className="text-[11px] font-light uppercase tracking-[0.12em] text-[#5a6380]">{s.label}</span>
                      <span className="text-[11px] font-medium text-[#1e2a5e]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-8">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
              <span className="text-[11px] font-light uppercase tracking-[0.12em] text-[#5a6380]">
                {product.stock > 0 ? `In Stock — ${product.stock} units available` : "Out of Stock"}
              </span>
            </div>

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-[#dde2f0]">
                <button
                  className="w-10 h-12 flex items-center justify-center text-[#5a6380] hover:text-[#1e2a5e] hover:bg-[#eef0f8] transition-colors"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-medium text-[#1e2a5e]">{qty}</span>
                <button
                  className="w-10 h-12 flex items-center justify-center text-[#5a6380] hover:text-[#1e2a5e] hover:bg-[#eef0f8] transition-colors"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  addToCart(product.id, qty);
                  toast({ title: "Added to cart", description: `${qty} × ${product.name}` });
                  setQty(1);
                }}
                disabled={product.stock <= 0}
                className="flex-1 h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </button>

              <button className="w-12 h-12 border border-[#dde2f0] flex items-center justify-center text-[#5a6380] hover:text-[#1e2a5e] hover:border-[#1e2a5e] transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 pt-8 border-t border-[#dde2f0] space-y-3">
              {[
                "Free delivery on orders above Rs. 5,000",
                "Easy 30-day returns on unopened items",
                "100% natural ingredients, cruelty-free",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-[#2d3a8c] rounded-full" />
                  <span className="text-[11px] font-light text-[#5a6380]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video section */}
        {embedUrl && (
          <div className="mt-16 pt-12 border-t border-[#dde2f0]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-[#1e2a5e] flex items-center justify-center shrink-0">
                <Play className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-0.5">Product Video</p>
                <h2
                  className="text-[#1e2a5e]"
                  style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "22px", fontWeight: 400 }}
                >
                  {product.name} — Watch it in action
                </h2>
              </div>
            </div>
            <div className="aspect-video bg-[#1e2a5e] overflow-hidden max-w-3xl">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${product.name} video`}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
