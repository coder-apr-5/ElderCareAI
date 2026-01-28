import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Hash, Heart } from 'lucide-react';
import { auth, db } from '@elder-nest/shared';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';

export const ConnectElderPage = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (code.length < 6) {
            setError('Please enter a valid 6-digit code.');
            return;
        }
        setLoading(true);

        try {
            // Find Elder by Code
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('connectionCode', '==', code), where('role', '==', 'elder'));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError('Invalid Family Code. Please check significantly.');
                setLoading(false);
                return;
            }

            const elderDoc = querySnapshot.docs[0];
            const elderId = elderDoc.id;
            const elderData = elderDoc.data();
            const myId = auth.currentUser?.uid;

            if (!myId) return;

            // Update My Profile
            const myRef = doc(db, 'users', myId);
            await updateDoc(myRef, {
                eldersConnected: arrayUnion(elderId)
            });

            // Update Elder Profile
            const elderRef = doc(db, 'users', elderId);
            await updateDoc(elderRef, {
                familyMembers: arrayUnion(myId)
            });

            alert(`Successfully connected to ${elderData.fullName}!`);
            navigate('/family/profile'); // Go to Elder Profile View

        } catch (err) {
            console.error(err);
            setError('Connection failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-8 text-center text-white">
                    <Heart size={48} className="mx-auto mb-4 fill-white opacity-90" />
                    <h1 className="text-2xl font-bold">Connect to Elder</h1>
                    <p className="opacity-90">Enter the unique family code found on your elder's profile.</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleConnect} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Family Code</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. A1B2C3"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none font-mono text-lg uppercase tracking-widest"
                                    maxLength={8}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-70"
                        >
                            {loading ? 'Verifying...' : <>Verify & Connect <ChevronRight size={18} /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Don't have a code? Ask your elder to check their profile page.
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
