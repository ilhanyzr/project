# PC Sales Website

Bu proje, PC bileşenleri satışı için geliştirilmiş bir e-ticaret web sitesidir.

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <proje-url>
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. `.env.example` dosyasını `.env` olarak kopyalayın:
```bash
cp .env.example .env
```

4. `.env` dosyasını Supabase bilgilerinizle güncelleyin:
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## Güvenlik

- `.env` dosyası asla GitHub'a push edilmemelidir
- Tüm hassas bilgiler `.env` dosyasında saklanmalıdır
- Supabase anahtarları ve diğer hassas bilgiler güvenli bir şekilde saklanmalıdır

## Veritabanı Güvenliği

- Row Level Security (RLS) aktif
- Audit logging sistemi mevcut
- Rate limiting uygulanmış
- Input validation kontrolleri mevcut

## Admin Paneli

Admin paneline erişim sadece admin@example.com hesabı ile mümkündür.