import redis from "@/app/services/redis";

export const setAccessToken = async (token: string, expiresIn: number = 60 * 60) => {
    await redis.set('google_oauth_access_token', token, {
        ex: expiresIn - 600,
    });
};

export const setRefreshToken = async (token: string, expiresIn: number = 30 * 24 * 60 * 60) => {
    await redis.set('google_oauth_refresh_token', token, {
        ex: expiresIn - 600,
    });
};

export const getAccessToken = async (): Promise<string | null> => {
    return await redis.get('google_oauth_access_token');
};

export const getRefreshToken = async (): Promise<string | null> => {
    return await redis.get('google_oauth_refresh_token');
};