export async function generateRSAKeys(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }> {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
    );

    return { publicKey: keyPair.publicKey, privateKey: keyPair.privateKey };
}

export async function generateRSASigningKeys(): Promise<{ publicKey: CryptoKey; privateKey: CryptoKey }> {
    return crypto.subtle.generateKey(
        {
            name: 'RSA-PSS',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: 'SHA-256',
        },
        true,
        ['sign', 'verify']
    );
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const jwk = await crypto.subtle.exportKey("jwk", key);
  return JSON.stringify(jwk);
}
