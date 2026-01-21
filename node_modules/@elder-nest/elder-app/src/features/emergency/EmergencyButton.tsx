import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const EmergencyButton = () => {
    return (
        <Button
            variant="emergency"
            size="xl"
            className="w-full flex items-center justify-center gap-4"
            onClick={() => alert("Emergency Alert Triggered! contacting family...")} // Placeholder
        >
            <AlertCircle size={48} />
            <span>EMERGENCY HELP</span>
        </Button>
    )
}
