"use client";

import { useRef, type ReactNode, type FC } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ShieldCheck, Trophy, Users } from "lucide-react";

interface IFeature {
  icon: ReactNode;
  title: string;
  desc: string;
}

export const WhyChooseUs: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.to(".feature-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: container }
  );

  const features: IFeature[] = [
    {
      icon: <Trophy className="w-8 h-8 text-primary" />,
      title: "Student Achievement",
      desc: "Celebrating academic and co-curricular excellence in all students.",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Values & Culture",
      desc: "Instilling strong cultural and national values through arts and ethics.",
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Qualified Faculty",
      desc: "Our experienced and dedicated staff are mentors for every child.",
    },
  ];

  return (
    <section ref={container} className="py-20 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose SMV?
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide a holistic education that goes beyond textbooks.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card p-6 flex flex-col items-start text-left bg-muted/50 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 opacity-0 translate-y-12 scale-90"
            >
              <div className="bg-primary/10 p-3 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
