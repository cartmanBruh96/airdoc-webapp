import crypto from 'crypto';
import { getSecret } from '@/app/services/secretManager';

const ALGORITHM = 'aes-256-cbc';
const IV = process.env.ENCRYPTION_KEY_IV!;
const ENCRYPTION_KEY_NAME = process.env.ENCRYPTION_KEY_NAME!;

export const decrypt = async (encryptedText: string): Promise<string> => {
    const encryptionKey = await getSecret(ENCRYPTION_KEY_NAME);
    if (!encryptionKey) {
        throw new Error('Encryption key not found');
    }
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(encryptionKey, 'hex'), Buffer.from(IV, 'hex'));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export const encrypt = async (plainText: string): Promise<string> => {
    const encryptionKey = await getSecret(ENCRYPTION_KEY_NAME);
    if (!encryptionKey) {
        throw new Error('Encryption key not found');
    }
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(encryptionKey, 'hex'), Buffer.from(IV, 'hex'));
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export const generateHexKey = (): string => {
    return crypto.randomBytes(32).toString('hex');
}