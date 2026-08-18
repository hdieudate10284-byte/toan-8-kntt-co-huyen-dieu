import { createClient } from '@supabase/supabase-js';

// Cấu hình Supabase mặc định của dự án Toán 8 KNTT - THCS Nguyễn Huệ
const DEFAULT_SUPABASE_URL = 'https://whspyfegvnkpnhquovnh.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indoc3B5ZmVndm5rcG5ocXVvdm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYzNjk5MDgsImV4cCI6MjEwMTk0NTkwOH0.RaGR9KBnyQxZw4Uw84pd4K6JC1JL363DnZxcAmxUyLI';

// Đọc cấu hình từ biến môi trường hoặc dùng mặc định đã cấu hình sẵn
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Kiểm tra trạng thái cấu hình
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Khởi tạo Supabase client chính thức
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

/**
 * Hàm hỗ trợ tải file lên Supabase Storage
 * @param {string} bucketName - Tên bucket ('materials', 'game-packages', 'avatars')
 * @param {string} path - Đường dẫn lưu trữ trong bucket
 * @param {File} file - Đối tượng File từ input
 */
export async function uploadToStorage(bucketName, path, file) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase chưa được cấu hình. Sử dụng link tạm thời.');
    return URL.createObjectURL(file);
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    throw error;
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
