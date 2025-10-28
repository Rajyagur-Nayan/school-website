"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

const facilities = [
  {
    title: "Computer Lab",
    desc: "Equipped with modern systems to enhance digital literacy.",
    image: "/images/smv5.jpg", // Image shows "Computer Lab" sign
  },
  {
    title: "Spacious Campus",
    desc: "A secure and nurturing environment for learning and play.",
    image: "/images/smv7.jpg", // Image of "Amrutba High School" building
  },
  {
    title: "Library",
    desc: "A quiet space for students to read, research, and expand their minds.",
    image: "/images/smv9.jpg", // Placeholder - use a library pic if you have one
  },
];

export function Facilities() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".facility-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="bg-muted py-20 md:py-32">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Our Facilities
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {facilities.map((facility) => (
            <Card
              key={facility.title}
              className="facility-card overflow-hidden"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{facility.title}</CardTitle>
                <p className="text-muted-foreground">{facility.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
