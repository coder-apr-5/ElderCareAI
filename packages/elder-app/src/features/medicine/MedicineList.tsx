import { useState, useEffect } from 'react';
import { Clock, Pill, Plus } from "lucide-react";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@elder-nest/shared';
import { onAuthStateChanged } from 'firebase/auth';

export const MedicineList = () => {
    const [medications, setMedications] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMed, setNewMed] = useState('');
    const [showAddInput, setShowAddInput] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setMedications(data.medications || []);
                    }
                } catch (error) {
                    console.error('Error fetching medications:', error);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [db]);

    const addMedication = async () => {
        if (!newMed.trim()) return;
        
        const user = auth.currentUser;
        if (!user) return;

        const updatedMeds = [...medications, newMed.trim()];
        setMedications(updatedMeds);
        setNewMed('');
        setShowAddInput(false);

        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                medications: updatedMeds
            });
        } catch (error) {
            console.error('Error saving medication:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (medications.length === 0) {
        return (
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Pill className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">No medications added yet</p>
                
                {showAddInput ? (
                    <div className="flex gap-2 max-w-xs mx-auto">
                        <input
                            value={newMed}
                            onChange={(e) => setNewMed(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                            placeholder="Medication name"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                            autoFocus
                        />
                        <button
                            onClick={addMedication}
                            className="px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-xl text-sm font-medium"
                        >
                            Add
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowAddInput(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-200 transition-colors"
                    >
                        <Plus size={16} /> Add Medication
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {medications.map((med, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-700/50 rounded-2xl border border-blue-100 dark:border-slate-600">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white dark:bg-slate-600 rounded-full flex items-center justify-center shadow-sm text-blue-500 dark:text-blue-300">
                            <Pill className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">{med}</h4>
                            <p className="text-base text-slate-500 dark:text-slate-400">Daily • After meals</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-slate-600 px-3 py-1 rounded-lg">
                        <Clock size={16} />
                        <span className="font-bold">2:00 PM</span>
                    </div>
                </div>
            ))}

            {/* Add More */}
            {showAddInput ? (
                <div className="flex gap-2 mt-4">
                    <input
                        value={newMed}
                        onChange={(e) => setNewMed(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addMedication()}
                        placeholder="Medication name"
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                        autoFocus
                    />
                    <button
                        onClick={addMedication}
                        className="px-4 py-2 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-xl text-sm font-medium"
                    >
                        Add
                    </button>
                    <button
                        onClick={() => {setShowAddInput(false); setNewMed('');}}
                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddInput(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-orange-200 rounded-xl text-orange-500 hover:bg-orange-50 transition-colors text-sm font-medium"
                >
                    <Plus size={18} /> Add Another Medication
                </button>
            )}
        </div>
    );
};
