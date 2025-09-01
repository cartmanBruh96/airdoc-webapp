import redis from "@/app/services/redis";
import { decrypt, encrypt } from "./encryptDecrypt";

export enum TokenType {
    GOOGLE_OAUTH_ACCESS_TOKEN = 'google_oauth_access_token',
    GOOGLE_OAUTH_REFRESH_TOKEN = 'google_oauth_refresh_token',
    MS_OAUTH_ACCESS_TOKEN = 'ms_oauth_access_token',
    MS_OAUTH_REFRESH_TOKEN = 'ms_oauth_refresh_token',
}

const SAFETY_MARGIN = 600; // 10 minutes
const DEFAULT_EXPIRY = 60 * 60; // 1 hour

export const setToken = async (type: TokenType, token: string, expiresIn: number = DEFAULT_EXPIRY) => {
    const encryptedToken = await encrypt(token);
    await redis.set(type, encryptedToken, {
        ex: expiresIn - SAFETY_MARGIN,
    });
};

export const readToken = async (type: TokenType): Promise<string | null> => {
    const encryptedToken: string | null = await redis.get(type);
    if (!encryptedToken) {
        return null;
    }
    return await decrypt(encryptedToken);
};