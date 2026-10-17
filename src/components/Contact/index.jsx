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

// Short message form, delivered to Aashna's inbox through /api/contact (Resend)
const NOTES = {
    idle: 'Goes straight to my inbox. I reply within 24 hours.',
    sending: 'Sending…',
    sent: 'Thanks! Your message is on its way. I’ll get back to you soon.',
};

function ContactForm() {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        setStatus('sending');
        setError('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const body = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(body.error || 'The message couldn’t be sent.');
            form.reset();
            setStatus('sent');
        } catch (err) {
            setError(`${err.message} You can also email ${EMAIL}.`);
            setStatus('error');
        }
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
                    <input id="footer-name" name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Your name" />
                </label>
                <label className={styles.field}>
                    <span>Email</span>
                    <input id="footer-email" name="email" type="email" autoComplete="email" required maxLength={200} placeholder="you@company.com" />
                </label>
                <label className={`${styles.field} ${styles.fieldWide}`}>
                    <span>Message</span>
                    <textarea id="footer-message" name="message" rows={2} required maxLength={5000} placeholder="A line or two about what you're working on" />
                </label>
                {/* Honeypot for bots: hidden from people and screen readers */}
                <input className={styles.honeypot} name="company" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            </div>

            <div className={styles.formFoot}>
                <p className={`${styles.formNote} ${status === 'error' ? styles.formError : ''}`} aria-live="polite">
                    {status === 'error' ? error : NOTES[status]}
                </p>
                <button type="submit" className={styles.send} disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send message'} <FiArrowUpRight aria-hidden="true" />
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
