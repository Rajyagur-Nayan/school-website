"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const activities = [
  {
    title: "Sports Day",
    image: "/images/smv1.jpg",
  },
  {
    title: "Cultural Programs",
    image: "/images/smv 3.jpg",
  },
  {
    title: "Award Ceremonies",
    image: "/images/smv school.jpg",
  },
  {
    title: "Community Events",
    image: "/images/smv6.jpg",
  },
];

export function StudentLife() {
  const container = useRef(null);
  useGSAP(
    () => {
      gsap.from(".life-title", {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        opacity: 0,
        y: 40,
        duration: 1,
      });
      gsap.from(".life-card", {
        scrollTrigger: { trigger: container.current, start: "top 75%" },
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
      <h2 className="life-title text-3xl md:text-4xl font-bold text-center mb-12">
        Vibrant Student Life
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {activities.map((act) => (
          <div key={act.title} className="life-card group">
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-lg">
              <Image
                src={act.image}
                alt={act.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0" />
              <h3 className="absolute bottom-4 left-4 text-white text-xl font-semibold">
                {act.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
