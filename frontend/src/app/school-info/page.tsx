"use client";

// --- 1. IMPORTS ---
import { useRef, type ReactNode, type ReactElement, type FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MonitorPlay,
  ShieldCheck,
  Trophy,
  Users,
  Library,
  CalendarDays,
  Linkedin,
  Twitter,
  Quote,
  Eye,
  Beaker,
} from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// --- 2. HERO COMPONENT ---
// (This section was correct, no changes)
const Hero: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".hero-title", {
        opacity: 0,
        y: 50,
        scale: 1.1,
        filter: "blur(5px)",
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.from(".hero-buttons", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: "power3.out",
      });
    },
    { scope: container }
  );
  return (
    <section
      ref={container}
      className="relative grid grid-cols-1 grid-rows-1 items-center justify-center min-h-screen text-center text-white overflow-hidden"
    >
      <div className="col-start-1 row-start-1">
        <Image
          src="/images/smv8.jpg"
          alt="Sharda Mandir Vidhyalaya Campus"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>
      <div className="col-start-1 row-start-1 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />
      <div className="relative z-10 col-start-1 row-start-1 container mx-auto px-6 flex flex-col items-center gap-8">
        <h1 className="hero-title text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight drop-shadow-2xl">
          Sharda Mandir Vidhyalaya
        </h1>
        <p className="hero-subtitle text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl leading-relaxed">
          Empowering young minds with values, culture, and academic excellence —
          nurturing leaders for tomorrow.
        </p>
        <div className="hero-buttons flex flex-wrap justify-center gap-6">
          <Button size="lg" asChild>
            <Link href="#admissions">Admissions Open</Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="#welcome">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// --- 3. WELCOME/ABOUT SECTION ---
// (This section was correct, no changes)
const Welcome: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".welcome-content", {
        scrollTrigger: { trigger: container.current, start: "top 80%" },
        opacity: 0,
        x: -50,
        duration: 1,
        ease: "power3.out",
      });
      gsap.to(".welcome-image-inner", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: container }
  );
  return (
    <section id="welcome" ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="welcome-image relative w-full h-80 lg:h-[450px] rounded-xl overflow-hidden shadow-2xl">
          <div className="welcome-image-inner absolute inset-0 -top-[25%] h-[125%] w-full">
            <Image
              src="/images/smv4.jpg"
              alt="SMV Staff Community"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>
        <div className="welcome-content flex flex-col gap-4 items-start">
          <p className="font-semibold text-primary tracking-wide uppercase">
            About Our School
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">
            Welcome to Our Community
          </h2>
          <p className="text-lg text-muted-foreground">
            Sharda Mandir Vidhyalaya is more than just a school; it&apos;s a
            community of students, parents, and dedicated staff. We work
            together to create a supportive and engaging environment where
            everyone feels a sense of belonging.
          </p>
          <Button size="lg" asChild>
            <Link href="#">About Our Mission</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// --- 4. WHY CHOOSE US (FIXED) ---
interface IFeature {
  icon: ReactNode;
  title: string;
  desc: string;
}
const WhyChooseUs: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      // --- FIX: Changed from gsap.from() to gsap.to() ---
      gsap.to(".feature-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 1, // Animate TO opacity 1
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
              // --- FIX: Added opacity-0 and initial transform states ---
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

// --- 5. OUR PROGRAMS (FIXED) ---
interface IProgram {
  title: string;
  description: string;
  image: string;
}
const Programs: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      // --- FIX: Changed from gsap.from() to gsap.to() ---
      gsap.to(".program-card", {
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

  const programs: IProgram[] = [
    {
      title: "Core Academics",
      description: "Rigorous curriculum for Science, Maths, and Humanities.",
      image: "/images/smv school.jpg",
    },
    {
      title: "Cultural Arts",
      description: "Explore classical dance, music, and visual arts.",
      image: "/images/smv9.jpg",
    },
    {
      title: "Sports & Athletics",
      description: "Physical education and competitive team sports.",
      image: "/images/smv1.jpg",
    },
  ];

  return (
    <section ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h2>
          <p className="text-lg text-muted-foreground">
            A balanced approach to academic, artistic, and physical development.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program) => (
            <Card
              key={program.title}
              // --- FIX: Added opacity-0 and initial transform states ---
              className="program-card overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 opacity-0 translate-y-12 scale-95"
            >
              <CardHeader className="p-0">
                <div className="relative h-64 w-full">
                  <Image
                    src={program.image}
                    alt={program.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-2">{program.title}</CardTitle>
                <p className="text-muted-foreground">{program.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="#">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- 6. FACILITIES ---
// (This section was correct, no changes)
interface IFacility {
  title: string;
  desc: string;
  icon: ReactNode;
  image: string;
}
const Facilities: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.utils.toArray(".facility-card").forEach((card, index) => {
        gsap.from(card as HTMLElement, {
          scrollTrigger: { trigger: card as HTMLElement, start: "top 80%" },
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50, // Slide from left, then right
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

// --- 7. NEWS & EVENTS (FIXED) ---
interface IEvent {
  title: string;
  description: string;
  date: string;
  image: string;
}
const Events: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      // --- FIX: Changed from gsap.from() to gsap.to() ---
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
              // --- FIX: Added opacity-0 and initial transform states ---
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

// --- 8. STAFF SECTION (FIXED) ---
interface IStaffMember {
  name: string;
  role: string;
  qualification: string;
  initials: string;
}
const Staff: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      // --- FIX: Changed from gsap.from() to gsap.to() ---
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
              // --- FIX: Added opacity-0 and initial transform states ---
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

// --- 9. GALLERY ---
// (This section was correct, no changes)
const Gallery: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".gallery-item", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)",
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    },
    { scope: container }
  );
  const images = [
    {
      src: "/images/smv6.jpg",
      alt: "SMV Gallery Image 1",
      className: "md:col-span-2 md:row-span-2",
    },
    {
      src: "/images/smv 3.jpg",
      alt: "SMV Gallery Image 2",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      src: "/images/smv school.jpg",
      alt: "SMV Gallery Image 3",
      className: "md:col-span-1 md:row-span-1",
    },
    {
      src: "/images/smv1.jpg",
      alt: "SMV Gallery Image 4",
      className: "md:col-span-1 md:row-span-1",
    },
  ];
  return (
    <section ref={container} className="py-20 md:py-32 bg-muted">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            GlimpsES of SMV
          </h2>
          <p className="text-lg text-muted-foreground">
            A snapshot of our vibrant campus life and student activities.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 grid-flow-dense grid-auto-rows-[300px]">
          {images.map((img) => (
            <div
              key={img.src}
              className={`gallery-item ${img.className} relative min-h-[300px] rounded-lg overflow-hidden shadow-lg group bg-muted/60`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300">
                <Eye className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="#">View Full Gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// --- 10. TESTIMONIALS ---
// (This section was correct, no changes)
interface ITestimonial {
  quote: string;
  name: string;
  role: string;
}
const Testimonials: FC = () => {
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

// --- 11. ADMISSIONS CTA ---
// (This section was correct, no changes)
const AdmissionsCTA: FC = () => {
  const container = useRef<HTMLElement | null>(null);
  useGSAP(
    () => {
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.2,
      });
    },
    { scope: container }
  );
  return (
    <section
      id="admissions"
      ref={container}
      className="py-20 md:py-32 bg-primary text-primary-foreground"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <div className="container text-center flex flex-col items-center gap-6">
        <h2 className="cta-content text-3xl md:text-4xl font-bold">
          Join the SMV Family
        </h2>
        <p className="cta-content text-lg max-w-2xl text-primary-foreground/90">
          We are now accepting applications. Take the first step towards a
          bright and well-rounded future for your child.
        </p>
        <Button
          size="lg"
          variant="secondary"
          asChild
          className="cta-content text-lg"
        >
          <Link href="/apply-now">Apply for Admission</Link>
        </Button>
      </div>
    </section>
  );
};

// --- 12. MAIN PAGE COMPONENT ---
// (This section was correct, no changes)
export default function Home(): ReactElement {
  return (
    <main className="bg-background text-foreground">
      <Hero />
      <Welcome />
      <WhyChooseUs />
      <Programs />
      <Facilities />
      <Events />
      <Staff />
      <Gallery />
      <Testimonials />
      <AdmissionsCTA />
    </main>
  );
}
