import { ExpeditionAbstract } from "../abstracts/expedition-abstract";
import type { ExpeditionResult } from "../types/abstracts";
import type { CloudflareEnv } from "../types/env";
import { Webhook } from "../types/schema";

export class ExpeditionManager
{
    /**
     * Expedition Maps
     */
    protected expeditions: Map<string, ExpeditionAbstract> = new Map();

    constructor(protected env: CloudflareEnv) {}

    /**
     * Register new expedition to maps
     * @param name Expedition Name
     * @param expedition Expedition Instance
     * @return {void}
     */
    public register(name: string, expedition: ExpeditionAbstract): void
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
     * @return {Promise<ExpeditionResult | undefined>}
     */
    public async fetch(name: string, receiptNo: string): Promise<ExpeditionResult | undefined>
    {
        const expedition = this.expeditions.get(name);
        if (expedition?.isMaintenance)
        {
            return undefined;
        }

        return expedition?.fetch(receiptNo);
    }

    public async dumpAllWebhook(): Promise<Array<Webhook>>
    {
        const data = await this.env.DB.prepare('SELECT * FROM webhooks WHERE isactive = 1').bind().run<Webhook>();
        return data.results;
    }
}