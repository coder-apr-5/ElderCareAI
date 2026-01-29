import { useState, useEffect } from 'react';

export const RealTimeClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <p className="text-4xl font-bold text-white">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span className="text-lg text-slate-400 font-medium ml-1">
                {time.toLocaleTimeString([], { hour12: true }).slice(-2)}
            </span>
        </p>
    );
};

export const ClockWidget = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);
