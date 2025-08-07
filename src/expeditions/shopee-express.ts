import { type } from "arktype";
import { ExpeditionAbstract } from "../abstracts/expedition-abstract";
import { webhookArk } from "../api/arks/webhook-ark";
import type { ExpeditionResult } from "../types/abstracts";

export class ShopeeExpressSPX extends ExpeditionAbstract
{
    /**
     * Initialize Shopee Express (SPX) expedition service
     */
    constructor()
    {
        super('https://spx.co.id', false);
    }

    public async fetch(receiptNumber: string): Promise<ExpeditionResult | undefined> {
        try {
            const response = await this.$http.get('/shipment/order/open/order/get_order_info', {
                params: new URLSearchParams({
                    'spx_tn': receiptNumber,
                    'language_code': 'id',
                }),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                }
            });

            const retcode = response.data.retcode; // Return code from SPX

            // Check if retcode not equals 0, we return undefined (assuming there's no exist record with requested receipt number)
            if (retcode !== 0 || !response.data.data)
            {
                return undefined;
            }

            const spxRecords = response.data.data?.sls_tracking_info?.records;
            // What if sls_tracking_info.records is not array or undefined
            if (!Array.isArray(spxRecords))
            {
                return undefined;
            }

            return {
                expedition: 'Shopee Express',
                records: spxRecords.map(record => ({
                    destination: record.current_location?.location_name?.length ?
                        record.current_location.location_name : record.description,
                    time: record.actual_time,
                    next: record.next_location?.location_name?.length ? {
                        destination: record.next_location.location_name,
                        time: record.actual_time,
                    } : undefined,
                    description: record.description,
                })),
            }
        } catch {
            // Assume the order doesnt exist on SPX database
            return undefined;
        }
    }

    public async validate<T>(data: T): Promise<string | undefined> {
        const results = webhookArk(data);
        if (results instanceof type.errors)
        {
            return results.summary;
        }

        return undefined;
    }
}