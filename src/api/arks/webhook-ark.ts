import { type } from 'arktype';

export const webhookArk = type({
    url: 'string.url',
    expedition: 'string.upper',
    receiptno: 'string'
});
