import { CloudflareEnv } from "../types/env";

export const updateWebhookHash = async (env: CloudflareEnv, id: number, newHash: string): Promise<boolean> => {
    try {
        const data = await env.DB.prepare('UPDATE webhooks SET lasthash = ? WHERE id = ?').bind(newHash, id).run();
        return data.meta.changed_db && Boolean(data.meta.changes);
    } catch {
        return false;
    }
}