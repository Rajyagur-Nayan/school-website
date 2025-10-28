"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function Hero() {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-content", {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.2,
      }).from(
        ".hero-image",
        { opacity: 0, scale: 0.9, duration: 1.2 },
        "-=0.8"
      );
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="container grid lg:grid-cols-2 items-center gap-12 py-20 md:py-32 min-h-screen"
    >
      <div className="flex flex-col gap-6 items-start">
        <h1 className="hero-content text-5xl md:text-7xl font-extrabold tracking-tighter">
          Sharda Mandir Vidhyalaya
        </h1>
        <p className="hero-content text-lg md:text-xl text-muted-foreground max-w-lg">
          Nurturing young minds with a foundation of values, culture, and
          academic excellence.
        </p>
        <div className="hero-content flex gap-4">
          <Button size="lg" asChild>
            <Link href="#admissions">Admissions Open</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#about">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* --- IMAGE STYLE FIX --- */}
      <div className="hero-image relative w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-xl overflow-hidden bg-muted">
        <Image
          src="/images/smv8.jpg" // The kite-flying illustration
          alt="Students flying kites at SMV School"
          layout="fill"
          objectFit="contain" // <-- CHANGED to 'contain'
          className="p-4" // Adds some padding inside the muted box
          priority
        />
      </div>
    </section>
  );
}
