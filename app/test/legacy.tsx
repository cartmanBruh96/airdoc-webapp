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

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [tenant, setTenant] = useState<string | null>(null);
    const [user, setUser] = useState<string | null | undefined>(null);
    const [token, setToken] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string | null>(null);

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

    const handleSignUp = async () => {
        try {
            setError(null);
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up successfully!');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message);
            console.error('Sign-up failed:', err);
        }
    };

    const handleSignOut = async () => {
        try {
            setError(null);
            await signOut(auth);
            console.log('User signed out successfully!');
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(err.message);
            console.error('Sign-out failed:', err);
        }
    };

    const tenantRegisterHandler = async () => {
        const payload = {
            "workEmail": "shas@me.com",
            "firstName": "shas",
            "lastName": "mann",
            "phoneNumber": "+61410999222",
            "companyName": "hey me",
            "businessType": "consulting",
            "numberOfEmployees": 78
        };
        const apiFunction = httpsCallable(functions, 'api');
        const result = await apiFunction({
            path: '/v1/tenants/register',
            method: 'POST',
            data: payload
        });
        console.log('Function result:', result.data);
    }

    const googleOauthInitHandler = async () => {
        const payload = {
            code: token,
            tenantId: tenant
        };
        const apiFunction = httpsCallable(functions, 'api');
        const result = await apiFunction({
            path: '/v1/google/oauth/init',
            method: 'POST',
            data: payload
        });
        console.log('Function result:', result.data);
    }

    return (
        <>
            <p className='p-8 font-bold'>User: {user}</p>
            <form onSubmit={handleSignUp} className='p-16 bg-yellow-800'>
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
                <button type="button" onClick={handleSignUp} className='bg-blue-500 text-white p-2 rounded'>Sign Up</button>
                <button type="button" onClick={handleSignOut} className='bg-red-500 text-white p-2 rounded ml-4'>Sign Out</button>
                <button type="button" onClick={handleLogin} className='bg-green-500 text-white p-2 rounded ml-4'>Login</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <div className='p-16 bg-purple-800'>
                <button onClick={tenantRegisterHandler} className='bg-blue-500 text-white p-2 rounded'>Register Tenant</button>
            </div>
            <div className='p-16 bg-orange-800'>
                <input
                    type="text"
                    value={tenant || ''}
                    onChange={(e) => setTenant(e.target.value)}
                    placeholder="Tenant ID"
                />
                <input
                    type="text"
                    value={token || ''}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Token"
                />
                <button onClick={googleOauthInitHandler} className='bg-blue-500 text-white p-2 rounded'>Google OAuth</button>
            </div>
        </>
    );
};

export default SignUp;