import { createCipheriv, randomBytes, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';

export async function encryptText(text: string): Promise<string> {
  const algorithm = 'aes-256-ctr';
  const prefix = process.env.NODE_ENV.toUpperCase();
  const password = process.env[`HEDERA_${prefix}_PRIVATE_KEY`];
  const iv = randomBytes(16);
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const cipher = createCipheriv(algorithm, key, iv);

  const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
}

export async function decryptText(encryptedText: string): Promise<string> {
  const algorithm = 'aes-256-ctr';
  const prefix = process.env.NODE_ENV.toUpperCase();
  const password = process.env[`HEDERA_${prefix}_PRIVATE_KEY`];
  const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift() as string, 'hex');
  const encryptedData = Buffer.from(textParts.join(':'), 'hex');

  const decipher = createDecipheriv(algorithm, key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return decryptedText.toString();
}
