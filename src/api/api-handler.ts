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
        if (url.pathname.startsWith('/webhooks') && req.method === 'POST')
        {
            const cleanPathnameWithoutWebhook = url.pathname.replace(/\/webhooks(\/)?/gi, '').trim();

            const data = jsonParse(await req.text());
            if (data instanceof type.errors)
            {
                return Response.json({
                    error: data.summary,
                }, {
                    status: 400,
                });
            }

            const payloadError = await expeditionManager.validatePayload(cleanPathnameWithoutWebhook, data);
            if (payloadError)
            {
                return Response.json({
                    error: payloadError,
                }, {
                    status: 400,
                });
            }

            const successfulyAddedWebhook = await addWebhook(env, data as typeof webhookArk.infer);
            return Response.json({
                data: {
                    success: successfulyAddedWebhook,
                    payload: data,
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