# media-downloader

A simple library to decrypt and download WhatsApp media files directly from message payloads.

## Installation

```bash
npm install @w3nder/media-downloader
```

## Usage

```javascript
import { decryptWhatsAppMedia } from '@w3nder/media-downloader';

// Example with a document message
const payload = {
  message: {
    documentMessage: {
      url: "https://mmg.whatsapp.net/...",
      mimetype: "application/pdf",
      mediaKey: "base64EncodedKey...",
      fileName: "document.pdf"
    }
  }
};

async function downloadMedia() {
  try {
    const result = await decryptWhatsAppMedia(payload, 'downloads');
    console.log('File saved at:', result.outputPath);
  } catch (error) {
    console.error('Error downloading media:', error);
  }
}
```

## Running the Example

The package includes an example that demonstrates how to download different types of WhatsApp media (documents, images, videos).

1. Clone the repository:
```bash
git clone https://github.com/w3nder/media-downloader.git
cd wa-download
```

2. Install dependencies:
```bash
npm install
```

3. Update the media keys in `examples/download-media.ts` with your WhatsApp message data.

4. Run the example:
```bash
npm run example
```

The example will attempt to download different types of media and save them to the `downloads` directory.

## Supported Media Types

- Audio Messages
- Images
- Videos
- Documents
- Stickers

## API

### decryptWhatsAppMedia(payload, outputDir?)

Decrypts and saves WhatsApp media.

#### Parameters

- `payload`: Message payload containing media information
- `outputDir`: Directory to save the file (default: 'output')

#### Returns

```javascript
{
  outputPath: string,    // Path where the file was saved
  mediaType: string,     // Type of media (audio, image, video, document, sticker)
  mimeType: string,      // File MIME type
  fileName: string       // Name of the saved file
}
```

## License

MIT 