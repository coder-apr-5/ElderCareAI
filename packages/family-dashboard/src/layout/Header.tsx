import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
    return (
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Martha is Online</span>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Search size={20} className="text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={20} className="text-gray-500" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    JD
                </div>
            </div>
        </header>
    )
}
