"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const container = useRef(null);

  useGSAP(
    () => {
      // Animate elements as they scroll into view
      gsap.from(".about-content", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%", // Start animation when 80% from top
        },
        opacity: 0,
        x: -50,
        duration: 1,
        stagger: 0.3,
      });

      gsap.from(".about-image", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        x: 50,
        scale: 0.9,
        duration: 1,
      });
    },
    { scope: container }
  );

  return (
    <section
      id="about"
      ref={container}
      className="bg-muted py-20 md:py-32" // bg-muted works in light/dark
    >
      <div className="container grid lg:grid-cols-2 items-center gap-12">
        {/* --- IMAGE STYLE FIX --- */}
        <div className="about-image relative w-full max-w-md mx-auto lg:max-w-full h-[450px] lg:h-[550px] rounded-xl shadow-2xl overflow-hidden">
          <Image
            src="/images/smv9.jpg" // The Raksha Bandhan illustration
            alt="Students celebrating Raksha Bandhan at SMV School"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            className="rounded-xl"
          />
        </div>
        <div className="flex flex-col gap-6 items-start lg:order-first">
          <h2 className="about-content text-3xl md:text-4xl font-bold">
            Our Mission: Values & Vision
          </h2>
          <p className="about-content text-lg text-muted-foreground">
            At SMV, we are dedicated to fostering a learning environment where
            traditional values and modern education go hand-in-hand. We aim to
            develop well-rounded, compassionate, and patriotic citizens.
          </p>
          <ul className="about-content space-y-3">
            <li className="flex items-center gap-3">
              <CheckIcon />
              Holistic student development
            </li>
            <li className="flex items-center gap-3">
              <CheckIcon />
              Focus on cultural and national values
            </li>
            <li className="flex items-center gap-3">
              <CheckIcon />A dedicated and recognized faculty
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// Helper SVG component
function CheckIcon() {
  return (
    <svg
      className="w-6 h-6 text-primary flex-shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
