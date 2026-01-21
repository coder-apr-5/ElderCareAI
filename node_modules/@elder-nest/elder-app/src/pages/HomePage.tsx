import { EmergencyButton } from "@/features/emergency/EmergencyButton";
import { MoodSelector } from "@/features/mood/MoodSelector";
import { MedicineList } from "@/features/medicine/MedicineList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export const HomePage = () => {
    return (
        <div className="space-y-8 pb-32">
            <header className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-800">Good Morning, Martha! ☀️</h1>
                <p className="text-2xl text-gray-500">It's a beautiful Tuesday.</p>
            </header>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>How are you feeling today?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MoodSelector />
                    </CardContent>
                </Card>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <MedicineList />
            </motion.section>

            <motion.div
                className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md shadow-lg border-t z-50"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <EmergencyButton />
            </motion.div>
        </div>
    )
}
