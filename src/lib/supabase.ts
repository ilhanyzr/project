import { createClient } from '@supabase/supabase-js';

// Ortam değişkenlerini al
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ortam değişkenlerini doğrula
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase bağlantı bilgileri eksik. Lütfen projeyi kurmak için "Connect to Supabase" butonuna tıklayın.'
  );
}

// Supabase istemcisini oluştur ve dışa aktar
export const supabase = createClient(supabaseUrl, supabaseKey);