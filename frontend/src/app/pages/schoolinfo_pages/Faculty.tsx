"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function Faculty() {
  const container = useRef(null);
  useGSAP(
    () => {
      gsap.from(container.current, {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        duration: 1.5,
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="bg-muted py-20 md:py-32">
      <div className="container grid lg:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-6 items-start">
          <h2 className="text-3xl md:text-4xl font-bold">
            Our Dedicated Faculty
          </h2>
          <p className="text-lg text-muted-foreground">
            Meet the team of experienced educators who are the heart of SMV. Our
            teachers are mentors dedicated to nurturing each student&apos;s
            potential and fostering a love for learning.
          </p>
          <p className="text-lg text-muted-foreground">
            We believe in a strong partnership between teachers, students, and
            parents to create a supportive and patriotic school community.
          </p>
        </div>
        <div className="relative w-full h-80 lg:h-96 rounded-xl shadow-2xl overflow-hidden">
          <Image
            src="/images/smv2.jpg" // Staff with Indian Flag
            alt="Faculty of SMV High School"
            layout="fill"
            objectFit="cover"
            className="rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
