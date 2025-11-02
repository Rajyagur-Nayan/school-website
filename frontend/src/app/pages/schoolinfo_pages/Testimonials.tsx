"use client";

import { useRef, type FC } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Quote } from "lucide-react";

interface ITestimonial {
  quote: string;
  name: string;
  role: string;
}

export const Testimonials: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".testimonial-card", {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
      });
      // This parallax effect can be kept or removed if it feels too busy
      gsap.utils.toArray(".testimonial-card").forEach((card, index) => {
        gsap.to(card as HTMLElement, {
          y: index % 2 === 0 ? -100 : -50,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            scrub: 1,
            start: "top 80%",
            end: "bottom 70%",
          },
        });
      });
    },
    { scope: container }
  );

  const testimonials: ITestimonial[] = [
    {
      quote:
        "SMV has been a second home for my child. The focus on both values and academics is exactly what we were looking for. We've seen tremendous growth.",
      name: "A. Sharma",
      role: "Parent, Std. 7",
    },
    {
      quote:
        "The teachers are incredibly supportive. The school's environment is safe, disciplined, and encourages kids to participate in all activities, not just studies.",
      name: "R. Patel",
      role: "Parent, Std. 9",
    },
    {
      quote:
        "The cultural programs are outstanding. My daughter has found her passion for dance here.",
      name: "S. Iyer",
      role: "Parent, Std. 5",
    },
  ];

  return (
    <section ref={container} className="py-20 md:py-32">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Parents Say
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((item) => (
            <Card
              key={item.name}
              className="testimonial-card flex flex-col shadow-xl bg-muted/50"
            >
              <CardHeader>
                <Quote className="w-10 h-10 text-primary/30 mb-4" />
                <blockquote className="text-2xl font-light leading-relaxed text-foreground">
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
};
