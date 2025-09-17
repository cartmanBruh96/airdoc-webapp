'use client';

import { useState } from 'react';
import axios from '@/config/axios';

const UserRegister = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');

    const handler = async (e) => {
        e.preventDefault();
        const payload = {
            "email": email,
            "firstName": firstName,
        };
        const result = await axios.post('/users/register', payload);
        console.log('Function result:', result.data);
    }

    return (
            <form onSubmit={handler} className='p-16 bg-indigo-300'>
                <h1>/v1/users/register</h1>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                />
                <button type="submit">Register User</button>
            </form>
    );
};

export default UserRegister;