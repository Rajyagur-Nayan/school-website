"use client";

import { useRef, type FC } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";

export const AdmissionsCTA: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2,
      });
    },
    { scope: container }
  );

  return (
    <section
      id="admissions"
      ref={container}
      className="py-20 md:py-32 bg-primary text-primary-foreground"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="container text-center flex flex-col items-center gap-6">
        <h2 className="cta-content text-3xl md:text-4xl font-bold">
          Join the SMV Family
        </h2>
        <p className="cta-content text-lg max-w-2xl text-primary-foreground/90">
          We are now accepting applications. Take the first step towards a
          bright and well-rounded future for your child.
        </p>
        <Button
          size="lg"
          variant="secondary"
          asChild
          className="cta-content text-lg"
        >
          <Link href="/apply-now">Apply for Admission</Link>
        </Button>
      </div>
    </section>
  );
};
