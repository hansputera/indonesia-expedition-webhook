export const sha256Hash = async <T>(data: T): Promise<string> => {
    const jsonEncoded = JSON.stringify(data);

    const msgUint8 = new TextEncoder().encode(jsonEncoded);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(
        (b) => b.toString(16).padStart(2, '0')
    ).join('');


    return hashHex;
}
