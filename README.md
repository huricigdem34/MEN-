# Kurulum

Bu zip tam bir Vite projesi — doğrudan bu klasörde çalıştır.

```bash
cd menu-admin
npm install
cp .env.example .env
```

**Windows kullanıcıları:** `.env` dosyasını Not Defteri veya sağ-tık > Yeni > Metin Belgesi ile oluşturursan büyük ihtimalle `.env.txt` olarak kaydedilir. Terminalde `dir /a` ile gerçekten `.env` (uzantısız) olduğunu doğrula. Şüpheliysen doğrudan terminalden oluştur:
```powershell
echo VITE_SUPABASE_URL=https://xxxx.supabase.co > .env
echo VITE_SUPABASE_ANON_KEY=eyJ... >> .env
```

`.env` dosyasını aç, kendi Supabase proje URL ve anon key'ini gir (Supabase Dashboard > Project Settings > API).

## Veritabanı kurulumu (SIRAYLA çalıştır)

Supabase SQL Editor'de şu dosyaları **sırayla** çalıştır:

1. **`supabase_schema.sql`** — temel şema (menu_items tablosu, RLS, storage bucket)
2. **`supabase_migration_002.sql`** — kalori, içindekiler, şef notu kolonlarını ekler
3. **`menu_seed.sql`** — orijinal statik menünden otomatik çıkarılan 231 ürünü aktarır
4. **`supabase_migration_003.sql`** — **kategoriler tablosunu oluşturur** (25 kategoriyi doğru sırayla ekler) ve kullanılmayan `category_image_url` kolonunu siler
5. **`supabase_migration_004.sql`** — "Popüler Ürünler" özelliği için `is_featured` kolonunu ekler
6. **`supabase_migration_005.sql`** — kategori grupları (`group_name`) için kolon ekler ve 25 kategoriye varsayılan grup atar (Mezeler & Aperatifler / Ana Yemekler / İçecekler)
7. **`supabase_migration_006.sql`** — soft-delete (çöp kutusu), site ayarları tablosu (WiFi/rezervasyon), İngilizce çeviri kolonları
8. **`supabase_migration_007_translations.sql`** — **231 ürünün ve 25 kategorinin İngilizce çevirilerini** doldurur

**Zaten 1-5'i çalıştırdıysan** sadece 6, 7 ve 8'i çalıştırman yeterli.

Supabase Dashboard > Authentication > Users > Add User ile owner hesabını manuel oluştur (sign-up ekranı yok, bilinçli olarak — Auto Confirm User'ı işaretle).

```bash
npm run dev
```

- **`http://localhost:5173/`** → Halka açık dinamik menü (sadece `is_available = true` ürünler)
- **`http://localhost:5173/sistem/login`** → Yönetici paneli girişi (eski `/admin/login` de otomatik buraya yönlenir)

## Migration notları (menu_seed.sql)

`migrate_menu.js` scripti orijinal `app.js`'teki 231 ürünü, 25 kategoriyi ve fiyat eşleşmelerini otomatik ayrıştırıp bu SQL dosyasını üretti. Bilmen gerekenler:

- **Görsel URL'leri** `https://lobbygarden.com/assets/menu/...` şeklinde ayarlandı — bu varsayım, CNAME dosyasındaki domain'in halen o statik siteyi yayınladığı varsayımına dayanıyor. Eğer o site kapatılırsa/taşınırsa görseller kırılır; o zaman gerçek görselleri Supabase Storage'a yükleyip `image_url` alanlarını admin panelden tek tek güncellemen gerekir.
- **"Relax"** (Bitki Çayı Çeşitleri) isimli ürün orijinal `PRICE_MAP`'te yoktu, fiyatı **0 ₺** olarak eklendi — admin panelden manuel fiyatlandır.
- **Kategori kapak görselleri** (`category_image_url`) orijinal `categories` array'indeki `img` alanından dolduruldu, aynı domain varsayımıyla.
- Script'i tekrar çalıştırman gerekirse: `node migrate_menu.js <app.js yolu> <çıktı.sql yolu> <görsel-base-url>`

## Dosya haritası
- `package.json`, `index.html`, `vite.config.js` — proje iskeleti
- `tailwind.config.js`, `postcss.config.js` — Tailwind kurulumu
- `.env.example` — Supabase env değişkenleri şablonu
- `supabase_schema.sql` — temel şema + storage + RLS
- `supabase_migration_002.sql` — kalori/içindekiler/şef notu kolonları
- `supabase_migration_003.sql` — categories tablosu + category_image_url'i kaldırma
- `supabase_migration_004.sql` — is_featured (Popüler Ürünler) kolonu
- `supabase_migration_005.sql` — kategori grupları (group_name) kolonu
- `supabase_migration_006.sql` — soft-delete, settings tablosu, EN çeviri kolonları
- `supabase_migration_007_translations.sql` — 231 ürün + 25 kategorinin İngilizce çevirileri
- `src/components/CategoryManager.jsx` — admin kategori yönetim paneli (ekle/düzenle/sil/sürükle-sırala/grup/EN adı)
- `src/components/TrashView.jsx` — çöp kutusu (geri yükle / kalıcı sil)
- `src/components/SettingsView.jsx` — WiFi şifresi ve rezervasyon telefonu
- `menu_seed.sql` — 231 ürünlük otomatik aktarılan veri
- `migrate_menu.js` — migration scripti (referans için, tekrar çalıştırmak istersen)
- `translations.js`, `generate_translation_sql.js` — İngilizce çevirilerin kaynağı ve üretim scripti (referans için)
- `src/main.jsx`, `src/index.css` — React entry point + Tailwind
- `src/lib/supabase.js` — gerçek Supabase client (env yoksa mock'a düşer)
- `src/lib/supabaseMock.js` — `.env` yokken kullanılan sahte backend (test amaçlı)
- `src/lib/auth.js`, `src/context/AuthContext.jsx`, `src/components/ProtectedRoute.jsx` — kimlik doğrulama
- `src/lib/menuIcons.js` — orijinal siteden birebir taşınan alerjen/malzeme SVG ikon sistemi
- `src/components/MenuIcons.jsx` — ikon render bileşenleri
- `src/pages/PublicMenu.jsx` — **halka açık dinamik menü** (`/`) — TR/EN, WiFi/rezervasyon, arama, popüler şerit
- `src/pages/Login.jsx`, `src/pages/Dashboard.jsx` — yönetici paneli
- `src/components/Sidebar.jsx`, `StatusBadge.jsx`, `EmptyState.jsx`, `ActionsMenu.jsx`, `ConfirmModal.jsx`, `AllergenSelector.jsx`, `ImageUpload.jsx`, `ItemDrawer.jsx` — admin UI parçaları
- `src/App.jsx` — routing (`/` → public menü, `/sistem/*` → yönetici paneli, eski `/admin/*` otomatik yönlenir)
- `public/logo.png` — orijinal PDF'ten çıkarılan şeffaf logo

## Bu turda eklenenler
- **Sekme başlığı** "Lobbygarden Menu" oldu.
- **Gerçek ampul/halat/sis intro animasyonu** geri entegre edildi (orijinal `intro.css`/`intro.js`/`animations.css` mantığı React'e taşındı) — 7 ampul sırayla yanıyor, halatlardan sarkıyor, arka plan (`public/assets/intro/background.jpg`, orijinal görselden sıkıştırıldı) aşamalı aydınlanıyor.
- **Instagram butonu** Rezervasyon & İletişim bölümünde, altın renkte, `instagram.com/thelobbyrest`'e gidiyor.
- **Kategori kartlarında X (kapatma) butonu** eklendi.
- **Intro yazısının opaklık animasyonu** orijinal `touchGlow` keyframe'iyle birebir eşleşecek şekilde güncellendi.
- Kategori akordeonu zaten tekildi (bir kategori açılınca diğeri otomatik kapanıyordu) — ek değişiklik gerekmedi.
- **`vercel.json`** eklendi — SPA route'larının (`/sistem/login` gibi) doğrudan adres çubuğundan/yenilemeden çalışması için Vercel'e "her yolu index.html'e yönlendir" talimatı.
- **Görsel yolu düzeltmesi** (`supabase_migration_008_fix_image_paths.sql`) — ürün görselleri artık mutlak `lobbygarden.com` adresi yerine göreceli yol kullanıyor, hangi domain'de çalışırsa çalışsın doğru görsele bakıyor.


## Kapsam dışı bırakılanlar / bilinen sınırlamalar
- **Ürünler artık kategori içinde sürükle-bırak ile sıralanabiliyor** (admin panel, `@dnd-kit`) — sadece sol taraftan belirli bir kategori seçiliyken aktif (arama kutusu da boş olmalı). Kategoriler de aynı şekilde sürüklenerek sıralanıyor.
- **Menü Ürünleri sayfasında kategori filtresi sol sidebar'da**, gruplu (Mezeler & Aperatifler / Ana Yemekler / İçecekler).
- **Soft-delete (Çöp Kutusu):** Ürün sildiğinde 30 gün çöp kutusunda bekliyor, geri yüklenebiliyor. Otomatik kalıcı silme için Supabase'de `pg_cron` eklentisinin açık olması gerekiyor (Database → Extensions → "pg_cron" → Enable) — **bu adımı manuel yapman lazım**, migration dosyası eklentiyi etkinleştiremiyor sadece kullanıyor. Eklentiyi açmazsan otomatik silme çalışmaz ama "Kalıcı Olarak Sil" butonu her zaman çalışır, veri kaybı riski yok.
- **Ayarlar bölümü:** WiFi şifresi ve rezervasyon telefonu admin panelden giriliyor, public menünün altında görünüyor.
- **Route değişikliği:** `/admin/dashboard` yerine artık `/sistem`, `/admin/login` yerine `/sistem/login`. Eski linkler otomatik yönleniyor.
- **TR/EN dil seçeneği:** Sağ üstte sabit köşede. Arayüz metinleri (butonlar, başlıklar) tam çevrildi. **231 ürünün ve 25 kategorinin İngilizce çevirisini ben yaptım** (`supabase_migration_007_translations.sql`) — restoranın kendi terminolojisini/marka diline uymayan bir çeviri görürsen admin panelden ürün bazında düzeltebilirsin (İngilizce alanlar boş bırakılırsa otomatik Türkçe'ye döner, hiçbir zaman boş görünmez).
- Kategori silme, o kategoride ürün varsa engellenir. Kategori yeniden adlandırıldığında ürünlerin `category` alanı otomatik güncellenir (cascade).

## Bu turlarda kendi eklediğim şeyler
- **Admin — Hızlı istatistik şeridi:** Toplam Ürün / Satışta / Gizli / Popüler sayıları tek bakışta.
- **Public menü — Arama çubuğu:** 231 ürün arasında kategori açmadan direkt isimle arama.
- **Bug fix:** İşlemler menüsü (⋮), tablo yatay kaydırıldığında kendini anında kapatıyordu (tarayıcının otomatik "scroll into view" davranışı yüzünden) — kök nedenini bulup düzelttim.
