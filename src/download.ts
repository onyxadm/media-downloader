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
  private readonly chunkSize: number;

  constructor(n: number, chunkSize = 64 * 1024) {
    super();
    this.n = n;
    this.buffer = Buffer.alloc(0);
    this.chunkSize = chunkSize;
  }

  _transform(chunk: Buffer, _: string, callback: (error?: Error) => void): void {
    if (this.buffer.length + chunk.length > this.chunkSize) {
      const remainingSpace = this.chunkSize - this.buffer.length;
      const firstPart = chunk.slice(0, remainingSpace);
      const secondPart = chunk.slice(remainingSpace);

      this.buffer = Buffer.concat([this.buffer, firstPart]);
      this.push(this.buffer);
      this.buffer = secondPart;
    } else {
      this.buffer = Buffer.concat([this.buffer, chunk]);
    }
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
  documentWithCaptionMessage: 'document',
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

  let media;
  if (typeKey === 'documentWithCaptionMessage') {
    media = messageContent.documentWithCaptionMessage?.message?.documentMessage;
  } else {
    media = messageContent[typeKey];
  }
  if (!media) throw new Error('Media not found in payload.');

  if (!media) {
    throw new Error('Media not found in payload.');
  }

  const mediaType = MEDIA_TYPES[typeKey];
  const url = media?.url ?? media?.URL;
  const mediaKeyBase64 = media.mediaKey;
  const rawMime = media.mimetype || 'application/octet-stream';
  const cleanMime = rawMime.split(';')[0].trim();
  const extension = cleanMime.split('/')[1] || 'bin';
  const rawFileName = media.fileName?.split(';')[0].trim();
  const fileName = rawFileName ?? `media_${Date.now()}.${extension}`;
  const outputPath = join(outputDir, fileName);

  const info = INFO_MAP[mediaType];
  const mediaKey = Buffer.from(mediaKeyBase64, 'base64');
  const expandedKey = hkdf(mediaKey, 112, Buffer.from(info));
  const iv = expandedKey.slice(0, 16);
  const key = expandedKey.slice(16, 48);

  mkdirSync(outputDir, { recursive: true });

  const decipher = createDecipheriv('aes-256-cbc', key, iv);
  decipher.setAutoPadding(true);

  let downloadedBytes = 0;
  let totalBytes = 0;

  await new Promise<void>((resolve, reject) => {
    if (!url) {
      reject(new Error('URL not found in payload.'));
      return;
    }

    get(url, async res => {
      try {
        totalBytes = parseInt(res.headers['content-length'] || '0', 10);

        const progressStream = new Transform({
          transform(chunk: Buffer, _: string, callback: (error?: Error | null, data?: Buffer) => void): void {
            downloadedBytes += chunk.length;
            const progress = totalBytes ? (downloadedBytes / totalBytes * 100).toFixed(2) : 'unknown';
            process.stdout.write(`\rDownloading: ${progress}%`);
            callback(null, chunk);
          }
        });

        await pipe(
          res,
          progressStream,
          new RemoveLastNBytes(10),
          decipher,
          createWriteStream(outputPath)
        );

        process.stdout.write('\n');
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
    mimeType: rawMime,
    fileName,
  };
}
