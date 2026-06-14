import { adminStorage } from './firebase-admin';

export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB

export class UploadTooLargeError extends Error {
  constructor(public sizeBytes: number) {
    super(`El archivo supera el máximo permitido de 50 MB.`);
    this.name = 'UploadTooLargeError';
  }
}

export async function uploadMedia(
  bucketStr: string, // Kept to be somewhat compatible, but we can prepend it to the path
  file: File,
  path: string
): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadTooLargeError(file.size);
  }

  if (!adminStorage) {
    throw new Error("Storage not initialized");
  }

  const bucket = adminStorage.bucket();
  // We prepend bucketStr to act as a folder
  const fullPath = `${bucketStr}/${path}`;
  const fileRef = bucket.file(fullPath);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fileRef.save(buffer, {
    metadata: {
      contentType: file.type,
    },
    // Make file public
    public: true,
  });

  return getPublicUrl(bucketStr, path);
}

export async function deleteMedia(
  bucketStr: string,
  path: string
): Promise<void> {
  if (!adminStorage) throw new Error("Storage not initialized");
  const bucket = adminStorage.bucket();
  const fullPath = `${bucketStr}/${path}`;
  const fileRef = bucket.file(fullPath);
  
  try {
    await fileRef.delete();
  } catch (err) {
    console.error("Delete media failed:", err);
  }
}

export function getPublicUrl(
  bucketStr: string,
  path: string
): string {
  if (!adminStorage) return '';
  const bucket = adminStorage.bucket();
  const fullPath = `${bucketStr}/${path}`;
  
  // Since we made it public, we can construct the Google Cloud Storage public URL
  // Format: https://storage.googleapis.com/[BUCKET_NAME]/[OBJECT_NAME]
  return `https://storage.googleapis.com/${bucket.name}/${fullPath}`;
}

export function generateStoragePath(fileName: string): string {
  const ext = fileName.split('.').pop() ?? 'bin';
  const uuid = crypto.randomUUID();
  return `${uuid}.${ext}`;
}
