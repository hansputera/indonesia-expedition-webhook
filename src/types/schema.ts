export type Webhook = {
    /**
     * Webhook primary key (ID)
     */
    id: number;
    /**
     * Webhook URL
     */
    url: string;
    /**
     * Webhook expedition
     */
    expedition: string;
    /**
     * Webhook receipt number
     */
    receiptno: string;

    /**
     * Webhook is active?
     */
    isactive: number;
    /**
     * Last hash update
     */
    lasthash?: string;
}