'use client';
import { motion } from 'framer-motion';
import styles from './style.module.scss';

export default function ExperienceBadge() {
    return (
        <div className={styles.badgeContainer}>
            <motion.div
                className={styles.spinner}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
                {/* Wavy Seal SVG Background */}
                <svg
                    viewBox="0 0 200 200"
                    className={styles.bgSvg}
                    fill="currentColor"
                >
                    {/* A 12-point wavy seal path */}
                    <path d="M100,0 C110,0 118,10 125,12 C135,15 145,10 152,15 C160,20 162,30 168,36 C175,42 185,45 188,54 C192,62 188,72 190,80 C192,88 200,95 200,100 C200,105 192,112 190,120 C188,128 192,138 188,146 C185,155 175,158 168,164 C162,170 160,180 152,185 C145,190 135,185 125,188 C118,190 110,200 100,200 C90,200 82,190 75,188 C65,185 55,190 48,185 C40,180 38,170 32,164 C25,158 15,155 12,146 C8,138 12,128 10,120 C8,112 0,105 0,100 C0,95 8,88 10,80 C12,72 8,62 12,54 C15,45 25,42 32,36 C38,30 40,20 48,15 C55,10 65,15 75,12 C82,10 90,0 100,0 Z" />
                </svg>

                {/* Text - Counter-rotated to stay upright */}
                <motion.div
                    className={styles.textContainer}
                    animate={{ rotate: [0, -360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                    <span className={styles.textMain}>Current</span>
                    <span className={styles.textSub}>Company</span>
                </motion.div>
            </motion.div>
        </div>
    );
}
