'use client';
import styles from './style.module.scss';
import { useRef, useState, useEffect } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import { FiArrowUp, FiArrowUpRight } from 'react-icons/fi';
import { SiLinkedin, SiGithub } from 'react-icons/si';
import Rounded from '../../common/RoundedButton';

const Star = () => (
    <svg className={styles.star} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 0C103.395 53.7596 146.24 96.6052 200 100C146.24 103.395 103.395 146.24 100 200C96.6052 146.24 53.7596 103.395 0 100C53.7596 96.6052 96.6052 53.7596 100 0Z" fill='#ecebe7'></path>
    </svg>
);

export default function Contact() {
    const container = useRef(null);
    const [myTime, setMyTime] = useState('');
    const [showTooltip, setShowTooltip] = useState(false);

    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 0.95, 1]);

    useEffect(() => {
        const updateTime = () => {
            const myTimeStr = new Date().toLocaleTimeString('en-US', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            setMyTime(myTimeStr);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const copyEmail = () => {
        const email = "aashnajuyal@gmail.com";

        // Use fallback method that works everywhere
        const textArea = document.createElement("textarea");
        textArea.value = email;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand("copy");
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
        }

        document.body.removeChild(textArea);
    };

    const marqueeContent = (
        <>
            <span className={styles.marqueeWord}>Software Engineer</span>
            <Star />
            <span className={styles.marqueeWord}>Software Engineer</span>
            <Star />
            <span className={styles.marqueeWord}>Software Engineer</span>
            <Star />
            <span className={styles.marqueeWord}>Software Engineer</span>
            <Star />
        </>
    );

    return (
        <div className={styles.contactWrapper} data-dark-bg="true">
            <motion.footer style={{ scale }} ref={container} className={styles.contact} data-dark-bg="true">

                {/* Main Content Grid */}
                <div className={styles.contentGrid}>

                    {/* Main Column */}
                    <div className={styles.mainColumn}>
                        <span className={styles.category}>OPPORTUNITIES</span>
                        <h2 className={styles.headline}>
                            Let&apos;s Build<br />
                            <span className={styles.accentText}>Something</span><br />
                            Together
                        </h2>
                        <p className={styles.bodyText}>
                            Open to full-time positions, contract work, and interesting projects.
                        </p>
                        <div className={styles.ctaSection}>
                            <Rounded backgroundColor="#707344ff" className={styles.contactBtn}>
                                <a href="mailto:aashnajuyal@gmail.com" className={styles.contactBtnInner}>
                                    Get in Touch <FiArrowUpRight />
                                </a>
                            </Rounded>
                            <Rounded backgroundColor="#85885c" className={styles.goTopBtn} onClick={scrollToTop}>
                                <p className={styles.goTopBtnInner}>
                                    <FiArrowUp />
                                </p>
                            </Rounded>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className={styles.verticalDivider}></div>

                    {/* Contact Info Column */}
                    <div className={styles.sideColumn}>
                        <div className={styles.infoBlock}>
                            <span className={styles.blockLabel}>DIRECT LINE</span>
                            <span className={styles.emailLink} onClick={copyEmail}>
                                aashnajuyal@gmail.com
                                {showTooltip && <span className={styles.tooltip}>Email copied!</span>}
                            </span>
                        </div>

                        <div className={styles.dividerLine}></div>

                        <div className={styles.infoBlock}>
                            <span className={styles.blockLabel}>SOCIAL CHANNELS</span>
                            <div className={styles.socialLinks}>
                                <a href="https://www.linkedin.com/in/aashnasharma1/" target="_blank" rel="noopener noreferrer">
                                    <SiLinkedin /> LinkedIn
                                </a>
                                <a href="https://github.com/aashnasharma1" target="_blank" rel="noopener noreferrer">
                                    <SiGithub /> GitHub
                                </a>
                            </div>
                        </div>

                        <div className={styles.dividerLine}></div>

                        <div className={styles.infoBlock}>
                            <span className={styles.blockLabel}>LOCAL TIME</span>
                            <span className={styles.timeDisplay}>{myTime}</span>
                            <span className={styles.timezone}>IST — India</span>
                        </div>

                        <div className={styles.dividerLine}></div>

                        <div className={styles.infoBlock}>
                            <span className={styles.blockLabel}>QUICK LINKS</span>
                            <div className={styles.quickLinks}>
                                <a href="#work" onClick={(e) => { e.preventDefault(); document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); }}>View Work</a>
                                <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>About Me</a>
                                <a href="/resume.pdf" target="_blank">Resume <svg
                                    stroke="currentColor"
                                    fill="none"
                                    strokeWidth="1.25"
                                    viewBox="6 6 12 12"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    color="#dbdbdbff"
                                    style={{ transform: "rotate(-90deg)" }}
                                    height="0.6em"
                                    width="0.6em"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <line x1="7" y1="7" x2="17" y2="17"></line>
                                    <polyline points="17 7 17 17 7 17"></polyline>
                                </svg></a>
                            </div>
                            <span className={styles.copyright}>© 2026 Aashna Sharma</span>
                        </div>
                    </div>
                </div>

                {/* Marquee */}
                <div className={styles.marqueeContainer}>
                    <div className={styles.marqueeTrack}>
                        {marqueeContent}
                        {marqueeContent}
                    </div>
                </div>

            </motion.footer>
        </div>
    );
}
