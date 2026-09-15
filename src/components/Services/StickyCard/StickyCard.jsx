'use client'
import AnimatedShape from './AnimatedShape';
import usePointerGlow from '../../../common/usePointerGlow';
import './StickyCards.css'

const StickyCards = () => {
    const StickyCardsData = [
        {
            index: '01',
            title: 'Frontend Development',
            description: 'Custom-coded sites that are fast, accessible and full of thoughtful motion.',
            skills: [
                'Modern Websites',
                'Motion & Animations',
                'Scalability'
            ],
        },
        {
            index: '02',
            title: 'Backend Development',
            description: 'Robust APIs and databases built to scale, from design to deployment.',
            skills: [
                'RESTful APIs',
                'Database Design',
                'Cloud Deployment'
            ],
        },
        {
            index: '03',
            title: 'Web Performance',
            description: 'Faster load times and smoother interactions, tuned for Core Web Vitals.',
            skills: [
                'Core Web Vitals',
                'Code Optimization',
                'SEO Enhancement'
            ],
        },
        {
            index: '04',
            title: 'System Architecture',
            description: 'End-to-end systems designed to stay maintainable as they grow.',
            skills: [
                'Full-stack Solutions',
                'Scalable Patterns',
                'Best Practices'
            ],
        },
    ]

    const glow = usePointerGlow();

    return (
        <div className='sticky-cards'>
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

                    <span className="sticky-card-index">({cardData.index})</span>
                    <h3 className="sticky-card-title">{cardData.title}</h3>

                    {/* Drifts toward the pointer for a little depth */}
                    <div className="svg-box" aria-hidden="true">
                        <AnimatedShape type={cardData.title} />
                    </div>

                    <div className="sticky-card-content">
                        <p className="sticky-card-description">{cardData.description}</p>

                        <ul className="sticky-card-skills">
                            {cardData.skills.map((skill, i) => (
                                <li key={skill}>
                                    <span className="skill-index">0{i + 1}</span>
                                    <span className="skill-name">{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </article>
            ))}
        </div>
    )
}

export default StickyCards;
