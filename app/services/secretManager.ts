import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export const getSecret = async (secretName: string): Promise<string | undefined> => {
    try {
        const [version] = await client.accessSecretVersion({
            name: `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/secrets/${secretName}/versions/latest`,
        });
        const payload = version.payload?.data?.toString('utf8');
        if (!payload) {
            throw new Error(`Secret ${secretName} has no payload`);
        }
        return payload;
    } catch (error) {
        console.error(`Error accessing secret ${secretName}:`, error);
    }
}