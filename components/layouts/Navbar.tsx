"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="mx-20 mt-4 bg-white rounded-full px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Logo */}
      <Link
        href="/"
        className="font-serif text-[22px] font-normal tracking-wide text-[#0f0d0c] no-underline"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        <span className="text-[#e91e8c] italic">Aashna </span>Sharma
      </Link>

      {/* Links + CTA */}
      <div className="flex items-center gap-8">
        <ul className="flex gap-8 list-none m-0 p-0">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-[12px] tracking-[0.1em] uppercase no-underline transition-colors duration-200 ${
                  pathname === link.href
                    ? "text-[#0f0d0c] font-medium"
                    : "text-[#9a9490] hover:text-[#0f0d0c]"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact"
          className="bg-[#0f0d0c] text-white text-[12px] font-medium px-5 py-2.5 rounded-full tracking-wide hover:opacity-80 transition-opacity no-underline whitespace-nowrap"
        >
          Hire Me
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;