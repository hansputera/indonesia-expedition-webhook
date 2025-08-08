import { CloudflareEnv } from "../types/env";
import { webhookArk } from "../api/arks/webhook-ark";
import { sentWebhook } from "./sentWebhook";

export const addWebhook = async (env: CloudflareEnv, payload: typeof webhookArk.infer) => {
    try {
        // Check if webhook.url is accessable
        const sentWebhookTested = await sentWebhook(payload.url, JSON.stringify({ message: 'Testing' }));
        if (!sentWebhookTested)
        {
            return false;
        }
        
        // Copy payload
        const payloadSaved = payload;

        // Looping webhookArk properties to cleanup properties from webhookArk
        for (const webhookArkProp of Object.keys(webhookArk.toJSON())) {
            if (typeof webhookArkProp === 'string')
            {
                Reflect.deleteProperty(payloadSaved, webhookArkProp);
            }
        }

        const data = await env.DB.prepare(
            "INSERT INTO webhooks (url, receiptno, expedition, isactive, additionalargs) VALUES (?, ?, ?, ?, ?)"
        ).bind(payload.url, payload.receiptno, payload.expedition, 1, JSON.stringify(payloadSaved)).run();

        return Boolean(data.meta.rows_written && data.meta.last_row_id);
    } catch {
        return false;
    }
}