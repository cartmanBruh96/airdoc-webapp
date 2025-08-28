import { NextResponse } from 'next/server';
import axios from 'axios';

import { setAccessToken, setRefreshToken, getRefreshToken } from '@/app/services/googleOauthToken';

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
        const refreshToken = await getRefreshToken();
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
        console.log('Token refresh response:', data);
        await setAccessToken(data.access_token);
        // await setRefreshToken(data.refresh_token);
        return NextResponse.json({ data: null });
    } catch (error) {
        console.error('Error exchanging code for token:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}