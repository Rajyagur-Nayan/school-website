"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: "01",
    title: "Inquiry Form",
    desc: "Fill out our online inquiry form to show your interest.",
  },
  {
    step: "02",
    title: "School Tour",
    desc: "Visit our campus to meet the faculty and see our facilities.",
  },
  {
    step: "03",
    title: "Aptitude Test",
    desc: "A simple assessment for students entering Std. 1 and above.",
  },
  {
    step: "04",
    title: "Final Admission",
    desc: "Complete the documentation and fee payment to confirm your seat.",
  },
];

export function AdmissionsProcess() {
  const container = useRef(null);
  useGSAP(
    () => {
      gsap.from(".step-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.2,
      });
    },
    { scope: container }
  );

  return (
    <section
      id="admissions"
      ref={container}
      className="bg-muted py-20 md:py-32"
    >
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How to Apply
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <Card
              key={step.step}
              className="step-card border-t-4 border-primary"
            >
              <CardHeader>
                <span className="text-4xl font-bold text-primary">
                  {step.step}
                </span>
                <CardTitle className="pt-4">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
