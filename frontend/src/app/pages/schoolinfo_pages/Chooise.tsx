"use client";

import { useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  // ... (same features as before)
  {
    title: "Dedicated Faculty",
    description: "Our experienced staff are mentors committed to every child.",
    image: "/images/smv2.jpg", // Staff with flag
  },
  {
    title: "Cultural Values",
    description: "We instill strong cultural and national values through arts.",
    image: "/images/smv3.jpg", // Dancers
  },
  {
    title: "Celebrating Achievement",
    description: "Recognizing and rewarding the talents of our students.",
    image: "/images/smv5.jpg", // Boy receiving award
  },
  {
    title: "Modern Campus",
    description: "A safe, secure, and well-equipped learning environment.",
    image: "/images/smv7.jpg", // School building
  },
];

export function WhyChooseUs() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.2,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose SMV?
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide a holistic education that goes beyond textbooks.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="feature-card overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <CardHeader className="p-0">
                {/* --- IMAGE STYLE FIX --- */}
                <div className="relative h-56 w-full bg-black/5 dark:bg-black/20">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    layout="fill"
                    objectFit="contain" // <-- CHANGED to 'contain'
                    className="p-2" // Optional padding
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{feature.title}</CardTitle>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
