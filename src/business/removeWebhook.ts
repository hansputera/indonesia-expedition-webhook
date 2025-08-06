import { CloudflareEnv } from "../types/env";

export const removeWebhook = async (env: CloudflareEnv, id: number) => {
    try {
        await env.DB.prepare("DELETE FROM webhooks WHERE id = ?").bind(id).run();
        return true;
    } catch {
        return false;
    }
}