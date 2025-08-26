import { NextResponse } from 'next/server';
import axios from 'axios';

import redis from "@/app/services/redis";

const CLIENT_ID = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET_VALUE!;
const OAUTH_CODE_EXCHANGE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
const GRAPH_EMAIL_ENDPOINT = 'https://graph.microsoft.com/v1.0/me/messages';

type OAUTHV2TokenResponse = {
    token_type: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    id_token: string;
}

type UserEmailsData = {
    value: Array<{
        id: string;
        subject: string;
        bodyPreview: string;
    }>;
}

export async function POST(request: Request) {
    try {
        const { code } = await request.json();
        const tokenResponse = await axios.post(
            OAUTH_CODE_EXCHANGE_URL,
            new URLSearchParams({
                grant_type: 'authorization_code',
                scope: 'https://graph.microsoft.com/.default',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                redirect_uri: 'http://localhost:3000/ms/auth/callback',
            }),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
        );
        const data: OAUTHV2TokenResponse = tokenResponse.data;
        console.log('Token response:', data);
        const emailsResponse = await axios.get(GRAPH_EMAIL_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${data.access_token}`,
            },
        });
        const emailsResponseData: UserEmailsData = emailsResponse.data;
        console.log('User emails:', emailsResponse.data);
        return NextResponse.json({ data: emailsResponseData.value });
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}