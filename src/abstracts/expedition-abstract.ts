import axios from 'axios';
import { ExpeditionResult } from '../types/abstracts';

/**
 * @class ExpeditionAbstract
 * Create expedition class template
 */
export abstract class ExpeditionAbstract
{
    /**
     * @constructor Expedition Constructor
     * @param url Expedition API Base URL
     * @param isMaintenance Identify the service can be used or no
     */
    constructor(protected url: string, public isMaintenance: boolean) {}

    /**
     * Expedition HTTP Client using Axios
     */
    protected $http = axios.create({
        baseURL: this.url,
    });

    /**
     * Fetch receipt number from expedition service
     * @param receiptNumber Expedition receipt number (e.g. SPX0000000)
     * @return {Promise<ExpeditionResult | undefined>} Return promised of expedition results or undefined if the receipt doesnt exist
     */
    public abstract fetch(receiptNumber: string): Promise<ExpeditionResult | undefined>;
}