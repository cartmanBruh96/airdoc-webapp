'use client';

import { useEffect, useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, functions } from '@/config/firebase';
import { httpsCallable } from 'firebase/functions';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<string | null | undefined>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser?.email);
        });
        return () => unsubscribe(); // Cleanup the listener on unmount
    }, []);

    const handleLogin = async () => {
        try {
            setError(null);
            await signInWithEmailAndPassword(auth, email, password);
            console.log('User logged in successfully!');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message);
            console.error('Login failed:', err);
        }
    };

    return (
        <>
            <p className='p-8 font-bold'>User: {user}</p>
            <form className='p-16 bg-yellow-800'>
                <h2>User Registration</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="button" onClick={handleLogin} className='bg-green-500 text-white p-2 rounded ml-4'>Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </>
    );
};

export default SignIn;