"use client";

import { useRef, type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface IProgram {
  title: string;
  description: string;
  image: string;
}

export const Programs: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.to(".program-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
      });
    },
    { scope: container }
  );

  const programs: IProgram[] = [
    {
      title: "Core Academics",
      description: "Rigorous curriculum for Science, Maths, and Humanities.",
      image: "/images/smv school.jpg",
    },
    {
      title: "Cultural Arts",
      description: "Explore classical dance, music, and visual arts.",
      image: "/images/smv9.jpg",
    },
    {
      title: "Sports & Athletics",
      description: "Physical education and competitive team sports.",
      image: "/images/smv1.jpg",
    },
  ];

  return (
    <section ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h2>
          <p className="text-lg text-muted-foreground">
            A balanced approach to academic, artistic, and physical development.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card
              key={program.title}
              className="program-card overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 opacity-0 translate-y-12 scale-95"
            >
              <CardHeader className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={program.image}
                    alt={program.title}
                    layout="fill"
                    objectFit="cover"
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
};
