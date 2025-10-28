"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const programs = [
  {
    title: "Primary School (Std. 1-5)",
    desc: "Building strong foundations in literacy, numeracy, and curiosity.",
  },
  {
    title: "Middle School (Std. 6-8)",
    desc: "Developing critical thinking and exploring diverse subjects.",
  },
  {
    title: "High School (Std. 9-12)",
    desc: "Specialized streams in Science and Commerce for career focus.",
  },
];

export function Academics() {
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
    <section ref={container} className="container py-20 md:py-32">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Academic Excellence
        </h2>
        <p className="text-lg text-muted-foreground">
          Our curriculum is designed to challenge and inspire students at every
          level, preparing them for the future.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {programs.map((program) => (
          <Card key={program.title} className="program-card shadow-lg">
            <CardHeader>
              <CardTitle className="text-primary">{program.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{program.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
