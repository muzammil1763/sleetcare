"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/AppStore";
import { productIcons } from "@/data/mock";
import { ArrowLeft, Package, Plus, Minus, Loader2, Heart, Play, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

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

type Review = { id: string; name: string; rating: number; title: string; body: string; createdAt: string; };

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { data: session } = useSession();
  const { products, loadProducts, addToCart } = useAppStore();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedGalleryVideo, setSelectedGalleryVideo] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "", email: "", rating: 5, title: "", body: "",
  });
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    if (session?.user) {
      setReviewForm(f => ({
        ...f,
        name: f.name || session.user?.name || "",
        email: f.email || session.user?.email || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (!id) return;
    setReviewsLoading(true);
    fetch(`/api/reviews?productId=${id}`)
      .then(r => r.json())
      .then(d => setReviews(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.body) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewForm.name,
          email: reviewForm.email || `guest_${Date.now()}@sleetcare.com`,
          rating: reviewForm.rating,
          title: "",
          body: reviewForm.body,
          productId: id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");
      setReviews(prev => [data, ...prev]);
      setReviewForm(f => ({ ...f, title: "", body: "", rating: 5 }));
      toast({ title: "Review submitted!", description: "Thank you for your feedback." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

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

  const allGalleryItems = (product.images || []).filter(Boolean);
  const galleryImages = allGalleryItems.filter(item => !item.startsWith("video:"));
  const galleryVideos = allGalleryItems
    .filter(item => item.startsWith("video:"))
    .map(item => item.replace("video:", ""));

  const currentImage = selectedImage !== null && galleryImages[selectedImage]
    ? galleryImages[selectedImage]
    : product.image;

  const embedUrl = product.videoUrl ? toEmbedUrl(product.videoUrl) : null;

  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
    : 0;

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="container pt-10 pb-16 px-4 md:px-6">

        {/* Breadcrumb */}
        <Link href="/shop"
          className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#5a6380] hover:text-[#1e2a5e] transition-colors mb-10">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
        </Link>

        {/* ── Product Grid ── */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">

          {/* Left: gallery */}
          <div>
            <div className="relative overflow-hidden bg-[#dde8f8]" style={{ height: "420px" }}>
              {showVideo && embedUrl ? (
                <iframe src={embedUrl} className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen title={product.name} />
              ) : showVideo && selectedGalleryVideo !== null ? (
                <video src={galleryVideos[selectedGalleryVideo]} controls autoPlay
                  className="w-full h-full object-contain bg-black" />
              ) : currentImage ? (
                <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <img src="/img1.png" alt={product.name} className="w-full h-full object-cover" />
              )}

              {!showVideo && (
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em] bg-[#1e2a5e] text-white px-3 py-1.5">
                    {product.category}
                  </span>
                </div>
              )}

              {!showVideo && embedUrl && (
                <button onClick={() => { setShowVideo(true); setSelectedGalleryVideo(null); }}
                  className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#1e2a5e]/90 text-white px-4 py-2.5 hover:bg-[#1e2a5e] transition-colors">
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.15em]">Watch Video</span>
                </button>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-2 mt-2">
              {product.image && (
                <button onClick={() => { setSelectedImage(null); setShowVideo(false); setSelectedGalleryVideo(null); }}
                  className={`aspect-square overflow-hidden bg-[#dde8f8] transition-all ${selectedImage === null && !showVideo ? "ring-2 ring-[#1e2a5e]" : "opacity-60 hover:opacity-100"}`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </button>
              )}
              {!product.image && ["/img1.png", "/img2.png", "/img3.png"].map((src, i) => (
                <button key={i} onClick={() => { setSelectedImage(i); setShowVideo(false); setSelectedGalleryVideo(null); }}
                  className={`aspect-square overflow-hidden bg-[#dde8f8] transition-all ${selectedImage === i && !showVideo ? "ring-2 ring-[#1e2a5e]" : "opacity-60 hover:opacity-100"}`}>
                  <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {galleryImages.slice(0, 3).map((img, i) => (
                <button key={i} onClick={() => { setSelectedImage(i); setShowVideo(false); setSelectedGalleryVideo(null); }}
                  className={`aspect-square overflow-hidden bg-[#dde8f8] transition-all ${selectedImage === i && !showVideo ? "ring-2 ring-[#1e2a5e]" : "opacity-60 hover:opacity-100"}`}>
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {galleryVideos.map((_, i) => (
                <button key={`gvid-${i}`}
                  onClick={() => { setShowVideo(true); setSelectedGalleryVideo(i); setSelectedImage(null); }}
                  className={`aspect-square bg-[#1e2a5e] flex flex-col items-center justify-center gap-1 transition-all ${showVideo && selectedGalleryVideo === i ? "ring-2 ring-[#8fa0d8]" : "opacity-70 hover:opacity-100"}`}>
                  <Play className="w-5 h-5 text-white fill-white" />
                  <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#c8d0f0]">Video {i + 1}</span>
                </button>
              ))}
              {embedUrl && (
                <button onClick={() => { setShowVideo(true); setSelectedGalleryVideo(null); }}
                  className={`aspect-square bg-[#1e2a5e] flex flex-col items-center justify-center gap-1 transition-all ${showVideo && selectedGalleryVideo === null ? "ring-2 ring-[#8fa0d8]" : "opacity-70 hover:opacity-100"}`}>
                  <Play className="w-5 h-5 text-white fill-white" />
                  <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#c8d0f0]">Video</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: info */}
          <div className="lg:pt-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-3">{product.category}</p>
            <h1 className="text-[#1e2a5e] leading-[1.15] mb-3"
              style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "clamp(26px,4vw,36px)", fontWeight: 400 }}>
              {product.name}
            </h1>

            {/* Avg rating summary */}
            {reviews.length > 0 && (
              <button onClick={() => reviewRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 mb-4 group">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-[#dde2f0]"}`} />
                  ))}
                </div>
                <span className="text-xs font-light text-[#5a6380] group-hover:text-[#1e2a5e] transition-colors">
                  {avgRating} ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                </span>
              </button>
            )}

            <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-6">{product.shortDesc}</p>

            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-[#dde2f0]">
              <span className="text-[#1e2a5e]"
                style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "32px", fontWeight: 400 }}>
                Rs. {product.price.toLocaleString("en-PK")}
              </span>
              <span className="text-[10px] font-light uppercase tracking-[0.15em] text-[#5a6380]">PKR</span>
            </div>

            {product.specs && product.specs.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#5a6380] mb-4">Specifications</p>
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

            <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-8">{product.description}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
              <span className="text-[11px] font-light uppercase tracking-[0.12em] text-[#5a6380]">
                {product.stock > 0 ? `In Stock — ${product.stock} units available` : "Out of Stock"}
              </span>
            </div>

            {/* Buttons */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#dde2f0]">
                  <button className="w-10 h-12 flex items-center justify-center text-[#5a6380] hover:text-[#1e2a5e] hover:bg-[#eef0f8] transition-colors"
                    onClick={() => setQty(q => Math.max(1, q - 1))}>
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-[#1e2a5e]">{qty}</span>
                  <button className="w-10 h-12 flex items-center justify-center text-[#5a6380] hover:text-[#1e2a5e] hover:bg-[#eef0f8] transition-colors"
                    onClick={() => setQty(q => q + 1)}>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => { addToCart(product.id, qty); toast({ title: "Added to cart", description: `${qty} x ${product.name}` }); setQty(1); }}
                  disabled={product.stock <= 0}
                  className="flex-1 h-12 border border-[#1e2a5e] text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#eef0f8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </button>
                <button className="w-12 h-12 border border-[#dde2f0] flex items-center justify-center text-[#5a6380] hover:text-[#1e2a5e] hover:border-[#1e2a5e] transition-colors shrink-0">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => { addToCart(product.id, qty); router.push("/cart"); }}
                disabled={product.stock <= 0}
                className="w-full h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Shop Now
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-[#dde2f0] space-y-3">
              {["Free delivery on orders above Rs. 5,000", "Easy 30-day returns on unopened items", "100% natural ingredients, cruelty-free"].map(item => (
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
                <h2 className="text-[#1e2a5e]"
                  style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "22px", fontWeight: 400 }}>
                  {product.name} — Watch it in action
                </h2>
              </div>
            </div>
            <div className="aspect-video bg-[#1e2a5e] overflow-hidden max-w-3xl">
              <iframe src={embedUrl} className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen title={`${product.name} video`} />
            </div>
          </div>
        )}

        {/* ── Reviews ── */}
        <div ref={reviewRef} className="mt-16 pt-12 border-t border-[#dde2f0]">
          <div className="flex items-baseline gap-3 mb-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c]">Customer Reviews</p>
            {reviews.length > 0 && (
              <span className="text-xs font-light text-[#8fa0d8]">
                {avgRating} avg — {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Existing reviews */}
            <div>
              {reviewsLoading ? (
                <div className="py-10 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-[#8fa0d8]" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-[#dde2f0]">
                  <Star className="w-8 h-8 text-[#dde2f0] mx-auto mb-3" />
                  <p className="text-sm font-light text-[#5a6380]">No reviews yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map(r => (
                    <div key={r.id} className="bg-white border border-[#dde2f0] p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-medium text-[#1e2a5e]">{r.name}</p>
                          <p className="text-[10px] font-light text-[#8fa0d8]">
                            {new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </p>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-[#dde2f0]"}`} />
                          ))}
                        </div>
                      </div>
                      {r.title && <p className="text-sm font-medium text-[#1e2a5e] mb-1">{r.title}</p>}
                      <p className="text-sm font-light text-[#5a6380] leading-relaxed">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a review */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#5a6380] mb-5">Write a Review</p>
              <form onSubmit={submitReview} className="bg-white border border-[#dde2f0] p-6 space-y-4">

                {/* Star picker */}
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] block mb-2">Your Rating</label>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                        className="p-1 transition-transform hover:scale-110">
                        <Star className={`w-6 h-6 transition-colors ${s <= reviewForm.rating ? "fill-amber-400 text-amber-400" : "text-[#dde2f0] hover:text-amber-300"}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-light text-[#5a6380] self-center">{reviewForm.rating} / 5</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] block mb-1.5">Name *</label>
                  <input required value={reviewForm.name} onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full border border-[#dde2f0] px-3 py-2.5 text-sm font-light text-[#1e2a5e] focus:outline-none focus:border-[#1e2a5e] bg-white" />
                </div>

                {/* Hidden email for spam protection — auto-filled from session or left blank */}
                <input type="hidden" value={reviewForm.email} />

                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] block mb-1.5">Review *</label>
                  <textarea required value={reviewForm.body} onChange={e => setReviewForm(f => ({ ...f, body: e.target.value }))}
                    rows={4} placeholder="Tell others about your experience..."
                    className="w-full border border-[#dde2f0] px-3 py-2.5 text-sm font-light text-[#1e2a5e] focus:outline-none focus:border-[#1e2a5e] bg-white resize-none" />
                </div>

                <p className="text-[10px] font-light text-[#8fa0d8]">Only your name will be shown publicly.</p>

                <button type="submit" disabled={submitting}
                  className="w-full h-11 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
