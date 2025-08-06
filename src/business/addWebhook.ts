import { CloudflareEnv } from "../types/env";
import { webhookArk } from "../api/arks/webhook-ark";

export const addWebhook = async (env: CloudflareEnv, payload: typeof webhookArk.infer) => {
    try {
        const data = await env.DB.prepare(
            "INSERT INTO webhooks (url, receiptno, expedition, isactive) VALUES (?, ?, ?, ?, ?)"
        ).bind(payload.url, payload.receiptno, payload.expedition, 1).run();

        return Boolean(data.meta.rows_written && data.meta.last_row_id);
    } catch {
        return false;
    }
}