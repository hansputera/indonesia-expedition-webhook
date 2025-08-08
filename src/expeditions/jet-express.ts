import { type } from "arktype";
import { ExpeditionAbstract } from "../abstracts/expedition-abstract";
import { jetValidatorWebhookArk, webhookArk } from "../api/arks/webhook-ark";
import { ExpeditionResult } from "../types/abstracts";

export class JetExpress extends ExpeditionAbstract<typeof jetValidatorWebhookArk.infer>
{
    protected jetValidator = type({
        '...': webhookArk,
        waybill: 'string.numeric',
    });

    constructor()
    {
        super('https://jet.co.id', false);
    }

    public async fetch(receiptNumber: string, data: typeof jetValidatorWebhookArk.infer): Promise<ExpeditionResult | undefined> {
        try {
            const response = await this.$http.postForm('/index/router/index.html', {
                'method': 'query/findTrack',
                'data[billcode]': receiptNumber,
                'data[lang]': 'en',
                'data[phone]': data.phone,
                'data[type]': 1,
                'pId': '396996ecbe4f9b61247c3bcaaa2d67e6',
                'pst': 'ad6d306ce108f31c6643683d636b7085',
            });

            const responseData = JSON.parse(response.data);
            if (responseData.code !== 20000 || !responseData.data?.length || !Array.isArray(responseData.data))
            {
                return undefined;
            }

            const records = responseData.data[0]?.details;
            if (!Array.isArray(records))
            {
                return undefined;
            }

            return {
                expedition: 'JNT',
                records: records.map(r => ({
                    description: r.customerTracking,
                    destination: `${r.scanNetworkName} ${r.scanNetworkCity} ${r.scanNetworkProvince}`,
                    time: Date.parse(r.scanTime),
                    next: r.nextStopName ? {
                        destination: r.nextStopName,
                        time: Date.parse(r.scanTime),
                    } : undefined,
                    contact: {
                        name: r.staffName,
                        phone: r.staffContact,
                    },
                })),
            }
        } catch {
            return undefined;
        }
    }

    public async validate<T>(data: T): Promise<string | undefined> {
        const results = this.jetValidator(data);
        if (results instanceof type.errors)
        {
            return results.summary;
        }

        return undefined;
    }
}