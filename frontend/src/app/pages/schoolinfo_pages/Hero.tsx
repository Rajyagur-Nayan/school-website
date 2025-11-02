"use client"; // This component uses hooks

import { useRef, type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

// Register GSAP plugins ONCE in your first component
gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Hero: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".hero-title", {
        opacity: 0,
        y: 50,
        scale: 1.1,
        filter: "blur(5px)",
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(".hero-buttons", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative grid grid-cols-1 grid-rows-1 items-center justify-center min-h-screen text-center text-white overflow-hidden"
    >
      <div className="col-start-1 row-start-1">
        <Image
          src="/images/smv8.jpg"
          alt="Sharda Mandir Vidhyalaya Campus"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="col-start-1 row-start-1 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
      <div className="relative z-10 col-start-1 row-start-1 container mx-auto px-6 flex flex-col items-center gap-8">
        <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-2xl">
          Sharda Mandir Vidhyalaya
        </h1>
        <p className="hero-subtitle text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl leading-relaxed">
          Empowering young minds with values, culture, and academic excellence —
          nurturing leaders for tomorrow.
        </p>
        <div className="hero-buttons flex flex-wrap justify-center gap-6">
          <Button size="lg" asChild>
            <Link href="#admissions">Admissions Open</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#welcome">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
