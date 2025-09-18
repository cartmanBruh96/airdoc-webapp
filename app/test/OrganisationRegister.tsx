'use client';

import { useState } from 'react';
import axios from '@/config/axios';

const OrganisationRegister = () => {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [numberOfEmployees, setNumberOfEmployees] = useState(0);

    const handler = async (e) => {
        e.preventDefault();
        const payload = {
            "userId": userId,
            "name": name,
            "businessType": businessType,
            "numberOfEmployees": numberOfEmployees,
        };
        const result = await axios.post('/organisations/register', payload);
        console.log('Function result:', result.data);
    }

    return (
            <form onSubmit={handler} className='p-16 bg-orange-300'>
                <h1>/v1/organisations/register</h1>

                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="User ID"
                    required
                />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Organisation Name"
                    required
                />
                <input
                    type="text"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    placeholder="Business Type"
                    required
                />
                <input
                    type="number"
                    value={numberOfEmployees}
                    onChange={(e) => setNumberOfEmployees(Number(e.target.value))}
                    placeholder="Number of Employees"
                    required
                />
                <button type="submit">Register Organisation</button>
            </form>
    );
};

export default OrganisationRegister;