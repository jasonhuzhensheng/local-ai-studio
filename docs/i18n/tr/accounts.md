[Türkçe](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Bu belgeler, kamuya açık proje metninin makine çevirileridir ve tümü anadili İngilizce olan kişiler tarafından incelenmemiştir. Teknik belirsizlik için İngilizce veya Çince kaynağa başvurun. Hiçbir özel kullanıcı verisi dahil edilmemiştir.

# Web sitesi hesapları

## Kullanım

Hizmeti çalıştıran Mac'te ilk yöneticiyi oluşturmak için `http://127.0.0.1:1235/setup`'yi açın. Kullanıcı adları 3–32 harfler, rakamlar, alt çizgiler veya kısa çizgiler içerir ve küçük harfe göre normalleştirilmiştir. Parolalar 12–128 karakterleri içerir. Varsayılan kimlik bilgileri yoktur. Uzak cihazlar ilk yönetici hesabını talep edemez.

Kurulumdan sonra kimliği doğrulanmamış cihazlar oturum açma sayfasını görür. Şifrenizi değiştirmek veya oturumu kapatmak için **Hesap / Çıkış** (`/account`) seçeneğini açın. Yöneticiler users/administrators oluşturabilir, şifreleri sıfırlayabilir, disable/enable hesaplarını sıfırlayabilir, rolleri değiştirebilir ve hesapları silebilir. Silme ve izin değişiklikleri onay gerektirir. Sunucu, son etkinleştirilmiş yöneticinin silinmesini, devre dışı bırakılmasını veya rütbesinin düşürülmesini engeller. Bir hesabın silinmesi, paylaşılan görevlerin silinmesine neden olmaz.

33 dilleri arasından seçim yapmak için sağ üstteki dil menüsünü kullanın. Tarayıcı seçiminizi hatırlar. Dil paketleri yerel olarak sunulur; dil değiştirmek, içeriği çevrimiçi çeviri hizmetine göndermez. Kullanıcı istemleri, konuşmaları ve kayıtlı içerik orijinal dillerini korur.

Burası ortak bir stüdyo. Oturum açan kullanıcılar resimlere, videolara ve sunucu tarafı sohbet görevlerine erişimi paylaşır. Tarayıcı sohbet geçmişi localStorage'de kalır. Çok kiracılı izolasyon, kullanıcı başına görev depolama veya faturalandırma yoktur. Mevcut yalnızca yerel video kısıtlaması devam ediyor.

## Depolama ve koruma

- `src/studio_auth.mjs`, API'ler ve image/reference/video dosyaları dahil olmak üzere iş rotalarından önce çalışır.
Kimliği doğrulanmamış sayfalar 303 ile yeniden yönlendirilir; API'ler ve medya 401'yi döndürür.
Hesap varlıkları, dil varlıkları ve gizli olmayan setup/sign-in durumu herkese açıktır.
- Hesap dosyası: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, varsayılan `app/.local/auth/users.json`; özel dağıtım `runtime/auth/users.json`'yi kullanır.
Dizin modu: 0700; dosya modu: 0600.
Şifreler scrypt N32768/r8/p1, rastgele tuzlar ve sabit zamanlı karma karşılaştırmasını kullanır.
Yazmalar atomiktir ve hesap değişiklikleri serileştirilmiştir.
Mevcut bozuk bir veritabanı, kaydı yeniden açmak yerine başlatmayı engelliyor.
- Oturumlar 32 rastgele baytları kullanır; sunucu yalnızca özeti saklar.
Çerezler HttpOnly, SameSite=Strict'dir ve 12 saatleri boyunca geçerlidir.
Yeniden başlatmak için tekrar oturum açmanız gerekir.
Password/role etkilenen oturumları değiştirir, sıfırlar, devre dışı bırakır ve silerek iptal eder.
Oturumu kapatmak, önceden başlatılmış görevleri silmez veya yeniden çalıştırmaz.
- Yazma işlemleri aynı kökenli Origin ve JSON gerektirir.
X-Forwarded-For güvenilir değil.
Her kaynak IP, 15 dakika başına en fazla 15 sign-in/setup/self-password-change denemesi alır.
Sınırlar: 4 eşzamanlı şifre türetmeleri ve 100 hesapları.
Yeniden başlatma, deneme sınırlarını temizler.
- Mevcut dağıtım, özel Tailscale üzerinden HTTP kullanıyor.
Tailscale, aygıttan aygıta aktarımı şifreler; sıradan LAN HTTP'nin kendisi bunu yapmaz.
Genel erişim ve TLS bu paket tarafından yapılandırılmaz.
Secure çerezleri yalnızca yerel TLS istekleri için ayarlanır.
Doğrudan genel HTTP üzerinden göstermeyin.
- Kimlik doğrulama veritabanını, oturumları veya şifreleri asla yüklemeyin.
Taşıma sırasında yeni hesapları başlatın.
stdio MCP, yerel LM Studio ve işletim sistemi dosya izinleri, web sitesi kimlik doğrulamasının dışındadır.

## Doğrulama

`node tests/studio_auth.mjs`'yi geçici hesap veritabanıyla çalıştırın ve gerçek models olmadan çalıştırın. Kimliği doğrulanmamış API/media engellemeyi, ilk kurulum kaynak kısıtlamalarını, rolleri, parola hashing/file modlarını, son yönetici korumasını, oturumu iptal etmeyi, kalıcılığı, bozuk dosya reddini ve hız sınırlarını kapsar.

local_chat, chat_background, image_studio ve video_web testleri izole test yöneticileriyle oturum açar; üretim kimlik doğrulaması bypass'ı yoktur. Gerçek şifreler kullanıcı tarafından girilir ve testlere veya belgelere kaydedilmemelidir.
