"use client";
import React, { FC } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const Footer: FC = () => {
  const linkVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.footer
      className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 w-full mt-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Main 4-column grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Contact Info */}
          <motion.div className="space-y-4" variants={linkVariants}>
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
              SMV High School
            </h5>
            <p className="flex items-start space-x-2">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-gray-500" />
              <span>123 Education Ave, Cityville, State 12345, India</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-5 h-5 flex-shrink-0 text-gray-500" />
              <a
                href="tel:+911234567890"
                className="hover:text-blue-600 transition-colors"
              >
                +91 12345 67890
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <Mail className="w-5 h-5 flex-shrink-0 text-gray-500" />
              <a
                href="mailto:info@smvhighschool.edu"
                className="hover:text-blue-600 transition-colors"
              >
                info@smvhighschool.edu
              </a>
            </p>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={linkVariants}>
            <h5 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Quick Links
            </h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Parent Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Student Portal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Academic Calendar
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Faculty Directory
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  News & Events
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: About SMV */}
          <motion.div variants={linkVariants}>
            <h5 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              About SMV
            </h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Our Mission & Vision
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Admissions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Our Campus
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Social Media */}
          <motion.div variants={linkVariants}>
            <h5 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Connect With Us
            </h5>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-500 hover:text-pink-500 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-500 hover:text-blue-700 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
