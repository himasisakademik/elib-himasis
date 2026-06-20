export function hasVercelBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export const blobMissingMessage =
  "Connect a Vercel Blob store to this project or add BLOB_READ_WRITE_TOKEN.";
