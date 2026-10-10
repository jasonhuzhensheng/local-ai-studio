[Türkçe](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Bu belgeler, kamuya açık proje metninin makine çevirileridir ve tümü anadili İngilizce olan kişiler tarafından incelenmemiştir. Teknik belirsizlik için İngilizce veya Çince kaynağa başvurun. Hiçbir özel kullanıcı verisi dahil edilmemiştir.

# MacBook Pro Studio

Apple Silicon Mac'ler için yerel bir resim, sohbet ve deneysel video stüdyosu.

## Arayüz dili

33 dilleri arasından seçim yapmak için sağ üstteki dil menüsünü kullanın. Tarayıcı seçiminizi hatırlar. Dil paketleri yerel olarak sunulur; dil değiştirmek, içeriği çevrimiçi çeviri hizmetine göndermez. Kullanıcı istemleri, konuşmaları ve kayıtlı içerik orijinal dillerini korur.

## Arayüz önizlemeleri

Bu önizlemeler yayınlanan sayfa stillerini kullanır. Tüm istemler, görev kimlikleri, zaman damgaları, resimler ve konuşmalar bu README için oluşturulmuş kurgusal demo içeriğidir. Gerçek hesaplar, kullanıcı görselleri veya sohbet kayıtları içermezler. Çizimler, model kıyaslamaları veya kalite iddiaları değil, programatik olarak çizilmiştir.

### Görüntü stüdyosu

Bir model seçin, bir bilgi istemi girin ve görevlere ve görüntü sonuçlarına göz atın.

![Kurgusal görevler ve programlı olarak çizilmiş manzara çizimleri içeren resim stüdyosu](../../images/image-studio-demo.en.png)

### Yerel sohbet

Aynı stüdyoda sohbet edin ve bir yanıt modu ve uzunluğu seçin.

![Kurgusal, manuel olarak yazılmış illüstrasyon planlama konuşmasıyla yerel sohbet](../../images/chat-studio-demo.en.png)

## Yeni bir Mac kurun

1. Bu depoyu klonlayın.
2. [Dağıtım kılavuzunu](README-FIRST.txt) ([中文](../../../README-先读我.txt))'yi okuyun.
3. Bağımlılıkları yüklemek ve bu donanıma uygun models'yi indirmek için hedef Mac'teki kodlama asistanına [kurulum istemini](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt))'yi) verin.

Sayfalar: Resimler için `/edit`, sohbet için `/chat`, video için `/video`. Varsayılan web bağlantı noktası `1235`'dir.

Bu depo, gözden geçirilmiş bir sürüm ve geçiş kopyasıdır. Yerel kalkınmanın veya üretimin gerisinde kalabilir. Model ağırlıkları, sanal ortamlar, kullanıcı görevleri, sohbet kayıtları, referans görselleri ve hesap yapılandırması buna dahil değildir. Yeni bir makineye tam kurulum doğrulanmadı. Bu tek tıklamayla yapılacak bir uygulama değil.

## Depo içeriği

- `src/`: ön uç, arka uç, model bildirimleri, kurulum ve doğrulama araçları.
- `tests/`: testler; bazıları models'nin kurulu olmasını veya hizmetlerin çalıştırılmasını gerektirir.
- `requirements/`: sabitlenmiş bağımlılıklar.
- `vendor/`: yukarı akış lisansları korunan yerel motor kaynağı.
- `patches/`: sabitlenmiş sürümler ve Apple uyarlamaları.

Modeller ve üçüncü taraf kaynaklar, yukarı akış lisanslarını korur. H3/ClipProj Apple desteği deneyseldir. Başarılı bir kısa örnek, her çözünürlük veya süre için destek sağlamaz.

## Oturum açma ve hesaplar

Hizmeti çalıştıran Mac'te ilk yöneticiyi oluşturmak için `http://127.0.0.1:1235/setup`'yi açın, ardından diğer cihazlardan oturum açın. Yöneticiler hesapları oluşturabilir, devre dışı bırakabilir, silebilir ve şifreleri sıfırlayabilir. Bkz. [hesap belgeleri](accounts.md) ([中文](../../accounts.md)). Varsayılan şifre yoktur. Hesap dosyaları runtime veri dizininde kalır ve yüklenmemelidir. Görevler paylaşılan stüdyo verileri olarak kalır.

## Viggle v0.3

Önceki varsayılan ayar korunarak ayrı altı adımlı ve dokuz adımlı ayrıntı modları mevcuttur. Bkz. [kurulum ve doğrulama](viggle-v03.md) ([中文](../../viggle-v03.md)). Model ağırlıklarını hedef Mac'e ayrı olarak indirin.
