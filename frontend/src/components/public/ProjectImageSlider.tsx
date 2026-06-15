"use client";

import { useEffect, useMemo, useState } from "react";
import { asset } from "@/lib/api";

export function ProjectImageSlider({ title, imageUrl, imageUrl2 }: { title: string; imageUrl: string; imageUrl2?: string }) {
  const images = useMemo(() => [imageUrl, imageUrl2].filter(Boolean) as string[], [imageUrl, imageUrl2]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-56 w-full overflow-hidden bg-[#071b3f]">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-all duration-900 ease-out ${
            active === index ? "opacity-100 scale-100 shine-pulse" : "opacity-0 scale-[1.12]"
          }`}
        >
          <img
            src={asset(image)}
            alt={`${title} project image ${index + 1}`}
            className="h-full w-full object-cover"
          />
          {active === index && images.length > 1 && <div className="shine-overlay" />}
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#071b3f]/35 to-transparent" />
      {images.length > 1 ? (
        <div className="absolute bottom-3 right-3 flex gap-1.5">
          {images.map((image, index) => (
            <span key={image} className={`h-2 w-2 rounded-full ${active === index ? "bg-[#d6a842]" : "bg-white/60"}`} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
