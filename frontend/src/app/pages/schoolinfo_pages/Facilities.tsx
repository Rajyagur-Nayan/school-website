"use client";

import { useRef, type ReactNode, type FC } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardTitle } from "@/components/ui/card";
import { MonitorPlay, Library, Beaker } from "lucide-react";

interface IFacility {
  title: string;
  desc: string;
  icon: ReactNode;
  image: string;
}

export const Facilities: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.utils.toArray(".facility-card").forEach((card, index) => {
        gsap.from(card as HTMLElement, {
          scrollTrigger: { trigger: card as HTMLElement, start: "top 80%" },
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50,
          duration: 1,
        });
      });
    },
    { scope: container }
  );

  const facilities: IFacility[] = [
    {
      title: "Computer Lab",
      desc: "Equipped with modern systems to enhance digital literacy.",
      icon: <MonitorPlay className="w-8 h-8 text-primary" />,
      image: "/images/smv5.jpg",
    },
    {
      title: "Library",
      desc: "A quiet space for students to read, research, and expand their minds.",
      icon: <Library className="w-8 h-8 text-primary" />,
      image: "/images/smv9.jpg",
    },
    {
      title: "Science Lab",
      desc: "Hands-on experiments in a state-of-the-art laboratory.",
      icon: <Beaker className="w-8 h-8 text-primary" />,
      image: "/images/smv school.jpg",
    },
  ];

  return (
    <section ref={container} className="py-20 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Modern Facilities
          </h2>
          <p className="text-lg text-muted-foreground">
            An environment built for effective learning and growth.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {facilities.map((facility) => (
            <Card
              key={facility.title}
              className="facility-card shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2"
            >
              <div className="relative h-64 md:h-auto w-full">
                <Image
                  src={facility.image}
                  alt={facility.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col justify-center p-6">
                {facility.icon}
                <CardTitle className="mt-4 mb-2">{facility.title}</CardTitle>
                <p className="text-muted-foreground">{facility.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
