export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    role: 'elder' | 'family' | 'admin';
    createdAt: number;
}

export interface MoodEntry {
    id: string;
    uid: string;
    mood: 'happy' | 'neutral' | 'sad';
    note?: string;
    timestamp: Date;
}

export interface Medicine {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    time: string; // HH:MM
    takenToday: boolean;
}
