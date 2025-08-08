import { type } from 'arktype';

export const webhookArk = type({
    url: 'string.url',
    expedition: 'string.upper',
    receiptno: 'string'
});

export const jetValidatorWebhookArk = type({
    '...': webhookArk,
    phone: 'string.numeric',
});
