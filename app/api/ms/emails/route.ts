import { NextResponse } from 'next/server';
import axios from 'axios';

import { getAccessToken } from '@/app/services/msOauthToken';

const GRAPH_EMAIL_ENDPOINT = 'https://graph.microsoft.com/v1.0/me/messages';

type UserEmailsData = {
    value: Array<{
        id: string;
        subject: string;
        bodyPreview: string;
    }>;
}

export async function GET() {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return NextResponse.json({ error: 'No access token found' }, { status: 401 });
        }
        const emailsResponse = await axios.get(GRAPH_EMAIL_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const emailsResponseData: UserEmailsData = emailsResponse.data;
        return NextResponse.json({ data: emailsResponseData.value });
    } catch (error) {
        console.error('Error fetching user emails:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}