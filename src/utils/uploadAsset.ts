import { supabase } from '../supabase';

interface UploadResponse {
  publicAssetUrl: string;
  error?: string;
}

/**
 * Uploads a file securely to Cloudflare R2 via a Supabase Edge Function pre-signed URL
 */
export async function uploadAsset(file: File): Promise<UploadResponse> {
  try {
    // 1. Request a secure single-use upload link from your backend edge function
    const { data, error: functionError } = await supabase.functions.invoke('get-upload-url', {
      body: { 
        fileName: file.name, 
        fileType: file.type 
      }
    });

    if (functionError || !data?.uploadUrl) {
      return { publicAssetUrl: '', error: functionError?.message || 'Failed to get secure upload URL' };
    }

    // 2. Upload the file directly to Cloudflare R2 using the standard browser fetch API
    const uploadResponse = await fetch(data.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file
    });

    if (!uploadResponse.ok) {
      return { publicAssetUrl: '', error: 'Secure asset upload to storage failed.' };
    }

    // 3. Return the clean, permanent public URL to save into your Postgres tables
    return { publicAssetUrl: data.publicAssetUrl };

  } catch (err: any) {
    return { publicAssetUrl: '', error: err.message || 'An unexpected error occurred during upload.' };
  }
}