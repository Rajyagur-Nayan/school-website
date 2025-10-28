"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    title: "Student Achievement",
    description:
      "We believe in celebrating success. Our students are consistently recognized for their talents in academics, sports, and the arts.",
    image: "/images/smv5.jpg", // Boy receiving award
  },
  {
    title: "Vibrant Arts & Culture",
    description:
      "From classical dance to modern arts, we provide a platform for every student to explore and showcase their creative passions.",
    image: "/images/smv3.jpg", // Dancers
  },
  {
    title: "Dedicated Faculty",
    description:
      "Our experienced teachers and staff are the backbone of our community, committed to guiding and inspiring every student.",
    image: "/images/smv4.jpg", // Staff with award
  },
];

export function Pillars() {
  const pillarsRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pillar-card", {
        scrollTrigger: {
          trigger: pillarsRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
      });
    }, pillarsRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="student-life"
      ref={pillarsRef}
      className="container py-20 md:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        A Foundation for Life
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="pillar-card overflow-hidden">
            <CardHeader>
              <div className="relative w-full h-56 mb-4">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardTitle>{pillar.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{pillar.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
