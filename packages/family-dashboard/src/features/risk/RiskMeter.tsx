import { useMemo } from 'react';

interface RiskMeterProps {
    score: number;
    lastUpdated?: string;
}

export const RiskMeter = ({ score, lastUpdated }: RiskMeterProps) => {
    // 0 = Low Risk (Green), 100 = High Risk (Red)
    // Rotation: -90deg (0) to 90deg (100)
    
    const rotation = useMemo(() => {
        // Map 0-100 to -90 to 90 degrees
        const deg = (score / 100) * 180 - 90;
        return Math.min(Math.max(deg, -90), 90);
    }, [score]);

    const riskLabel = useMemo(() => {
        if (score < 30) return { text: "Low Risk", color: "text-green-600" };
        if (score < 70) return { text: "Moderate Risk", color: "text-yellow-600" };
        return { text: "High Risk", color: "text-red-600" };
    }, [score]);

    const gradientColor = useMemo(() => {
        if (score < 30) return "bg-green-500";
        if (score < 70) return "bg-yellow-500";
        return "bg-red-500";
    }, [score]);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-40 h-20 overflow-hidden">
                {/* Background arc */}
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-t-full"></div>
                
                {/* Needle/Gauge Fill - Simplified for CSS without complex clipping */}
                <div 
                    className={`absolute top-0 left-0 w-full h-full ${gradientColor} rounded-t-full origin-bottom opacity-20`}
                ></div>

                {/* Needle */}
                <div 
                    className="absolute bottom-0 left-[50%] w-[2px] h-[calc(100%-4px)] bg-gray-800 origin-bottom transition-transform duration-1000 ease-out z-10"
                    style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                />
                
                {/* Center dot */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full z-20 shadow-md"></div>
            </div>
            
            <div className="mt-4 text-center">
                <h3 className={`text-3xl font-bold ${riskLabel.color}`}>{score}/100</h3>
                <p className={`text-md font-medium ${riskLabel.color}`}>{riskLabel.text}</p>
                {lastUpdated && <p className="text-gray-400 text-xs mt-1">Updated {lastUpdated}</p>}
            </div>
        </div>
    )
}
