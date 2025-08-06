import type { ExpeditionAbstract } from "./abstracts/expedition-abstract";
import { ShopeeExpressSPX } from "./expeditions/shopee-express";

export const expeditions: Array<[string, ExpeditionAbstract]> = [
    ['SPX', new ShopeeExpressSPX],
];
