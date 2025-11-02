"use client";

import { useRef, type FC } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface IEvent {
  title: string;
  description: string;
  date: string;
  image: string;
}

export const Events: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.to(".event-card", {
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

  const events: IEvent[] = [
    {
      title: "Annual Sports Day",
      description:
        "Join us for a day of thrilling athletic competition and teamwork.",
      date: "DEC 22, 2025",
      image: "/images/smv1.jpg",
    },
    {
      title: "Science Fair 2025",
      description:
        "Discover the innovative projects from our bright young scientists.",
      date: "NOV 15, 2025",
      image: "/images/smv5.jpg",
    },
    {
      title: "Cultural Fest 'Utsav'",
      description:
        "A celebration of dance, music, and art by our talented students.",
      date: "OCT 30, 2025",
      image: "/images/smv3.jpg",
    },
  ];

  return (
    <section ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">News & Events</h2>
          <p className="text-lg text-muted-foreground">
            Stay updated with the latest happenings at Sharda Mandir Vidhyalaya.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card
              key={event.title}
              className="event-card overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 opacity-0 translate-y-12 scale-95"
            >
              <CardHeader className="p-0 relative">
                <Badge className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  <span>{event.date}</span>
                </Badge>
                <div className="relative h-64 w-full">
                  <Image
                    src={event.image}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{event.title}</CardTitle>
                <p className="text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
