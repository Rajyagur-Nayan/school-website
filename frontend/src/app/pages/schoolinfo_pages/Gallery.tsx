"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const images = [
  "/images/smv school.jpg",
  "/images/smv6.jpg",
  "/images/smv9.jpg",
  "/images/smv1.jpg",
  "/images/smv4.jpg",
  "/images/smv5.jpg",
];

export function Gallery() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".gallery-item", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-20 md:py-32">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Glimpses of SMV
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src) => (
            <div
              key={src}
              className="gallery-item relative h-64 md:h-80 w-full rounded-lg overflow-hidden shadow-lg group bg-muted"
            >
              {/* --- IMAGE STYLE FIX --- */}
              <Image
                src={src}
                alt="SMV Gallery Image"
                layout="fill"
                objectFit="contain" // <-- CHANGED to 'contain'
                className="p-3 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
