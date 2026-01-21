import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock } from "lucide-react";

export const ActivityTimeline = () => {
    const activities = [
        { id: 1, type: "medicine", title: "Taken Heart Pill", time: "2:05 PM", status: "success" },
        { id: 2, type: "mood", title: "Mood Check-in: Happy", time: "10:30 AM", status: "info" },
        { id: 3, type: "motion", title: "Movement Detected: Living Room", time: "9:15 AM", status: "neutral" },
    ];

    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-blue-500">
                    <div className="mt-1">
                        {activity.status === "success" && <CheckCircle size={16} className="text-green-500" />}
                        {activity.status === "info" && <CheckCircle size={16} className="text-blue-500" />}
                        {activity.status === "neutral" && <Clock size={16} className="text-gray-400" />}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
