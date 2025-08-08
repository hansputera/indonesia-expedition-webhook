import type { ExpeditionAbstract } from "./abstracts/expedition-abstract";
import type { webhookArk } from "./api/arks/webhook-ark";
import { JetExpress } from "./expeditions/jet-express";
import { ShopeeExpressSPX } from "./expeditions/shopee-express";

export const expeditions: Array<[string, ExpeditionAbstract<typeof webhookArk.infer>]> = [
    ['SPX', new ShopeeExpressSPX],
    ['JNT', new JetExpress],
];
