"use client";

import { useRef, type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
// Note: No need to re-register plugins

export const Welcome: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".welcome-content", {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
      });
      gsap.to(".welcome-image-inner", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: container }
  );

  return (
    <section id="welcome" ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="welcome-image relative w-full h-80 lg:h-[450px] rounded-xl overflow-hidden shadow-2xl">
          <div className="welcome-image-inner absolute inset-0 -top-[25%] h-[125%] w-full">
            <Image
              src="/images/smv4.jpg"
              alt="SMV Staff Community"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>
        <div className="welcome-content flex flex-col gap-4 items-start">
          <p className="font-semibold text-primary tracking-wide uppercase">
            About Our School
          </p>
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
            <Link href="#">About Our Mission</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
