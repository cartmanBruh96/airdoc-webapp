import { NextResponse } from 'next/server';
import axios from 'axios';

import { TokenType, setToken } from '@/app/services/token';

const CLIENT_ID = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET_VALUE!;
const OAUTH_CODE_EXCHANGE_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

type OAUTHV2TokenResponse = {
    token_type: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    refresh_token: string;
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
        const { access_token, refresh_token } = data;
        await setToken(TokenType.MS_OAUTH_ACCESS_TOKEN, access_token);
        await setToken(TokenType.MS_OAUTH_REFRESH_TOKEN, refresh_token);
        return NextResponse.json({ data: null });
    } catch (error: unknown) {
        console.error('Error exchanging code for token:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}