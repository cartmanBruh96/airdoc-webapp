import { NextResponse } from 'next/server';
import axios from 'axios';

import { readToken, setToken, TokenType } from '@/app/services/token';
import { encrypt } from '@/app/services/encryptDecrypt';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
const OAUTH_CODE_EXCHANGE_URL = 'https://oauth2.googleapis.com/token';

type OAUTHV2TokenResponse = {
    token_type: string;
    expires_in: number;
    ext_expires_in: number;
    access_token: string;
    refresh_token: string;
}

// return a new access token with validity of 1 hour
// refresh token remains the same, and its extended for another 7 days
export async function POST(request: Request) {
    try {
        const refreshToken = await readToken(TokenType.GOOGLE_OAUTH_REFRESH_TOKEN);
        if (!refreshToken) {
            // prompt user to re-authenticate
            return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
        }
        const tokenRefreshResponse = await axios.post(
            OAUTH_CODE_EXCHANGE_URL,
            new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                refresh_token: refreshToken,
            }),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
        );
        const data: OAUTHV2TokenResponse = tokenRefreshResponse.data;
        await setToken(TokenType.GOOGLE_OAUTH_ACCESS_TOKEN, data.access_token, data.expires_in);
        return NextResponse.json({ data: null });
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}