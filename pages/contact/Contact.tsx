"use client";
import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const fields = [
    {
      num: "01",
      key: "name",
      label: "What's your name?",
      placeholder: "Jane Smith",
      required: true,
    },
    {
      num: "02",
      key: "email",
      label: "What's your email?",
      placeholder: "jane@company.com",
      required: true,
    },
    {
      num: "03",
      key: "company",
      label: "What's your company?",
      placeholder: "Google, Accenture...",
      required: false,
    },
    {
      num: "04",
      key: "role",
      label: "What role are you hiring for?",
      placeholder: "Full Stack Developer, Frontend Engineer...",
      required: false,
    },
    {
      num: "05",
      key: "message",
      label: "Your message",
      placeholder: "Hello Aashna, I'd love to connect about...",
      required: true,
    },
  ];

  const completed = fields.filter(
    (f) => form[f.key as keyof typeof form],
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Opportunity for Aashna — ${form.role || "Full Stack Developer"}`,
    );
    const body = encodeURIComponent(
      `Hi Aashna,\n\nName: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nRole: ${form.role}\n\nMessage:\n${form.message}`,
    );
    window.open(`mailto:aashnajuyal@gmail.com?subject=${subject}&body=${body}`);
    setSubmitted(true);
  };

  return (
    <section className="bg-[#fff8f9] min-h-screen">
      {/* Hero */}
      <div className="px-12 pt-16 pb-12">
        <p className="text-[11px] tracking-[0.14em] uppercase text-[#9a9490] mb-6">
          ( Get in Touch )
        </p>

        <div className="grid grid-cols-2 items-start gap-12">
          <div>
            <h1
              className="text-[clamp(52px,6vw,88px)] font-light leading-[1.05] text-[#0f0d0c]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Let's have a
              <br />
              <em className="italic text-[#e91e8c]">Conversation.</em>
            </h1>
            <p className="text-[15px] leading-[1.8] text-[#5a5450] mt-6 max-w-[400px]">
              Got a role in mind? I'm actively looking for full stack
              opportunities and always happy to have a conversation. Reach out —
              I respond within 24 hours.
            </p>
          </div>

          {/* Right side info */}
          <div className="flex flex-col gap-6 pt-4">
            <div className="inline-flex items-center gap-2 bg-[#fff0f6] border border-[#e91e8c]/20 rounded-full px-4 py-2 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c] animate-pulse" />
              <span className="text-[11px] tracking-[0.1em] uppercase text-[#e91e8c]">
                Actively Looking for a New Role
              </span>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e91e8c]/08 flex flex-col gap-5">
              <div>
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#9a9490] mb-2">
                  Contact Details
                </p>
                <a
                  href="mailto:aashnajuyal@gmail.com"
                  className="text-[14px] text-[#0f0d0c] hover:text-[#e91e8c] transition-colors no-underline"
                >
                  aashnajuyal@gmail.com
                </a>
              </div>
              <div className="border-t border-[#e91e8c]/08 pt-4">
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#9a9490] mb-2">
                  Location
                </p>
                <p className="text-[14px] text-[#0f0d0c]">Chandigarh, India</p>
                <p className="text-[12px] text-[#e91e8c] mt-0.5">
                  Open to remote & relocation
                </p>
              </div>
              <div className="border-t border-[#e91e8c]/08 pt-4">
                <p className="text-[10px] tracking-[0.12em] uppercase text-[#9a9490] mb-3">
                  Socials
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://linkedin.com/in/aashnasharma1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-[#0f0d0c] hover:text-[#e91e8c] transition-colors no-underline flex items-center gap-2"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href="https://github.com/aashnasharma1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-[#0f0d0c] hover:text-[#e91e8c] transition-colors no-underline flex items-center gap-2"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-12 pb-20">
        {/* Progress bar */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-[#e91e8c]/10 relative">
            <div
              className="absolute top-0 left-0 h-full bg-[#e91e8c] transition-all duration-500"
              style={{ width: `${(completed / fields.length) * 100}%` }}
            />
          </div>
          <span className="text-[11px] tracking-[0.1em] text-[#9a9490] uppercase whitespace-nowrap">
            {completed}/{fields.length} completed
          </span>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-[#fff0f6] border border-[#e91e8c]/20 flex items-center justify-center text-2xl">
              ✉️
            </div>
            <h3
              className="text-[32px] font-light text-[#0f0d0c]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Message sent!
            </h3>
            <p className="text-[14px] text-[#5a5450]">
              I'll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-[760px]">
            {fields.map((field, i) => (
              <div
                key={field.key}
                className="border-t border-[#e91e8c]/08 py-8"
              >
                <div className="flex items-start gap-6">
                  <span
                    className="text-[13px] font-light text-[#e91e8c] mt-1 w-6 shrink-0"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {field.num}
                  </span>
                  <div className="flex-1">
                    <label className="text-[18px] font-medium text-[#0f0d0c] flex items-center gap-2">
                      {field.label}
                      {field.required && (
                        <span className="text-[#e91e8c] text-sm">*</span>
                      )}
                    </label>
                    {field.key === "message" ? (
                      <textarea
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        required={field.required}
                        rows={3}
                        className="w-full mt-3 bg-transparent border-none outline-none text-[15px] text-[#5a5450] placeholder:text-[#c0bab8] resize-none focus:text-[#0f0d0c] transition-colors"
                      />
                    ) : (
                      <input
                        type={field.key === "email" ? "email" : "text"}
                        placeholder={field.placeholder}
                        value={form[field.key as keyof typeof form]}
                        onChange={(e) =>
                          setForm({ ...form, [field.key]: e.target.value })
                        }
                        required={field.required}
                        className="w-full mt-3 bg-transparent border-none outline-none text-[15px] text-[#5a5450] placeholder:text-[#c0bab8] focus:text-[#0f0d0c] transition-colors"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Submit */}
            <div className="border-t border-[#e91e8c]/08 pt-12 flex justify-center">
              <button
                type="submit"
                className="w-28 h-28 rounded-full bg-[#e91e8c] text-white text-[14px] font-medium hover:opacity-85 transition-all hover:scale-105 cursor-pointer flex items-center justify-center"
              >
                Send It ↗
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default Contact;
