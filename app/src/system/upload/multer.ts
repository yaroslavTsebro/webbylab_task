import multer, { MulterError } from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { Request } from 'express';

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}

const uploadDir = path.join(process.cwd(), 'uploads', 'movies');

function generateFilename(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    now.getFullYear().toString() +
    pad(now.getMonth() + 1) +
    pad(now.getDate()) +
    pad(now.getHours()) +
    pad(now.getMinutes()) +
    pad(now.getSeconds()) +
    '.txt'
  );
}

function isTxtFile(file: Express.Multer.File): boolean {
  const ext = path.extname(file.originalname).toLowerCase();
  return ext === '.txt' || file.mimetype === 'text/plain';
}

const customStorage: multer.StorageEngine = {
  _handleFile(req: Request, file, cb) {
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filename = generateFilename();
      const filepath = path.join(uploadDir, filename);
      const outStream = fs.createWriteStream(filepath);

      file.stream.pipe(outStream);

      streamToBuffer(file.stream)
        .then((buffer) => {
          outStream.on('finish', () => {
            cb(null, {
              destination: uploadDir,
              filename,
              path: filepath,
              size: buffer.length,
              buffer,
            });
          });
        })
        .catch(err => cb(err as Error));
    } catch (err) {
      cb(err as Error);
    }
  },

  _removeFile(_req, file, cb) {
    fs.unlink(file.path, cb);
  },
};

export const uploadMoviesFile = multer({
  storage: customStorage,
  fileFilter: (req, file, cb) => {
    if (isTxtFile(file)) {
      cb(null, true);
    } else {
      cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'file'));
    }
  },
  limits: {
    fileSize: 512 * 1024,
    files: 1,
  },
});
