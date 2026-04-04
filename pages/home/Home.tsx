import React from "react";
import Image from "next/image";
import Link from "next/link";
import profile from "@/public/images/profile.jpg";

const stats = [
  { num: "2+", label: "Years Exp" },
  { num: "35%", label: "Bundle Reduced" },
  { num: "10+", label: "Projects" },
  { num: "50%", label: "Faster Deploy" },
];

const Home = () => {
  return (
    <section className="bg-[#fff8f9] flex flex-col">

      {/* Hero Card */}
      <div className="mx-6 mt-4 grid grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-[0_2px_24px_rgba(233,30,140,0.06)]">

        {/* Left */}
        <div className="flex flex-col justify-between px-12 py-12">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#fff0f6] border border-[#e91e8c]/20 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c]" />
              <span className="text-[10px] tracking-[0.14em] uppercase text-[#e91e8c]">
                Available for Hire
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[clamp(52px,5.5vw,84px)] font-light leading-[1.0] text-[#0f0d0c] mt-6"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Full Stack
              <br />
              <em className="italic text-[#e91e8c]">Developer.</em>
            </h1>

            {/* Skills */}
            <div className="flex items-center gap-3 mt-5">
              {["React.js", "Node.js", "TypeScript"].map((s, i, arr) => (
                <React.Fragment key={s}>
                  <span className="text-[10px] tracking-[0.12em] uppercase text-[#9a9490]">
                    {s}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-[#e0dbd8]" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Description */}
            <p className="text-[13.5px] leading-[1.75] text-[#5a5450] max-w-[360px] mt-5">
              Building fast, scalable web applications that solve real problems.
              2+ years leading frontend teams and shipping production-ready
              systems end-to-end.
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-8 border-t border-black/[0.06] mt-8">
            <div className="flex gap-3">
              <Link
                href="/contact"
                className="bg-[#e91e8c] text-white text-[12px] font-medium px-6 py-3 rounded-full tracking-wide hover:opacity-85 transition-opacity no-underline"
              >
                Hire Me
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-black/15 text-[#0f0d0c] text-[12px] px-6 py-3 rounded-full tracking-wide hover:border-black/40 transition-colors no-underline"
              >
                Resume ↓
              </a>
            </div>

            <div className="flex items-center gap-2 bg-[#f8f8f8] border border-black/[0.06] rounded-full px-4 py-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4caf6e]" />
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#9a9490]">
                Chandigarh, India
              </span>
            </div>
          </div>
        </div>

        {/* Right — Photo */}
        <div className="relative bg-gradient-to-br from-[#fff0f6] to-[#fce4ec] min-h-[500px]">
          <Image
            src={profile}
            alt="Aashna Sharma"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Overlay card */}
          <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm border border-[#e91e8c]/[0.08] rounded-2xl px-5 py-3.5 z-10">
            <p className="text-[14px] font-medium text-[#0f0d0c]">
              Aashna Sharma
            </p>
            <p className="text-[11px] text-[#9a9490] mt-0.5">
              Full Stack Developer · Chandigarh, India
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mx-6 grid grid-cols-4 overflow-hidden">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-6 py-5 bg-white border-t border-[#e91e8c]/08 ${
              i < stats.length - 1 ? "border-r border-r-[#e91e8c]/08" : ""
            } ${i === 0 ? "rounded-bl-3xl" : ""} ${
              i === stats.length - 1 ? "rounded-br-3xl" : ""
            }`}
          >
            <p
              className="text-[30px] font-light text-[#e91e8c]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {s.num}
            </p>
            <p className="text-[10px] tracking-[0.08em] uppercase text-[#9a9490] mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default Home;