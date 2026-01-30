import { createClient } from '@supabase/supabase-js';
import { CONFIG } from './config';

// Initialize Supabase client with service role key for admin operations
export const supabase = createClient(
  CONFIG.supabase.url,
  CONFIG.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Upload a file to Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The path within the bucket
 * @param file - The file buffer to upload
 * @param contentType - MIME type of the file
 * @returns The public URL of the uploaded file
 */
export async function uploadToStorage(
  bucket: string,
  path: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a file from Supabase Storage
 * @param bucket - The storage bucket name
 * @param path - The path within the bucket
 */
export async function deleteFromStorage(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
