import React from "react";
import Link from "next/link";

const connectLinks = [
  { label: "Email", href: "mailto:hello@aashnasharma.co" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

const Footer = () => {
  return (
    <footer className="bg-[#1a1917] rounded-t-[20px] mx-16 mt-8 px-16 pt-14 pb-10 font-sans">
      {/* Top section */}
      <div className="grid grid-cols-[1fr_160px_160px] gap-12 pb-12 border-b border-white/[0.08] mb-9">
        {/* Headline + CTA */}
        <div>
          <h2 className="text-[#f0ede8] font-serif font-normal leading-[1.15] text-[clamp(36px,4vw,56px)] max-w-[420px] mb-8">
            Ready to bring your <br />
            <em>ideas to life?</em>
          </h2>
          <Link
            href="/contact"
            className="inline-block bg-[#f0ede8] text-[#1a1917] text-sm font-medium px-7 py-3.5 rounded-full tracking-wide hover:opacity-85 transition-opacity no-underline"
          >
            Get in Touch
          </Link>
        </div>

        {/* Work col */}
        <div>
          <h4 className="text-[#f0ede8] text-base font-medium mb-5 tracking-tight">
            Work
          </h4>
          <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
            <li>
              <Link
                href="/work"
                className="text-[#8a8880] text-sm font-light tracking-wide hover:text-[#f0ede8] transition-colors no-underline"
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                href="/work"
                className="text-[#8a8880] text-sm font-light tracking-wide hover:text-[#f0ede8] transition-colors no-underline"
              >
                Case Studies
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect col */}
        <div>
          <h4 className="text-[#f0ede8] text-base font-medium mb-5 tracking-tight">
            Connect
          </h4>
          <ul className="flex flex-col gap-3.5 list-none p-0 m-0">
            {connectLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8a8880] text-sm font-light tracking-wide hover:text-[#f0ede8] transition-colors no-underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom credits */}
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-[10px] text-white/30 tracking-[0.08em] uppercase m-0">
          Design & Development by Aashna Sharma
        </p>
      </div>
    </footer>
  );
};

export default Footer;
