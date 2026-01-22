export const RiskMeter = () => {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-40 h-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-t-full"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400 to-yellow-400 rounded-t-full origin-bottom transform rotate-[-45deg]"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-gray-800 rounded-full z-10"></div>
            </div>
            <div className="mt-4 text-center">
                <h3 className="text-3xl font-bold text-green-600">Low Risk</h3>
                <p className="text-gray-500 text-sm">Last updated: 10m ago</p>
            </div>
        </div>
    )
}
