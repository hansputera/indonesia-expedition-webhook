import { type } from 'arktype';

export const webhookArk = type({
    url: 'URL',
    expedition: 'string.upper',
    receiptno: 'string'
});
