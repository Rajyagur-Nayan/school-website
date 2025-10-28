"use client";

import { useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export function Welcome() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".welcome-content", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        x: -50,
        duration: 1,
      });
      gsap.from(".welcome-image", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        x: 50,
        duration: 1,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="welcome-content flex flex-col gap-6 items-start">
          <h2 className="text-3xl md:text-4xl font-bold">
            Welcome to Our Community
          </h2>
          <p className="text-lg text-muted-foreground">
            Sharda Mandir Vidhyalaya is more than just a school; it&apos;s a
            community of students, parents, and dedicated staff. We work
            together to create a supportive and engaging environment where
            everyone feels a sense of belonging.
          </p>
          <Button size="lg" asChild>
            <Link href="#about">About Our Mission</Link>
          </Button>
        </div>

        {/* --- IMAGE STYLE FIX --- */}
        <div className="welcome-image relative w-full h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl bg-black/5 dark:bg-black/20">
          <Image
            src="/images/smv4.jpg" // Staff group photo
            alt="SMV Staff Community"
            layout="fill"
            objectFit="contain" // <-- CHANGED to 'contain'
            className="p-4"
          />
        </div>
      </div>
    </section>
  );
}
