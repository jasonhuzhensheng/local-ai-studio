[Slovenčina](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Tieto dokumenty sú strojovými prekladmi textu verejného projektu a nie všetky boli skontrolované rodenými hovorcami. Technické nejasnosti nájdete v anglickom alebo čínskom zdroji. Nie sú zahrnuté žiadne súkromné ​​údaje používateľa.

# Inštalácia a režimy Viggle v0.3

Oficiálny zdroj: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Pripnutá revízia, veľkosti a hash: `src/viggle_turbo_v03_model.json`. Inštalátor: `src/install_viggle_turbo_v03.py`. Používa samostatný adresár `models/viggle-qwen-turbo-v03` pri zdieľaní nainštalovaného základného modelu a existujúceho prostredia Python. Neaktualizuje závislosti ani neprepíše v0.1/v0.2.1.

Ponuka obrázkového modelu ponúka:

- **Viggle v0.3 · 6 kroky, čistejšie obrázky**: oficiálny rozpis sigma šiestich node, CFG1.
- **Viggle v0.3 · 9 kroky, vylepšené detaily**: sedem Turbo krokov, potom deaktivujte LoRA, prepnite ďalší KV prechod do vyrovnávacej pamäte na extrakciu a použite základný model na posledné dva kroky. LoRA a dopredné správanie sa potom obnovia. Samotné nastavenie bežného počtu krokov na deväť nie je ekvivalentné.

v0.3 podporuje až tri referencie, bez negatívnej výzvy a predvolenú hodnotu štvorca 1024px, ak je vybratá. Predvolené v0.2.1 rozmery a rozmery iPhonu zostávajú zachované; pôvodný model stále podporuje desať referencií. Natívne veľké veľkosti, obklady VAE a existujúce dodatočné spracovanie 8K zostávajú voliteľné, ale nie každá kombinácia bola testovaná.

LoRA nie je zlúčený so závažiami BF16; pevnosť je 1. Plánovač `shift_terminal` musí byť null. v0.3 môže byť menej zrnitý, ale o niečo mäkší; nie je zaručené, že v každom prípade prekoná staršie verzie. Oficiálne deväťkrokové časové pomery nie sú miestnymi referenčnými hodnotami.

## Overenie

`tests/viggle_model.mjs` používa izolované riedke modelové prípravky na overenie počtu krokov, referenčných limitov, veľkých smerov a značiek pripravenosti. `tests/viggle_schedule.py` overí deaktiváciu LoRA po siedmom kroku, jednej KV reextrakcii a obnovení.

Šesťkroková vzorka 512×512 so semenným 42 modrým pohárom dokončená v 52.98 vrátane nakladania process/model. Boli skontrolované rozmery a skutočný obrázok. Prvý deväťkrokový pokus sa zastavil, keď nové textové pripojenie spustilo ochranu zdrojov; toto nebola dedukčná chyba.

Deväťkrokový pokus bol dokončený v 65.42s na 512×512, základ 42. Po siedmom kroku prešiel na základný model, dokončil deväť krokov a vyrobil správne rozmery. Vizuálna kontrola nezistila žiadny hluk green/magenta. Jedna vzorka na režim nie je stabilným benchmarkom výkonu. Viaceré referencie, veľké obrázky a následné spracovanie 8K neboli týmito behmi overené.
