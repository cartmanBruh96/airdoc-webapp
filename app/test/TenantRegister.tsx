'use client';

import { useState } from 'react';
import axios from '@/config/axios';

const TenantRegister = () => {
    const [userId, setUserId] = useState('');

    const handler = async (e) => {
        e.preventDefault();
        const payload = {
            "userId": userId,
        };
        const result = await axios.post('/tenants/register', payload);
        console.log('Function result:', result.data);
    }

    return (
            <form onSubmit={handler} className='p-16 bg-orange-300'>
                <h1>/v1/tenants/register</h1>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="User ID"
                    required
                />
                <button type="submit">Register Tenant</button>
            </form>
    );
};

export default TenantRegister;