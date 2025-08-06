import axios from "axios";

export const sentWebhook = async <T>(url: string, message: T) => {
    try {
        const response = await axios.post(url, message, {
            headers: {
                'X-Time': Date.now().toString(),
            },
        });

        return response.status === 200;
    } catch {
        return false;
    }
}