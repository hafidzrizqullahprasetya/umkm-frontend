"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import Image from "next/image";

interface EmblaFadeCarouselProps {
  images: string[];
  name: string;
  description?: string;
  logo?: string;
  options?: EmblaOptionsType;
}

export function EmblaFadeCarousel({
  images,
  name,
  description,
  logo,
  options,
}: EmblaFadeCarouselProps) {
  const [emblaRef] = useEmblaCarousel({ loop: true, ...options }, [
    Autoplay(),
    Fade(),
  ]);

  return (
    <div className="relative overflow-hidden">
      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] relative w-full h-[400px]"
            >
              <Image
                src={img}
                alt={`${name} - Image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay for content - dark background */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-[2px]">
        <div className="flex items-center gap-4">
          {logo && (
            <div className="w-16 h-16 relative flex-shrink-0">
              <Image
                src={logo}
                alt={`${name} logo`}
                width={64}
                height={64}
                className="object-contain rounded-xl"
              />
            </div>
          )}

          <div>
            <h1 className="text-4xl font-bold text-white">{name}</h1>
            {description && <p className="text-gray-200 mt-1 text-xl">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
