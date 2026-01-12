export async function verifySignature(data: string | ArrayBuffer, signature: ArrayBuffer, publicKey: CryptoKey): Promise<boolean> {
    const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const verified = await crypto.subtle.verify(
      { name: 'RSA-PSS', saltLength: 32 },
      publicKey,
      signature,
      buffer
    );

    return verified;
}

export async function importSigningPublicKey(jwkString: string): Promise<CryptoKey> {
  const jwk = JSON.parse(jwkString);
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-PSS",
      hash: "SHA-256",
    },
    true,        // extractable
    ["verify"]   // PSS public keys are used for signature verification
  );
}