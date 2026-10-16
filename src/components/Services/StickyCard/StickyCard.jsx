'use client'
import { useEffect, useRef } from 'react';
import AnimatedShape from './AnimatedShape';
import usePointerGlow from '../../../common/usePointerGlow';
import {
    SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiNodedotjs, SiExpress,
    SiMongodb, SiMysql, SiRedis, SiElasticsearch, SiRedux, SiTailwindcss,
    SiSass, SiWebpack, SiGit, SiNpm, SiVitest, SiClaude, SiGithubcopilot,
    SiDocker, SiPostgresql, SiGithubactions, SiPrisma, SiPostman, SiDotnet,
    SiFramer, SiGreensock, SiThreedotjs, SiLighthouse, SiVercel,
    SiGooglesearchconsole
} from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';
import './StickyCards.css'

// Docked shape fills at most this share of the strip left visible above the next card
const DOCK_FILL = 0.7;

// Icons sit in ink and pick up their brand colour on hover
// (no brand colour = stays ink, for monochrome logos)
const TECH = {
    react: { Icon: SiReact, label: 'React', brand: '#61DAFB' },
    next: { Icon: SiNextdotjs, label: 'Next.js' },
    ts: { Icon: SiTypescript, label: 'TypeScript', brand: '#3178C6' },
    js: { Icon: SiJavascript, label: 'JavaScript', brand: '#d4b830' },
    tailwind: { Icon: SiTailwindcss, label: 'Tailwind', brand: '#06B6D4' },
    scss: { Icon: SiSass, label: 'SCSS', brand: '#CC6699' },
    framer: { Icon: SiFramer, label: 'Framer Motion' },
    gsap: { Icon: SiGreensock, label: 'GSAP', brand: '#88CE02' },
    three: { Icon: SiThreedotjs, label: 'Three.js' },
    redux: { Icon: SiRedux, label: 'Redux', brand: '#764ABC' },
    webpack: { Icon: SiWebpack, label: 'Webpack', brand: '#1C78C0' },
    npm: { Icon: SiNpm, label: 'NPM', brand: '#CB3837' },
    node: { Icon: SiNodedotjs, label: 'Node.js', brand: '#3fa63f' },
    express: { Icon: SiExpress, label: 'Express' },
    dotnet: { Icon: SiDotnet, label: '.NET', brand: '#7c5cff' },
    postman: { Icon: SiPostman, label: 'Postman', brand: '#FF6C37' },
    mongo: { Icon: SiMongodb, label: 'MongoDB', brand: '#47A248' },
    postgres: { Icon: SiPostgresql, label: 'PostgreSQL', brand: '#5a86f0' },
    mysql: { Icon: SiMysql, label: 'MySQL', brand: '#4479A1' },
    prisma: { Icon: SiPrisma, label: 'Prisma' },
    redis: { Icon: SiRedis, label: 'Redis', brand: '#DC382D' },
    elastic: { Icon: SiElasticsearch, label: 'Elasticsearch', brand: '#00A9A5' },
    docker: { Icon: SiDocker, label: 'Docker', brand: '#2496ED' },
    azure: { Icon: VscAzure, label: 'Azure', brand: '#0078D4' },
    actions: { Icon: SiGithubactions, label: 'CI / CD', brand: '#2088FF' },
    vercel: { Icon: SiVercel, label: 'Vercel' },
    lighthouse: { Icon: SiLighthouse, label: 'Lighthouse', brand: '#F44B21' },
    searchConsole: { Icon: SiGooglesearchconsole, label: 'Search Console', brand: '#458CF5' },
    git: { Icon: SiGit, label: 'Git', brand: '#F05032' },
    vitest: { Icon: SiVitest, label: 'Vitest', brand: '#6E9F18' },
    claude: { Icon: SiClaude, label: 'Claude Code', brand: '#D97757' },
    copilot: { Icon: SiGithubcopilot, label: 'Copilot' },
};

const StickyCards = () => {
    const StickyCardsData = [
        {
            index: '01',
            title: 'Frontend Development',
            description: 'Custom-coded sites that are fast, accessible and full of thoughtful motion.',
            skills: [
                { name: 'Modern Websites', stack: ['react', 'next', 'ts', 'js', 'tailwind', 'scss'] },
                { name: 'Motion & Animations', stack: ['framer', 'gsap', 'three'] },
                { name: 'Scalability', stack: ['redux', 'webpack', 'npm'] }
            ],
        },
        {
            index: '02',
            title: 'Backend Development',
            description: 'Robust APIs and databases built to scale, from design to deployment.',
            skills: [
                { name: 'RESTful APIs', stack: ['node', 'express', 'dotnet', 'postman'] },
                { name: 'Database Design', stack: ['mongo', 'postgres', 'mysql', 'prisma'] },
                { name: 'Cloud Deployment', stack: ['docker', 'azure', 'actions', 'vercel'] }
            ],
        },
        {
            index: '03',
            title: 'Web Performance',
            description: 'Faster load times and smoother interactions, tuned for Core Web Vitals.',
            skills: [
                { name: 'Core Web Vitals', stack: ['lighthouse', 'next', 'react'] },
                { name: 'Code Optimization', stack: ['webpack', 'redis', 'elastic'] },
                { name: 'SEO Enhancement', stack: ['next', 'searchConsole', 'vercel'] }
            ],
        },
        {
            index: '04',
            title: 'System Architecture',
            description: 'End-to-end systems designed to stay maintainable as they grow.',
            skills: [
                { name: 'Full-stack Solutions', stack: ['mongo', 'express', 'react', 'node', 'dotnet'] },
                { name: 'Scalable Patterns', stack: ['docker', 'redis', 'elastic', 'azure'] },
                { name: 'Best Practices', stack: ['git', 'ts', 'vitest', 'actions', 'claude', 'copilot'] }
            ],
        },
    ]

    const glow = usePointerGlow();
    const stackRef = useRef(null);

    // As the next card slides over this one, the shape glides up into the
    // strip that stays visible and shrinks to fit it. Progress is driven by
    // how far the next card overlaps, so it tracks the scroll exactly.
    useEffect(() => {
        const stack = stackRef.current;
        if (!stack) return;
        const cards = [...stack.querySelectorAll('.sticky-card')];
        let frame = null;

        const update = () => {
            frame = null;
            // Phones already keep the shape in the sticky strip
            const enabled = window.innerWidth > 767;
            const strip = parseFloat(getComputedStyle(stack).getPropertyValue('--stack-step')) || 112;

            cards.forEach((card, i) => {
                const dock = card.querySelector('.svg-dock');
                const next = cards[i + 1];
                if (!dock) return;
                if (!enabled || !next) {
                    card.style.setProperty('--dock', '0');
                    return;
                }

                const rect = card.getBoundingClientRect();
                const overlap = rect.bottom - next.getBoundingClientRect().top;
                const progress = Math.min(Math.max(overlap / (rect.height * 0.5), 0), 1);

                // Measure from the untransformed parent so the dock doesn't chase itself
                const box = dock.parentElement.getBoundingClientRect();
                const centre = box.top + box.height / 2 - rect.top;
                const size = dock.offsetHeight || 1;

                card.style.setProperty('--dock', progress.toFixed(3));
                card.style.setProperty('--dock-y', `${strip / 2 - centre}px`);
                card.style.setProperty('--dock-scale', Math.min(1, (strip * DOCK_FILL) / size).toFixed(3));
            });
        };

        const schedule = () => {
            if (frame === null) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            if (frame !== null) cancelAnimationFrame(frame);
        };
    }, []);

    // Sticky cards are released one by one as the stack's end passes each
    // card's bottom, so the last card would slide up over the others. Give
    // each card a bottom margin that lines its release point up with the last
    // card's, cancelled by the next card's negative top margin (the two
    // collapse to zero), so spacing is unchanged and the stack leaves as one.
    useEffect(() => {
        const stack = stackRef.current;
        if (!stack) return;
        const cards = [...stack.querySelectorAll('.sticky-card')];

        const align = () => {
            const release = cards.map((card) => (parseFloat(getComputedStyle(card).top) || 0) + card.offsetHeight);
            const last = release[release.length - 1];
            cards.forEach((card, i) => {
                const extra = i < cards.length - 1 ? Math.max(0, last - release[i]) : 0;
                card.style.marginBottom = `${extra}px`;
                if (cards[i + 1]) cards[i + 1].style.marginTop = `${-extra}px`;
            });
        };

        align();
        const observer = new ResizeObserver(align);
        cards.forEach((card) => observer.observe(card));
        window.addEventListener('resize', align);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', align);
        };
    }, []);

    return (
        <div className='sticky-cards' ref={stackRef}>
            {/* Column lines behind the stack, so the gap above a pinned card
                keeps the table's verticals */}
            <div className="sticky-rails" aria-hidden="true">
                <span /><span /><span /><span />
            </div>
            {StickyCardsData.map((cardData, index) => (
                <article
                    className="sticky-card"
                    key={cardData.index}
                    // Sticky offset per card lives in CSS (see --stack-step)
                    style={{ '--i': index }}
                    onPointerMove={glow.onPointerMove}
                    onPointerLeave={glow.onPointerLeave}
                >
                    <span className="sticky-card-spotlight" aria-hidden="true" />

                    <div className="sticky-card-main">
                        <div className="sticky-card-heading">
                            <span className="sticky-card-index">{cardData.index}</span>
                            <h3 className="sticky-card-title">{cardData.title}</h3>
                        </div>
                        <p className="sticky-card-description">{cardData.description}</p>
                    </div>

                    <ul className="sticky-card-skills">
                        {cardData.skills.map((skill, i) => (
                            <li key={skill.name}>
                                <span className="skill-head">
                                    <span className="skill-index">0{i + 1}</span>
                                    <span className="skill-name">{skill.name}</span>
                                </span>
                                <ul className="skill-stack" aria-label={`${skill.name} stack`}>
                                    {skill.stack.map((key) => {
                                        const { Icon, label, brand } = TECH[key];
                                        return (
                                            <li
                                                key={key}
                                                className="tech-chip"
                                                style={brand ? { '--brand': brand } : undefined}
                                            >
                                                <Icon aria-hidden="true" />
                                                {label}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        ))}
                    </ul>

                    {/* Drifts toward the pointer for a little depth */}
                    <div className="svg-box" aria-hidden="true">
                        <div className="svg-dock">
                            <AnimatedShape type={cardData.title} />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}

export default StickyCards;
