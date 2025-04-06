# PC Sales Website

Modern e-ticaret çözümü sunan, bilgisayar ve donanım satışı yapan web sitesi projesi.

## 🚀 Özellikler

### 🔐 Kullanıcı Sistemi
- JWT tabanlı kimlik doğrulama
- Email/şifre ile kayıt ve giriş
- Profil yönetimi (isim, telefon, adres)
- Güvenli oturum yönetimi

### 🛍️ Ürün Yönetimi
- Kategorilere göre ürün listeleme
- Detaylı ürün sayfaları
- Gelişmiş arama sistemi
- Stok takibi
- Ürün değerlendirme sistemi

### 🛒 Sepet Sistemi
- Ürün ekleme/çıkarma
- Miktar güncelleme
- Toplam fiyat hesaplama
- Oturum boyunca sepet bilgisini saklama

### 👤 Kullanıcı Profili
- Kişisel bilgi yönetimi
- Sipariş geçmişi görüntüleme
- Ürün değerlendirmeleri
- Adres yönetimi

### 👨‍💼 Admin Paneli
- Ürün ekleme/düzenleme/silme
- Stok yönetimi
- Sipariş takibi
- Denetim günlükleri

### 🔍 Arama Sistemi
- Anlık arama önerileri
- Kategori bazlı filtreleme
- Detaylı ürün arama

## 🛠️ Teknoloji Stack

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- Lucide React (Icons)
- React Router

### Backend
- Supabase (Backend as a Service)
- PostgreSQL Veritabanı
- Row Level Security (RLS)
- Edge Functions

### Güvenlik
- JWT Authentication
- Row Level Security (RLS)
- Audit Logging
- Input Validation

## 📦 Veritabanı Yapısı

### Tablolar
1. **products**
   - Ürün bilgileri
   - Stok durumu
   - Fiyatlandırma
   - Kategori bilgisi

2. **profiles**
   - Kullanıcı profilleri
   - İletişim bilgileri
   - Adres bilgileri

3. **orders**
   - Sipariş bilgileri
   - Ödeme durumu
   - Kargo bilgileri

4. **reviews**
   - Ürün değerlendirmeleri
   - Puanlamalar
   - Kullanıcı yorumları

5. **audit_logs**
   - Sistem günlükleri
   - Değişiklik takibi
   - Güvenlik kayıtları

## 🚀 Kurulum

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
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🔒 Güvenlik Önlemleri

- `.env` dosyası asla GitHub'a push edilmemelidir
- Tüm hassas bilgiler `.env` dosyasında saklanmalıdır
- Row Level Security (RLS) tüm tablolarda aktiftir
- Audit logging sistemi mevcuttur
- Rate limiting uygulanmıştır
- Input validation kontrolleri mevcuttur

## 👨‍💼 Admin Erişimi

Admin paneline erişim sadece admin@example.com hesabı ile mümkündür.

## 🔜 Gelecek Özellikler

### Özellikler
- Gelişmiş arama sistemi
- Ürün karşılaştırma
- Favori listesi
- Kupon sistemi
- Çoklu dil desteği
- Bildirim sistemi

### Teknik İyileştirmeler
- Performance optimizasyonu
- SEO geliştirmeleri
- Mobile app desteği
- Analytics entegrasyonu
- Ödeme sistemi entegrasyonu
- Kargo takip sistemi

## 📝 Proje Yönetimi

- Git ile versiyon kontrolü
- Düzenli yedekleme
- Otomatik testler
- CI/CD pipeline

## 🤝 Katkıda Bulunma

1. Fork'layın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.