"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const programs = [
  // ... (same programs as before)
  {
    title: "Core Academics",
    description: "Rigorous curriculum for Science, Maths, and Humanities.",
    image: "/images/smv8.jpg", // Illustration
  },
  {
    title: "Cultural Arts",
    description: "Explore classical dance, music, and visual arts.",
    image: "/images/smv3.jpg", // Dancers
  },
  {
    title: "Sports & Athletics",
    description: "Physical education and competitive team sports.",
    image: "/images/smv1.jpg", // Sports day
  },
];

export function Programs() {
  const container = useRef(null);

  useGSAP(
    () => {
      gsap.from(".program-card", {
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
    <section ref={container} className="py-20 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h2>
          <p className="text-lg text-muted-foreground">
            A balanced approach to academic, artistic, and physical development.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card key={program.title} className="program-card overflow-hidden">
              <CardHeader className="p-0">
                {/* --- IMAGE STYLE FIX --- */}
                <div className="relative h-64 w-full bg-muted">
                  <Image
                    src={program.image}
                    alt={program.title}
                    layout="fill"
                    objectFit="contain" // <-- CHANGED to 'contain'
                    className="p-4"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{program.title}</CardTitle>
                <p className="text-muted-foreground">{program.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="#">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
