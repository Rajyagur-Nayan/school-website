"use client";

// --- React and Next.js Imports ---
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

// --- Animation (GSAP) Imports ---
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// --- Icon Imports ---
import {
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

// --- shadcn/ui Component Imports ---
// (Make sure you have run `npx shadcn-ui@latest add button` and `add card`)
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// --- Register GSAP Plugins ---
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// (All paths now consistently in /images/)
const heroBg = "/images/smv8.jpg"; // The beautiful illustration
const principalImg = "/images/smv2.jpg"; // Group photo with flag
const galleryImages = [
  { src: "/images/smv1.jpg", alt: "Student receiving award on Sports Day" },
  { src: "/images/smv3.jpg", alt: "Students in classical dance attire" },
  { src: "/images/smv4.jpg", alt: "School staff receiving memento" },
  { src: "/images/smv5.jpg", alt: "Student receiving prize from guest" },
  {
    src: "/images/smv9.jpg", // Using your provided smv9.jpg
    alt: "Girl receiving award at school event",
  },
  {
    src: "/images/smv7.jpg",
    alt: "Amrutba Highschool building with Indian flag",
  },
];

/**
 * Loader Component
 */
const Loader = () => (
  <div className="loader-bg fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-white dark:bg-gray-950">
    <h1
      className="loader-text text-4xl sm:text-5xl font-bold tracking-widest text-gray-900 dark:text-gray-100"
      aria-label="SMV"
    >
      {["S", "M", "V"].map((char, index) => (
        <span
          key={index}
          className="loader-text-char inline-block translate-y-10 opacity-0"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {char}
        </span>
      ))}
    </h1>
  </div>
);

/**
 * ThemeToggle Component
 */

/**
 * Main About Page Component
 */
export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  // --- Animation Refs ---
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const galleryRef = useRef(null);
  const principalSectionRef = useRef(null);
  const principalImageRef = useRef(null);
  const principalTextRef = useRef(null);
  const principalMessageTextRef = useRef(null);

  const principalMessage =
    "Welcome to SMV School! Our vision is to create a safe, nurturing, and challenging environment where every student can achieve their full potential. We are committed to fostering academic excellence, creativity, and a lifelong love for learning. Our dedicated staff works tirelessly to support each child's unique journey. We believe in building strong character and responsible citizens for the future.";

  // --- Loader Animation Effect ---
  useEffect(() => {
    const loaderTl = gsap.timeline({
      onComplete: () => {
        // No timeout needed, just set loading to false
        setIsLoading(false);
      },
    });

    loaderTl
      .to(".loader-text-char", {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power3.out",
        duration: 0.6,
      })
      .to(".loader-text", {
        opacity: 0,
        y: -20,
        delay: 1.2,
        ease: "power2.in",
      })
      .to(".loader-bg", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "power3.inOut",
        duration: 1,
      });
  }, []);

  // --- Main Content Animations Effect ---
  useEffect(() => {
    if (!isLoading && mainRef.current) {
      const ctx = gsap.context(() => {
        // --- 0. Fade in Main Container (THE FIX) ---
        // This ensures the page doesn't "pop" in before animations
        gsap.to(mainRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: "power3.inOut",
        });

        // --- 1. Hero Animation (Fade-in & Parallax) ---
        gsap.from(".hero-text", {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
          delay: 0.5, // Delay to let main container fade in
        });

        gsap.from(heroImageRef.current, {
          scale: 1.1,
          opacity: 0,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.2, // Start this slightly earlier
        });

        gsap.to(heroImageRef.current, {
          yPercent: 25,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // --- 2. Mission/Vision Cards (Slide-in) ---
        gsap.from([missionRef.current, visionRef.current], {
          opacity: 0,
          y: 100,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        // --- 3. Gallery (Fade-in & Scale-up) ---
        gsap.from(".gallery-item", {
          opacity: 0,
          scale: 0.8,
          y: 50,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 85%",
          },
        });

        // --- 4. Principal's Message (Slide-in & Typewriter) ---
        gsap.from(principalImageRef.current, {
          opacity: 0,
          x: -100,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: principalSectionRef.current,
            start: "top 80%",
          },
        });

        gsap.from(principalTextRef.current, {
          opacity: 0,
          x: 100,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: principalSectionRef.current,
            start: "top 80%",
          },
        });

        gsap.to(principalMessageTextRef.current, {
          text: principalMessage,
          duration: 5,
          ease: "none",
          scrollTrigger: {
            trigger: principalSectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      }, mainRef);

      return () => ctx.revert();
    }
  }, [isLoading, principalMessage]);

  return (
    <>
      {isLoading && <Loader />}

      {/* Main Content Area */}
      <div
        ref={mainRef}
        // MODIFIED: No more opacity transition class, GSAP handles it
        className={`relative bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 ${
          isLoading ? "opacity-0" : "" // Stays opacity-0 until GSAP fades it in
        }`}
      >
        {/* === 1. Hero Section === */}
        <header
          ref={heroRef}
          className="relative h-screen w-full overflow-hidden"
        >
          <div ref={heroImageRef} className="absolute inset-0">
            <Image
              src={heroBg}
              alt="SMV School Illustration"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
          </div>

          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
            <h1
              className="hero-text text-5xl md:text-7xl font-extrabold tracking-tight"
              style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
            >
              Welcome to SMV School
            </h1>
            <p
              className="hero-text mt-4 text-xl md:text-2xl"
              style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}
            >
              Nurturing Minds, Building Futures.
            </p>
            <Button
              size="lg"
              className="hero-text mt-8 rounded-full text-lg shadow-lg bg-white text-gray-900 hover:bg-gray-200 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              Admissions Open
            </Button>
          </div>
        </header>

        {/* === 2. Mission & Vision Section === */}
        <section className="py-20 lg:py-24 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Mission Card */}
              <Card
                ref={missionRef}
                className="shadow-xl dark:bg-gray-800 border-t-4 border-blue-500"
              >
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    To provide a holistic education that fosters intellectual
                    curiosity, critical thinking, and a compassionate spirit,
                    empowering students to become responsible global citizens.
                  </p>
                </CardContent>
              </Card>

              {/* Vision Card */}
              <Card
                ref={visionRef}
                className="shadow-xl dark:bg-gray-800 border-t-4 border-green-500"
              >
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    To be a leading educational institution recognized for its
                    academic excellence, innovative learning environment, and
                    commitment to the all-around development of every child.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* === 3. Gallery Section === */}
        <section
          ref={galleryRef}
          className="bg-gray-100 dark:bg-gray-950 py-20 lg:py-24"
        >
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-4xl font-bold">
              Campus Life & Activities
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="gallery-item group relative h-72 overflow-hidden rounded-lg shadow-lg"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <p className="absolute bottom-4 left-4 text-white text-lg font-semibold opacity-0 transition-all duration-500 group-hover:opacity-100">
                    {img.alt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === 4. Principal's Message Section === */}
        <section
          ref={principalSectionRef}
          className="py-20 lg:py-24 bg-white dark:bg-gray-900 overflow-x-hidden"
        >
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="mb-12 text-center text-4xl font-bold">
              A Word From Our Principal
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-12 items-center">
              {/* Principal Image */}
              <div
                ref={principalImageRef}
                className="md:col-span-4 lg:col-span-5"
              >
                <div className="relative h-80 w-full md:h-96 overflow-hidden rounded-lg shadow-2xl">
                  <Image
                    src={principalImg}
                    alt="Principal of SMV School"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="right 30%"
                  />
                </div>
              </div>

              {/* Principal Text */}
              <div
                ref={principalTextRef}
                className="md:col-span-8 lg:col-span-7"
              >
                <Card className="shadow-xl dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-3xl">
                      [Principal&apos;s Name]
                    </CardTitle>
                    <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                      Principal, SMV School
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p
                      ref={principalMessageTextRef}
                      className="h-48 text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* === 5. Footer (ADDED) === */}
        <footer className="bg-gray-100 dark:bg-gray-950 text-gray-700 dark:text-gray-300 py-12">
          <div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1: School Info */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                SMV School
              </h3>
              <p>Nurturing Minds, Building Futures.</p>
              <p className="mt-2 text-sm">
                © {new Date().getFullYear()} SMV School. All rights reserved.
              </p>
            </div>

            {/* Column 2: Contact Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 transition-colors hover:text-blue-500">
                  <MapPin className="h-5 w-5 flex-shrink-0" />
                  <span>123 School Lane, Dwarka, Gujarat</span>
                </li>
                <li className="flex items-center gap-2 transition-colors hover:text-blue-500">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span>+91 12345 67890</span>
                </li>
                <li className="flex items-center gap-2 transition-colors hover:text-blue-500">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span>info@smvschool.com</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Social Media */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full transition-all hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full transition-all hover:bg-blue-400 hover:text-white dark:hover:bg-blue-400"
                >
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full transition-all hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
