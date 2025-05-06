import { createDecipheriv, hkdfSync } from 'crypto';
import { createWriteStream, mkdirSync } from 'fs';
import { get } from 'https';
import { join } from 'path';
import { Transform, pipeline } from 'stream';
import { promisify } from 'util';
import { WhatsAppPayload, MediaType, DecryptionResult } from './types';

const pipe = promisify(pipeline);

function hkdf(mediaKey: Buffer, length: number, info: Buffer): Buffer {
  const salt = Buffer.alloc(32, 0);
  return Buffer.from(hkdfSync('sha256', mediaKey, salt, info, length));
}

class RemoveLastNBytes extends Transform {
  private buffer: Buffer;
  private readonly n: number;

  constructor(n: number) {
    super();
    this.n = n;
    this.buffer = Buffer.alloc(0);
  }

  _transform(chunk: Buffer, _: string, callback: (error?: Error) => void): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    callback();
  }

  _flush(callback: (error?: Error) => void): void {
    if (this.buffer.length <= this.n) {
      return callback(new Error('File too small to remove MAC'));
    }
    const cleanData = this.buffer.slice(0, this.buffer.length - this.n);
    this.push(cleanData);
    callback();
  }
}

const MEDIA_TYPES: Record<string, MediaType> = {
  audioMessage: 'audio',
  imageMessage: 'image',
  videoMessage: 'video',
  documentMessage: 'document',
  stickerMessage: 'sticker',
} as const;

const INFO_MAP: Record<MediaType, string> = {
  audio: 'WhatsApp Audio Keys',
  image: 'WhatsApp Image Keys',
  video: 'WhatsApp Video Keys',
  document: 'WhatsApp Document Keys',
  sticker: 'WhatsApp Image Keys',
} as const;

export async function decryptWhatsAppMedia(
  payload: WhatsAppPayload,
  outputDir = 'output'
): Promise<DecryptionResult> {
  const messageContent = payload.message;
  const typeKey = Object.keys(messageContent).find(
    k => MEDIA_TYPES[k]
  ) as keyof WhatsAppPayload['message'];

  if (!typeKey) {
    throw new Error('Unsupported or missing media type.');
  }

  const media = messageContent[typeKey];

  if (!media) {
    throw new Error('Media not found in payload.');
  }

  const mediaType = MEDIA_TYPES[typeKey];
  const url = media.url;
  const mediaKeyBase64 = media.mediaKey;
  const mime = media.mimetype || 'application/octet-stream';
  const extension = mime.split('/')[1] || 'bin';
  const fileName = media.fileName || `media_${Date.now()}.${extension}`;
  const outputPath = join(outputDir, fileName);

  const info = INFO_MAP[mediaType];
  const mediaKey = Buffer.from(mediaKeyBase64, 'base64');
  const expandedKey = hkdf(mediaKey, 112, Buffer.from(info));
  const iv = expandedKey.slice(0, 16);
  const key = expandedKey.slice(16, 48);

  mkdirSync(outputDir, { recursive: true });

  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  decipher.setAutoPadding(true);

  await new Promise<void>((resolve, reject) => {
    get(url, async res => {
      try {
        await pipe(res, new RemoveLastNBytes(10), decipher, createWriteStream(outputPath));
        resolve();
      } catch (err) {
        console.error('❌ Pipeline error:', err);
        reject(err);
      }
    }).on('error', reject);
  });

  return {
    outputPath,
    mediaType,
    mimeType: mime,
    fileName,
  };
}
