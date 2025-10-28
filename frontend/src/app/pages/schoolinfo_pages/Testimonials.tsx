"use client";

import { useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "SMV High School has been a second home for my child. The focus on both values and academics is exactly what we were looking for. We've seen tremendous growth in just one year.",
    name: "A. Sharma",
    role: "Parent, Std. 7",
  },
  {
    quote:
      "The teachers are incredibly supportive and accessible. The school's environment is safe, disciplined, and encourages kids to participate in all activities, not just studies.",
    name: "R. Patel",
    role: "Parent, Std. 9",
  },
  {
    quote:
      "We are so happy with our choice. The cultural programs and sports days are wonderfully organized, and our children are always excited to go to school.",
    name: "M. Varma",
    role: "Parent, Std. 4",
  },
];

export function Testimonials() {
  const container = useRef(null);
  useGSAP(
    () => {
      gsap.from(".testimonial-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.3,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Parents Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <Card key={item.name} className="testimonial-card flex flex-col">
              <CardHeader>
                <blockquote className="text-xl font-semibold leading-snug text-foreground">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </CardHeader>
              <CardContent className="flex-grow"></CardContent>
              <CardFooter>
                <p className="font-semibold text-foreground">
                  {item.name}
                  <span className="text-muted-foreground font-normal">
                    , {item.role}
                  </span>
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
