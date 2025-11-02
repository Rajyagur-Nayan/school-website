"use client";

import { useRef, type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const Gallery: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".gallery-item", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)",
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  const images = [
    {
      src: "/images/smv6.jpg",
      alt: "SMV Gallery Image 1",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      src: "/images/smv3.jpg",
      alt: "SMV Gallery Image 2",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      src: "/images/smv school.jpg",
      alt: "SMV Gallery Image 3",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      src: "/images/smv1.jpg",
      alt: "SMV Gallery Image 4",
      className: "md:col-span-1 md:row-span-1",
    },
  ];

  return (
    <section ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Glimpses of SMV
          </h2>
          <p className="text-lg text-muted-foreground">
            A snapshot of our vibrant campus life and student activities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 grid-flow-dense grid-auto-rows-[300px]">
          {images.map((img) => (
            <div
              key={img.src}
              className={`gallery-item ${img.className} relative min-h-[300px] rounded-lg overflow-hidden shadow-lg group bg-muted/60`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                <Eye className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="#">View Full Gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
