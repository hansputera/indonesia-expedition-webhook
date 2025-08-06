import { type } from "arktype";
import { jsonParse } from "../utils/json-parse";
import { webhookArk } from "./arks/webhook-ark";
import { CloudflareEnv } from "../types/env";
import { addWebhook } from "../business/addWebhook";
import { ExpeditionManager } from "../managers/expedition-manager";
import { expeditions } from "../expeditions";

export const handleApi = async (req: Request<unknown, IncomingRequestCfProperties<unknown>>, env: CloudflareEnv): Promise<Response> => {
    try {
        const expeditionManager = new ExpeditionManager(env);
        for (const expedition of expeditions)
        {
            expeditionManager.register(expedition[0], expedition[1]);
        }

        const url = new URL(req.url);

        if (url.pathname === '/webhooks' && req.method === 'POST')
        {
            const data = jsonParse(await req.json());
            if (data instanceof type.errors)
            {
                return Response.json({
                    error: data.summary,
                }, {
                    status: 400,
                });
            }

            const payload = webhookArk(data);
            if (payload instanceof type.errors)
            {
                return Response.json({
                    error: payload.summary,
                }, {
                    status: 400,
                });
            }

            const successfulyAddedWebhook = await addWebhook(env, payload);
            return Response.json({
                data: {
                    success: successfulyAddedWebhook,
                    payload,
                },
            });
        }
        
        const data = await expeditionManager.dumpAllWebhook();

        return Response.json({
            data,
        });
    } catch (e) {
        return Response.json({
            error: (e as Error).message,
        }, {
            status: 500,
        });
    }
}