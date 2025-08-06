import { handleApi } from "./api/api-handler";
import { removeWebhook } from "./business/removeWebhook";
import { sentWebhook } from "./business/sentWebhook";
import { expeditions } from "./expeditions";
import { ExpeditionManager } from "./managers/expedition-manager";
import { CloudflareEnv } from "./types/env";
import { sha256Hash } from "./utils/sha256-hash";

export default {
	async fetch(req, env) {
		return handleApi(req, env);
	},

	async scheduled(event, env, ctx): Promise<void> {
		const expeditionManager = new ExpeditionManager(env);
		for (const expedition of expeditions)
		{
			expeditionManager.register(expedition[0], expedition[1]);
		}

		const webhooks = await expeditionManager.dumpAllWebhook();
		for (const webhook of webhooks)
		{
			const result = await expeditionManager.fetch(webhook.expedition, webhook.receiptno);
			if (!result) {
				console.log(`Webhook ${webhook.url} removed, because we cant fetch the expedition number`);
				await removeWebhook(env, webhook.id);
			} else {
				const resultHash = await sha256Hash(result);
				if (resultHash !== webhook.lasthash)
				{
					console.log(`Webhook ${webhook.url} sent new update`);
					await sentWebhook(webhook.url, result);
				}
			}
		}
	},
} satisfies ExportedHandler<CloudflareEnv>;
