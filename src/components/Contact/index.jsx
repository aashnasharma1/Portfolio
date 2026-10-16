'use client';
import styles from './style.module.scss';
import { useState } from 'react';
import { FiArrowUpRight, FiArrowUp } from 'react-icons/fi';

const EMAIL = 'aashnajuyal@gmail.com';

const SITEMAP = [
    { label: 'Home', target: 'top' },
    { label: 'About', target: 'about' },
    { label: 'Stack', target: 'stack' },
    { label: 'Experience', target: 'experience' },
    { label: 'Work', target: 'work' },
    { label: 'Achievements', target: 'achievements' },
];

const ELSEWHERE = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aashnasharma1/' },
    { label: 'GitHub', href: 'https://github.com/aashnasharma1' },
    { label: 'Resume', href: '/resume.pdf' },
];

const scrollTo = (target) => {
    if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
};

// Short message form. There is no backend, so sending opens the visitor's
// mail app with the message filled in, addressed to Aashna.
function ContactForm() {
    const [sent, setSent] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const name = data.get('name').trim();
        const from = data.get('email').trim();
        const message = data.get('message').trim();
        const subject = `Portfolio enquiry from ${name}`;
        const body = `${message}\n\n— ${name} (${from})`;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
    };

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.formHead}>
                <span className={styles.label}>Start a conversation</span>
                <p className={styles.formTitle}>Have a project or a role in mind?</p>
            </div>

            <div className={styles.fields}>
                <label className={styles.field}>
                    <span>Name</span>
                    <input id="footer-name" name="name" type="text" autoComplete="name" required placeholder="Your name" />
                </label>
                <label className={styles.field}>
                    <span>Email</span>
                    <input id="footer-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
                </label>
                <label className={`${styles.field} ${styles.fieldWide}`}>
                    <span>Message</span>
                    <textarea id="footer-message" name="message" rows={2} required placeholder="A line or two about what you're working on" />
                </label>
            </div>

            <div className={styles.formFoot}>
                <p className={styles.formNote} aria-live="polite">
                    {sent ? 'Your mail app should open with the message ready to send.' : 'Opens in your mail app, ready to send.'}
                </p>
                <button type="submit" className={styles.send}>
                    Send message <FiArrowUpRight aria-hidden="true" />
                </button>
            </div>
        </form>
    );
}

export default function Contact() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.cta}>
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.primary}>
                        View resume <FiArrowUpRight aria-hidden="true" />
                    </a>
                </div>

                <ContactForm />

                <div className={styles.columns}>
                    <div className={styles.col}>
                        <span className={styles.label}>Contact</span>
                        <a href={`mailto:${EMAIL}`} className={styles.email}>{EMAIL}</a>
                        <p>Let&apos;s get in touch!</p>
                        <p>Response within 24 hours</p>
                    </div>

                    <div className={styles.col}>
                        <span className={styles.label}>Sitemap</span>
                        {SITEMAP.map((item) => (
                            <a
                                key={item.label}
                                href={item.target === 'top' ? '#' : `#${item.target}`}
                                onClick={(e) => { e.preventDefault(); scrollTo(item.target); }}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className={styles.col}>
                        <span className={styles.label}>Elsewhere</span>
                        {ELSEWHERE.map((item) => (
                            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                                {item.label} <FiArrowUpRight aria-hidden="true" />
                            </a>
                        ))}
                    </div>

                    <div className={styles.col}>
                        <span className={styles.label}>Based in</span>
                        <p>Noida · IST India</p>
                        <p>Full-stack · MERN · AI</p>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <span>© 2026 Aashna Sharma — All rights reserved</span>
                    <button type="button" className={styles.toTop} onClick={() => scrollTo('top')}>
                        Back to top <FiArrowUp aria-hidden="true" />
                    </button>
                </div>
            </div>

            <span className={`${styles.corner} ${styles.cornerLeft}`} aria-hidden="true" />
            <span className={`${styles.corner} ${styles.cornerRight}`} aria-hidden="true" />
        </footer>
    );
}
