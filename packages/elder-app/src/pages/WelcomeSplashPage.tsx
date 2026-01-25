import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Brand Colors - ElderGuardAI
const colors = {
    deepTrustBlue: '#1E40AF',
    warmCareTeal: '#14B8A6',
    softElderBeige: '#F5F1E8',
    lifeGreen: '#10B981',
    alertAmber: '#F59E0B',
    pureWhite: '#FFFFFF',
    deepCharcoal: '#1F2937',
};

// Animated background particles (care icons as subtle elements)
const FloatingParticle = ({ delay, duration, startX, startY, icon }: {
    delay: number;
    duration: number;
    startX: number;
    startY: number;
    icon: string;
}) => (
    <motion.div
        initial={{ opacity: 0, x: startX, y: startY, scale: 0.5 }}
        animate={{
            opacity: [0, 0.15, 0.15, 0],
            x: [startX, startX + 30, startX - 20, startX + 10],
            y: [startY, startY - 40, startY - 80, startY - 120],
            scale: [0.5, 0.8, 0.9, 0.6],
            rotate: [0, 10, -10, 0],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
        }}
        className="absolute text-4xl select-none pointer-events-none"
        style={{ filter: 'blur(1px)' }}
    >
        {icon}
    </motion.div>
);

// Pulsing Loader Dots
const LoaderDots = () => (
    <div className="flex gap-3 justify-center mt-12">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                initial={{ scale: 1, opacity: 0.7 }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                }}
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors.warmCareTeal }}
            />
        ))}
    </div>
);

// Main Splash Page Component
const WelcomeSplashPage = () => {
    const navigate = useNavigate();
    const [isExiting, setIsExiting] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Prefetch landing page
    useEffect(() => {
        // Preload the landing page component
        import('./LandingPage');
    }, []);

    // Navigation handler
    const handleNavigate = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            navigate('/home');
        }, 600);
    }, [navigate]);

    // Auto-transition after 4 seconds
    useEffect(() => {
        if (prefersReducedMotion) {
            // Immediate for reduced motion
            handleNavigate();
            return;
        }

        const timer = setTimeout(() => {
            handleNavigate();
        }, 4000);

        return () => clearTimeout(timer);
    }, [handleNavigate, prefersReducedMotion]);

    // Skip handler
    const handleSkip = () => {
        handleNavigate();
    };

    // Tagline words for staggered animation
    const taglineWords = ['Predict.', 'Protect.', 'Prevent.'];

    // Floating particles configuration
    const particles = [
        { delay: 0, duration: 8, startX: 100, startY: 200, icon: '❤️' },
        { delay: 1.5, duration: 9, startX: 300, startY: 400, icon: '🛡️' },
        { delay: 0.5, duration: 7, startX: 500, startY: 150, icon: '🤝' },
        { delay: 2, duration: 10, startX: 700, startY: 350, icon: '💊' },
        { delay: 1, duration: 8, startX: 200, startY: 500, icon: '🏥' },
        { delay: 2.5, duration: 9, startX: 600, startY: 250, icon: '✨' },
        { delay: 0.8, duration: 7.5, startX: 400, startY: 450, icon: '🌟' },
        { delay: 1.8, duration: 8.5, startX: 150, startY: 300, icon: '💙' },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.05 : 1 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${colors.deepTrustBlue} 0%, ${colors.warmCareTeal} 100%)`,
                }}
                role="main"
                aria-label="Welcome to ElderGuardAI. Predictive AI care for seniors. Loading..."
            >
                {/* Animated Gradient Mesh Background */}
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    style={{
                        background: `
              radial-gradient(ellipse at 30% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(30, 64, 175, 0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 60%)
            `,
                    }}
                />

                {/* Frosted Glass Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(100px)',
                    }}
                />

                {/* Floating Particles */}
                {!prefersReducedMotion && particles.map((particle, index) => (
                    <FloatingParticle key={index} {...particle} />
                ))}

                {/* Main Content Container */}
                <div className="relative z-10 text-center px-6 max-w-4xl">
                    {/* Brand Name - ElderGuardAI */}
                    <motion.h1
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: 'blur(0px)',
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            delay: 0.3,
                        }}
                        className="relative"
                    >
                        <motion.span
                            animate={prefersReducedMotion ? {} : {
                                textShadow: [
                                    '0 0 30px rgba(20, 184, 166, 0)',
                                    '0 0 60px rgba(20, 184, 166, 0.5)',
                                    '0 0 30px rgba(20, 184, 166, 0)',
                                ],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: 'reverse',
                                delay: 1,
                            }}
                            className="text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-bold tracking-[0.05em] inline-block"
                            style={{
                                fontFamily: "'Courier New', 'Lucida Console', monospace",
                                background: `linear-gradient(135deg, ${colors.pureWhite} 0%, ${colors.softElderBeige} 50%, ${colors.warmCareTeal} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            ElderGuardAI
                        </motion.span>
                    </motion.h1>

                    {/* Tagline - "Predict. Protect. Prevent." */}
                    <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
                        {taglineWords.map((word, index) => (
                            <motion.span
                                key={word}
                                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: prefersReducedMotion ? 0 : 1.2 + index * 0.2,
                                    ease: 'easeOut',
                                }}
                                className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-light tracking-wide"
                                style={{
                                    fontFamily: "'Inter', system-ui, sans-serif",
                                    color: colors.softElderBeige,
                                    opacity: 0.9,
                                }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </div>

                    {/* Loading Indicator */}
                    <motion.div
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 2, duration: 0.5 }}
                    >
                        <LoaderDots />
                    </motion.div>
                </div>

                {/* Skip Button */}
                <motion.button
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: prefersReducedMotion ? 0 : 1.5, duration: 0.4 }}
                    onClick={handleSkip}
                    className="fixed bottom-8 right-8 sm:bottom-10 sm:right-10 px-6 py-3 rounded-full border-2 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
                    style={{
                        borderColor: 'rgba(255, 255, 255, 0.4)',
                        color: colors.pureWhite,
                        fontFamily: "'Inter', system-ui, sans-serif",
                        fontWeight: 500,
                        fontSize: '16px',
                    }}
                    aria-label="Skip introduction and continue to homepage"
                    tabIndex={0}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.warmCareTeal;
                        e.currentTarget.style.borderColor = colors.warmCareTeal;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    }}
                >
                    <span className="flex items-center gap-2">
                        Skip
                        <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="inline-block"
                        >
                            →
                        </motion.span>
                    </span>
                </motion.button>

                {/* Subtle version indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 2 }}
                    className="fixed bottom-8 left-8 text-xs"
                    style={{ color: colors.softElderBeige, fontFamily: "'Inter', sans-serif" }}
                >
                    © 2026 ElderGuardAI
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WelcomeSplashPage;
