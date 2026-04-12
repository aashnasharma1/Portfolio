import React from "react";
import Link from "next/link";

const services = [
  {
    num: "01",
    title: "Frontend Development",
    desc: "Building modern, responsive UIs with React.js, Next.js, and Vue.js. Focused on performance, global state management with Redux, and pixel-perfect interfaces. Configured Webpack with code splitting, reducing bundle size by 35%.",
    skills: [
      "React.js / Vue.js",
      "Redux State Management",
      "Webpack & Code Splitting",
    ],
  },
  {
    num: "02",
    title: "Backend Development",
    desc: "Building robust server-side solutions with Node.js and Express.js. Designing scalable REST APIs with JWT authentication, improving response times by 30% through backend migration and optimization.",
    skills: ["RESTful APIs", "MongoDB / MySQL", "JWT Authentication"],
  },
  {
    num: "03",
    title: "DevOps & Deployment",
    desc: "Setting up CI/CD pipelines with GitHub Actions, containerizing applications with Docker, and deploying production-ready systems. Reduced deployment times by 50% through pipeline automation.",
    skills: ["CI/CD Pipelines", "Docker", "GitHub Actions"],
  },
  {
    num: "04",
    title: "Team Leadership",
    desc: "Led a team of 5 developers, conducting code reviews and mentoring juniors. Improved delivery speed by 30%, reduced development effort by 25% through reusable component architecture, and improved onboarding efficiency.",
    skills: ["Code Reviews", "Mentoring", "Sprint Planning"],
  },
  {
    num: "05",
    title: "Blockchain Integration",
    desc: "Building secure APIs and transaction workflows for blockchain-integrated MERN applications. Experienced in connecting backend systems with blockchain layers and implementing transaction validation.",
    skills: ["Web3 Basics", "Secure APIs", "Transaction Workflows"],
  },
  {
    num: "06",
    title: "SEO & Web Performance",
    desc: "Hands-on experience with technical SEO optimization, backlink management, and web performance tuning. Improved application load times by 22% through targeted performance enhancements.",
    skills: ["SEO Optimization", "Backlinking", "Load Time Optimization"],
  },
];

const techStack = {
  Frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Redux Toolkit",
    "Tailwind CSS",
    "SCSS",
  ],
  Backend: ["Node.js", "Express.js", "MongoDB", "MySQL", "REST APIs", "JWT"],
  Tools: ["Git", "Docker", "GitHub Actions", "CI/CD", "Webpack", "Postman"],
};

const About = () => {
  return (
    <section className="bg-[#fff8f9]">
      {/* Hello Section */}
      <div className="px-12 py-20 border-b border-[#e91e8c]/08">
        <p className="text-[11px] tracking-[0.14em] uppercase text-[#9a9490] mb-6">
          ( About Me )
        </p>
        <h2
          className="text-[clamp(48px,6vw,80px)] font-light leading-[1.05] text-[#0f0d0c] max-w-3xl"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Hello /
        </h2>

        <div className="grid grid-cols-2 gap-24 mt-12">
          <div>
            <p className="text-[18px] leading-[1.8] text-[#0f0d0c]">
              I'm{" "}
              <span
                className="italic text-[#e91e8c]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Aashna Sharma.
              </span>{" "}
              A Full Stack Developer with 2+ years of experience in both{" "}
              <span
                className="italic text-[#e91e8c]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Frontend
              </span>{" "}
              and{" "}
              <span
                className="italic text-[#e91e8c]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Backend
              </span>{" "}
              development. I build digital experiences that bridge technology
              with real business impact.
            </p>
            <p className="text-[15px] leading-[1.8] text-[#5a5450] mt-6 max-w-[480px]">
              Currently at AllHeart Web, leading a team of 5 developers, owning
              end-to-end feature delivery, and contributing to
              blockchain-integrated MERN applications. B.E. Computer Science
              graduate from Chitkara University with a CGPA of 9.56, and a 2×
              hackathon winner.
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Current Role", value: "Full Stack Developer" },
                { label: "Location", value: "Chandigarh, India" },
                { label: "Experience", value: "2+ Years" },
                { label: "Education", value: "B.E in Computer Science" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white rounded-2xl px-5 py-4 border border-[#e91e8c]/08"
                >
                  <p className="text-[10px] tracking-[0.1em] uppercase text-[#9a9490]">
                    {item.label}
                  </p>
                  <p className="text-[14px] font-medium text-[#0f0d0c] mt-1">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-[#e91e8c] text-white text-[12px] font-medium px-6 py-3 rounded-full tracking-wide hover:opacity-85 transition-opacity no-underline w-fit"
            >
              Let's Connect ↗
            </Link>
          </div>
        </div>
      </div>

      {/* What I Do */}
      <div className="px-12 py-20">
        <div className="flex items-start justify-between mb-16">
          <div>
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#9a9490] mb-4">
              ( Services )
            </p>
            <h2
              className="text-[clamp(40px,5vw,64px)] font-light leading-[1.05] text-[#0f0d0c]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              What I Do /
            </h2>
          </div>
          <p className="text-[14px] text-[#5a5450] max-w-[380px] mt-4 leading-relaxed">
            I work across the full stack — from pixel-perfect UIs to scalable
            backend systems — to deliver complete digital products.
          </p>
        </div>

        {/* Services list */}
        <div className="flex flex-col gap-0">
          {services.map((s, i) => (
            <div
              key={s.num}
              className="grid grid-cols-[80px_1fr_1fr] gap-12 py-10 border-t border-[#e91e8c]/08 group"
            >
              <span
                className="text-[16px] font-light text-[#e91e8c] mt-1"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ({s.num})
              </span>
              <div>
                <h3 className="text-[22px] font-medium tracking-tight text-[#0f0d0c] uppercase">
                  {s.title}
                </h3>
                <p className="text-[14px] leading-[1.75] text-[#5a5450] mt-3 max-w-[400px]">
                  {s.desc}
                </p>
              </div>
              <div className="flex flex-col gap-0">
                {s.skills.map((skill, j) => (
                  <div
                    key={skill}
                    className={`py-3 text-[14px] text-[#0f0d0c] flex items-center gap-3 ${
                      j < s.skills.length - 1
                        ? "border-b border-[#e91e8c]/08"
                        : ""
                    }`}
                  >
                    <span className="text-[10px] text-[#e91e8c]">0{j + 1}</span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="px-12 py-20 border-t border-[#e91e8c]/08 bg-white">
        <p className="text-[11px] tracking-[0.14em] uppercase text-[#9a9490] mb-4">
          ( Skills )
        </p>
        <h2
          className="text-[clamp(40px,5vw,64px)] font-light leading-[1.05] text-[#0f0d0c] mb-16"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Tech Stack /
        </h2>

        <div className="flex flex-col gap-12">
          {Object.entries(techStack).map(([category, items]) => (
            <div key={category}>
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#9a9490] mb-6 pb-4 border-b border-[#e91e8c]/08">
                {category}
              </p>
              <div className="flex flex-wrap gap-3">
                {items.map((item) => (
                  <span
                    key={item}
                    className="bg-[#fff0f6] border border-[#e91e8c]/15 text-[#0f0d0c] text-[13px] px-4 py-2 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
