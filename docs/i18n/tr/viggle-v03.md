[Türkçe](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Bu belgeler, kamuya açık proje metninin makine çevirileridir ve tümü anadili İngilizce olan kişiler tarafından incelenmemiştir. Teknik belirsizlik için İngilizce veya Çince kaynağa başvurun. Hiçbir özel kullanıcı verisi dahil edilmemiştir.

# Viggle v0.3 kurulumu ve modları

Resmi kaynak: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Sabitlenmiş düzeltme, boyutlar ve karmalar: `src/viggle_turbo_v03_model.json`. Yükleyici: `src/install_viggle_turbo_v03.py`. Kurulu temel modeli ve mevcut Python ortamını paylaşırken ayrı bir `models/viggle-qwen-turbo-v03` dizini kullanır. Bağımlılıkları yükseltmez veya v0.1/v0.2.1.'nin üzerine yazmaz

Görüntü modeli menüsü şunları sunar:

- **Viggle v0.3 · 6 adımları, daha temiz görüntüler**: resmi altı-node sigma programı, CFG1.
- **Viggle v0.3 · 9 adımları, gelişmiş ayrıntı**: yedi Turbo adımı, ardından LoRA'yi devre dışı bırakın, bir sonraki önbelleğe alınan KV geçişini çıkarma işlemine geçirin ve son iki adım için temel modeli kullanın. LoRA ve ileri davranış daha sonra geri yüklenir. Yalnızca normal adım sayısını dokuza ayarlamak eşdeğer değildir.

v0.3 en fazla üç referansı destekler, negatif istem yoktur ve seçildiğinde 1024px kare varsayılanı. Önceki v0.2.1 varsayılanı ve iPhone boyutları aynı kalır; orijinal model hala on referansı desteklemektedir. Yerel büyük boyutlar, VAE döşeme ve mevcut 8K son işleme seçilebilir olmaya devam ediyor ancak her kombinasyon test edilmedi.

LoRA, BF16 ağırlıklarına kaynaştırılmaz; gücü 1'dir. Zamanlayıcı `shift_terminal`, null olmalıdır. v0.3 daha az grenli ancak biraz daha yumuşak olabilir; her durumda eski sürümlerden daha iyi performans göstermesi garanti edilmez. Resmi dokuz adımlı zamanlama oranları yerel kriterler değildir.

## Doğrulama

`tests/viggle_model.mjs`, adım sayımlarını, referans limitlerini, büyük boyutlu yönlendirmeyi ve hazırlık işaretlerini doğrulamak için izole edilmiş seyrek model fikstürleri kullanır. `tests/viggle_schedule.py`, yedinci adım olan bir KV yeniden çıkarma ve restorasyondan sonra LoRA'nin devre dışı bırakıldığını doğrular.

Altı adımlı 512×512, tohum-42 mavi kap örneği, process/model yüklemesi de dahil olmak üzere 52.98'lerde tamamlandı. Boyutlar ve gerçek görüntü kontrol edildi. Yeni bir metin bağlantısı kaynak korumasını tetiklediğinde ilk dokuz adımlı deneme durduruldu; bu bir çıkarım hatası değildi.

Dokuz adımlı yeniden deneme 65.42'lerde 512×512'de tamamlandı, tohum 42. Yedinci adımdan sonra temel modele geçti, dokuz adımı tamamladı ve doğru boyutları üretti. Görsel incelemede green/magenta gürültüsü bulunamadı. Mod başına bir örnek, istikrarlı bir performans ölçütü değildir. Çoklu referanslar, büyük resimler ve 8K son işlemesi bu çalıştırmalar tarafından doğrulanmadı.
