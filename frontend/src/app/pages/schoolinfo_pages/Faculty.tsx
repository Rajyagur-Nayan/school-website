"use client";

import { useRef, type FC } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Linkedin, Twitter } from "lucide-react";

interface IStaffMember {
  name: string;
  role: string;
  qualification: string;
  initials: string;
}

export const Staff: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.to(".staff-card", {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
      });
    },
    { scope: container }
  );

  const staffMembers: IStaffMember[] = [
    {
      name: "Mr. R. Sharma",
      role: "Principal",
      qualification: "M.Sc, M.Ed",
      initials: "RS",
    },
    {
      name: "Mrs. S. Patel",
      role: "Vice-Principal",
      qualification: "M.A, B.Ed",
      initials: "SP",
    },
    {
      name: "Mr. A. Khan",
      role: "Head, Science Dept.",
      qualification: "M.Sc (Physics)",
      initials: "AK",
    },
    {
      name: "Ms. P. Desai",
      role: "Head, Arts & Culture",
      qualification: "M.A (Fine Arts)",
      initials: "PD",
    },
  ];

  return (
    <section ref={container} className="py-20 md:py-32">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Highly Qualified Staff
          </h2>
          <p className="text-lg text-muted-foreground">
            Our teachers are the heart of SMV, bringing passion and expertise.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {staffMembers.map((staff) => (
            <Card
              key={staff.name}
              className="staff-card text-center shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/20 opacity-0 translate-y-12 scale-90"
            >
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarFallback className="text-3xl">
                    {staff.initials}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">{staff.name}</CardTitle>
                <p className="text-primary font-medium">{staff.role}</p>
                <p className="text-muted-foreground text-sm mt-2">
                  {staff.qualification}
                </p>
                <div className="flex gap-4 mt-4">
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
