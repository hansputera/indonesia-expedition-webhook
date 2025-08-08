import { ExpeditionAbstract } from "../abstracts/expedition-abstract";
import { webhookArk } from "../api/arks/webhook-ark";
import type { ExpeditionResult } from "../types/abstracts";
import type { CloudflareEnv } from "../types/env";
import { Webhook } from "../types/schema";

export class ExpeditionManager
{
    /**
     * Expedition Maps
     */
    protected expeditions: Map<string, ExpeditionAbstract<typeof webhookArk.infer>> = new Map();

    constructor(protected env: CloudflareEnv) {}

    /**
     * Register new expedition to maps
     * @param name Expedition Name
     * @param expedition Expedition Instance
     * @return {void}
     */
    public register(name: string, expedition: ExpeditionAbstract<typeof webhookArk.infer>): void
    {
        if (this.expeditions.has(name))
        {
            throw new Error(`Expedition ${name} already exists`);
        }

        this.expeditions.set(name, expedition);
    }

    /**
     * Fetch expedition service
     * @param name Expedition name
     * @param receiptNo Expedition receipt number
     * @param args Expedition additional args
     * @return {Promise<ExpeditionResult | undefined>}
     */
    public async fetch(name: string, receiptNo: string, args: typeof webhookArk.infer): Promise<ExpeditionResult | undefined>
    {
        const expedition = this.expeditions.get(name);
        if (expedition?.isMaintenance)
        {
            return undefined;
        }

        return expedition?.fetch(receiptNo, args);
    }

    /**
     * Validate requested payload with specified expedition service
     * @param name Expedition service name (e.g. SPX, JNT, or FirstLogistic)
     * @param data Requested payload want to validate (in object)
     * @return {Promise<string | undefined>} Return summaries of ArkError or undefined if it's valid condition
     */
    public async validatePayload<T>(name: string, data: T): Promise<string | undefined>
    {
        const expedition = this.expeditions.get(name);
        if (expedition?.isMaintenance)
        {
            return undefined;
        }

        return expedition?.validate(data);
    }

    public async dumpAllWebhook(): Promise<Array<Webhook>>
    {
        const data = await this.env.DB.prepare('SELECT * FROM webhooks WHERE isactive = 1').bind().run<Webhook>();
        return data.results;
    }
}