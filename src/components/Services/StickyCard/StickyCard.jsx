'use client'
import { useRef, useState, useEffect } from 'react';
import AnimatedShape from './AnimatedShape';
import './StickyCards.css'

const StickyCards = () => {
    const StickyCardsData = [
        {
            index: '01',
            title: 'Frontend Development',
            description: 'I create custom-coded websites. I focus on making sure they are scalable, fast, accessible, and have engaging animations to provide a memorable experience for users.',
            skills: [
                'Modern Websites',
                'Motion & Animations',
                'Scalability'
            ],
        },
        {
            index: '02',
            title: 'Backend Development',
            description: 'Building robust server-side solutions with scalable architecture. From API design to database optimization, I handle the complete backend infrastructure.',
            skills: [
                'RESTful APIs',
                'Database Design',
                'Cloud Deployment'
            ],
        },
        {
            index: '03',
            title: 'Web Performance',
            description: 'Optimizing applications for speed and efficiency. I focus on fast load times, smooth interactions, and excellent user experience through performance best practices.',
            skills: [
                'Core Web Vitals',
                'Code Optimization',
                'SEO Enhancement'
            ],
        },
        {
            index: '04',
            title: 'System Architecture',
            description: 'Designing complete systems from concept to deployment. I make technical decisions that ensure maintainability, scalability, and long-term success.',
            skills: [
                'Full-stack Solutions',
                'Scalable Patterns',
                'Best Practices'
            ],
        },
    ]

    const container = useRef(null)
    const [screenSize, setScreenSize] = useState('desktop');

    useEffect(() => {
        const checkScreenSize = () => {
            const width = window.innerWidth;
            if (width <= 768) {
                setScreenSize('mobile');
            } else if (width <= 900) {
                setScreenSize('tablet-small');
            } else if (width <= 1200) {
                setScreenSize('tablet');
            } else if (width <= 1400) {
                setScreenSize('laptop');
            } else if (width <= 2400) {
                setScreenSize('desktop');
            } else if (width <= 3800) {
                setScreenSize('2k');
            } else {
                setScreenSize('4k');
            }
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const getCardStyle = (index) => {
        let baseOffset;
        let headerHeight;
        
        switch (screenSize) {
            case 'mobile':
                baseOffset = 80;
                headerHeight = 60;
                break;
            case 'tablet-small':
                baseOffset = 80;
                headerHeight = 70;
                break;
            case 'tablet':
                baseOffset = 80;
                headerHeight = 80;
                break;
            case 'laptop':
                baseOffset = 80;
                headerHeight = 90;
                break;
            case '2k':
                baseOffset = 100;
                headerHeight = 150;
                break;
            case '4k':
                baseOffset = 120;
                headerHeight = 200;
                break;
            default:
                baseOffset = 80;
                headerHeight = 120;
        }
        
        const topPosition = baseOffset + (index * headerHeight);

        return {
            top: `${topPosition}px`,
            position: 'sticky',
            zIndex: index + 1,
        };
    };

    return (
        <div className='sticky-cards' ref={container}>
            {StickyCardsData.map((cardData, index) => (
                <div
                    className="sticky-card"
                    key={index}
                    style={getCardStyle(index)}
                >
                    {/* Left - Index and Animation */}
                    <div className="sticky-card-index">
                        <span>({cardData.index})</span>
                        {/* Animated Shape */}
                        <div className='svg-box'>
                            <AnimatedShape type={cardData.title} />
                        </div>
                    </div>

                    {/* Right - Content */}
                    <div className="sticky-card-content">
                        <h1 className="sticky-card-title">{cardData.title}</h1>
                        
                        <p className="sticky-card-description">{cardData.description}</p>
                        
                        <ul className="sticky-card-skills">
                            {cardData.skills.map((skill, i) => (
                                <li key={i}>
                                    <span className="skill-index">0{i + 1}</span>
                                    <span className="skill-name">{skill}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default StickyCards;
