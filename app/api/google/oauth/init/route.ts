import { NextResponse } from 'next/server';
import axios from 'axios';

import { setAccessToken, setRefreshToken } from "@/app/services/googleOauthToken";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET!;
const OAUTH_CODE_EXCHANGE_URL = 'https://oauth2.googleapis.com/token';

type OAUTHV2TokenResponse = {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
    refresh_token_expires_in: number;
}

// access token valid for 1 hour
// refresh token valid for 7 days
export async function POST(request: Request) {
    try {
        const { code } = await request.json();
        const tokenResponse = await axios.post(
            OAUTH_CODE_EXCHANGE_URL,
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                redirect_uri: 'http://localhost:3000/google/auth/callback',
            }),
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            }
        );
        const data: OAUTHV2TokenResponse = tokenResponse.data;
        await setAccessToken(data.access_token, data.expires_in);
        await setRefreshToken(data.refresh_token, data.refresh_token_expires_in);
        return NextResponse.json({ data: null });
    } catch (error: unknown) {
        console.error('Error exchanging code for token:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}