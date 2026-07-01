import styles from './style.module.scss';
import { useState } from 'react';

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const email = "aashnajuyal@gmail.com";

  const handleCopyEmail = () => {
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className={styles.footer}>
        <div className={styles.emailSection}>
          <span className={styles.emailText}>{email}</span>
          <button 
            className={styles.copyBtn} 
            onClick={handleCopyEmail}
            title="Copy email"
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2"/>
              </svg>
            )}
          </button>
          {copied && <span className={styles.copiedTooltip}>Copied!</span>}
        </div>
        <div className={styles.socials}>
          <a href="https://www.linkedin.com/in/aashnasharma1/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://github.com/aashnasharma1" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
    </div>
  )
}
