Türkçe | ../README.md
Bu belgeler, kamuya açık proje metninin makine çevirileridir ve tümü anadili İngilizce olan kişiler tarafından incelenmemiştir. Teknik belirsizlik için İngilizce veya Çince kaynağa başvurun. Hiçbir özel kullanıcı verisi dahil edilmemiştir.

Local AI Studio: yeni bir Apple Silicon Mac için geçiş kaynağı paketi

İncelenen bu sürüm, frontend/backend kaynağını, testleri, model indirme bildirimlerini, sabitlenmiş bağımlılıkları, yerel motor kaynağını ve deneysel Apple video yamalarını içerir. Yerel kalkınmanın veya üretimin gerisinde kalabilir.
Ağırlıkları, sanal ortamları, önceki görevleri, referans görsellerini, sohbet kayıtlarını, hesap yapılandırmasını ve sırları kapsamaz. Tek tıklamayla app değil.

Bu klasörün tamamını INSTALL-PROMPT.en.txt ile birlikte hedef Mac'teki bir kodlama asistanına verin.
Orijinal doğrulama makinesi, 96GB belleğe sahip bir M2 Max'ti. Önce hedef modeli, belleği ve işletim sistemini kontrol edin. Düşük belleğe sahip Mac'lerde video ayarlarını körü körüne yeniden kullanmayın.

İçindekiler:
 src/ Ön uç, arka uç, download/validation araçları, model bildirimleri
 tests/ Testleri; bazıları models/services.'nin kurulu olmasını gerektirir. Hepsini gelişigüzel çalıştırmayın
 requirements/viggle-pinned.txt Sabitlenmiş görüntü ortamı
 src/h3_requirements.lock Ayrı sabitlenmiş video ortamı
 vendor/ Derlenmiş ikili dosyalar içermeyen yerel kaynak; yukarı akış lisanslarını koruyun
 patches/ ComfyUI/ClipProj, Python değişikliklerini taahhüt eder ve dağıtır
 SHA256SUMS.txt Dosya başına sağlama toplamları

Model giriş noktaları: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (temel model/adapters), wai_model.json, upscale_model.json ve h3_apple_models.json (video), src/. altında İndirmeden önce her bildirimi ve yükleyicisini kontrol edin.
Metin modeli: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, dosya Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Bu paket, söz konusu model için tam sabitlenmiş revision/hash'yi içermez. Önce güvenilir yukarı akış meta verilerini edinin ve kaydedin; orijinal makineye bayt başına eşdeğerlik iddiasında bulunmayın.

Yeni bir makine kurulumu doğrulanmadı. Hedef kullanıcı için orijinal makine yollarını, model takma adlarını ve sistem aracı yollarını inceleyin. Geçmiş yamaları önceden değiştirilmiş satıcı kaynağına yeniden uygulamayın. Başarılı bir indirme, başarılı çıkarımın veya kabul edilebilir kalitenin kanıtı değildir.

33 dilleri arasından seçim yapmak için sağ üstteki dil menüsünü kullanın. Tarayıcı seçiminizi hatırlar. Dil paketleri yerel olarak sunulur; dil değiştirmek, içeriği çevrimiçi çeviri hizmetine göndermez. Kullanıcı istemleri, konuşmaları ve kayıtlı içerik orijinal dillerini korur.
