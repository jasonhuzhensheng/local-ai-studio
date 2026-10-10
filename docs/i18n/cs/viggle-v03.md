[Čeština](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Tyto dokumenty jsou strojovým překladem textu veřejného projektu a ne všechny byly zkontrolovány rodilými mluvčími. Technické nejasnosti naleznete v anglickém nebo čínském zdroji. Nejsou zahrnuta žádná soukromá uživatelská data.

# Instalace a režimy Viggle v0.3

Oficiální zdroj: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Připnutá revize, velikosti a hash: `src/viggle_turbo_v03_model.json`. Instalátor: `src/install_viggle_turbo_v03.py`. Používá samostatný adresář `models/viggle-qwen-turbo-v03` při sdílení nainstalovaného základního modelu a stávajícího prostředí Python. Neupgraduje závislosti ani nepřepisuje v0.1/v0.2.1.

Nabídka obrazového modelu nabízí:

- **Viggle v0.3 · Kroky 6, čistší obrázky**: oficiální plán šesti node sigma, CFG1.
- **Viggle v0.3 · 9 kroky, vylepšené detaily**: sedm Turbo kroků, pak deaktivujte LoRA, přepněte další KV průchod v mezipaměti na extrakci a použijte základní model pro poslední dva kroky. LoRA a dopředné chování se poté obnoví. Pouhé nastavení běžného počtu kroků na devět není ekvivalentní.

v0.3 podporuje až tři reference, žádnou negativní výzvu a výchozí čtverec 1024px, pokud je vybrán. Předchozí výchozí v0.2.1 a rozměry iPhone zůstávají; původní model stále podporuje deset referencí. Nativní velké velikosti, dlaždice VAE a stávající následné zpracování 8K zůstávají volitelné, ale ne každá kombinace byla testována.

LoRA není spojen se závažím BF16; síla je 1. Plánovač `shift_terminal` musí být null. v0.3 může být méně zrnitý, ale mírně měkčí; není zaručeno, že ve všech případech překoná starší verze. Oficiální devítikrokové časové poměry nejsou místními měřítky.

## Ověření

`tests/viggle_model.mjs` používá izolované řídké modelové přípravky k ověření počtu kroků, referenčních limitů, velkých směrování a značek připravenosti. `tests/viggle_schedule.py` ověří deaktivaci LoRA po kroku sedm, jedné KV reextrakce a obnovení.

Šestikrokový vzorek 512×512, semenný 42 modrý pohárek dokončený v 52.98 včetně nakládání process/model. Byly zkontrolovány rozměry a skutečný obraz. První devítikrokový pokus se zastavil, když nové textové připojení spustilo ochranu zdrojů; to nebyla vyvozovací chyba.

Opakování v devíti krocích bylo dokončeno v 65.42s na 512×512, základ 42. Po sedmém kroku přešel na základní model, dokončil devět kroků a vyrobil správné rozměry. Vizuální kontrola nezjistila žádný hluk green/magenta. Jeden vzorek na režim není stabilním měřítkem výkonu. Vícenásobné reference, velké obrázky a následné zpracování 8K nebyly těmito běhy ověřeny.
