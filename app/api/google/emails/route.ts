import { NextResponse } from 'next/server';
import axios from 'axios';
import { readToken, TokenType } from '@/app/services/token';

const EMAIL_ENDPOINT = 'https://gmail.googleapis.com/gmail/v1/users/me/messages';

type UserEmailsPaginatedResponse = {
    messages: Array<{
        id: string;
        threadId: string;
    }>;
}

type DetailedEmailResponse = {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
}

export async function GET() {
    try {
        const accessToken = await readToken(TokenType.GOOGLE_OAUTH_ACCESS_TOKEN);
        if (!accessToken) {
            return NextResponse.json({ error: 'No access token found' }, { status: 401 });
        }
        const emailsResponse = await axios.get(EMAIL_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const emailsResponseData: UserEmailsPaginatedResponse = emailsResponse.data;
        console.log('User emails:', emailsResponseData);
        // read only first 3 emails
        const firstThreeEmails = emailsResponseData.messages.slice(0, 3);
        const detailedEmails = [];
        for (const email of firstThreeEmails) {
            const emailDetails = await getEmailDetails(email.id, accessToken);
            detailedEmails.push(emailDetails);
        }
        return NextResponse.json({ data: detailedEmails });
    } catch (error) {
        console.error('Error fetching user emails:', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}

const getEmailDetails = async (emailId: string, accessToken: string) => {
    const emailsResponse = await axios.get(
        `${EMAIL_ENDPOINT}/${emailId}`, 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
    const emailsResponseData: DetailedEmailResponse = emailsResponse.data;
    return emailsResponseData;
}