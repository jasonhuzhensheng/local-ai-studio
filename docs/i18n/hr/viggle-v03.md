[Hrvatski](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ovi su dokumenti strojni prijevodi javnog teksta projekta i nisu svi pregledani od strane izvornih govornika. Konzultirajte engleski ili kineski izvor za tehničke nejasnoće. Nema podataka o privatnom korisniku.

# Viggle v0.3 instalacija i načini

Službeni izvor: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Prikvačena revizija, veličine i hashovi: `src/viggle_turbo_v03_model.json`. Instalater: `src/install_viggle_turbo_v03.py`. Koristi zasebni `models/viggle-qwen-turbo-v03` direktorij dok dijeli instalirani osnovni model i postojeće Python okruženje. Ne nadograđuje ovisnosti niti prepisuje v0.1/v0.2.1.

Izbornik modela slike nudi:

- **Viggle v0.3 · 6 koraci, čistije slike**: službeni šest-node sigma raspored, CFG1.
- **Viggle v0.3 · 9 koraci, poboljšani detalji**: sedam Turbo koraka, zatim onemogućite LoRA, prebacite sljedeći predmemorirani KV prolaz na ekstrakciju i koristite osnovni model za posljednja dva koraka. LoRA i ponašanje prema naprijed se nakon toga vraćaju. Samo postavljanje redovnog brojanja koraka na devet nije jednako.

v0.3 podržava do tri reference, bez negativnog upita i 1024px zadanu vrijednost kvadrata kada je odabrano. Prethodne v0.2.1 zadane i iPhone dimenzije ostaju; originalni model i dalje podržava deset referenci. Izvorne velike veličine, VAE popločavanje i postojeća 8K naknadna obrada i dalje se mogu odabrati, ali nije svaka kombinacija testirana.

LoRA nije stopljen u BF16 težine; snaga je 1. Planer `shift_terminal` mora biti null. v0.3 može biti manje zrnat ali malo mekši; nije zajamčeno da će nadmašiti starije verzije u svakom slučaju. Službeni vremenski omjeri u devet koraka nisu lokalna mjerila.

## Provjera valjanosti

`tests/viggle_model.mjs` koristi izolirane prorijeđene modele učvršćenja za provjeru broja koraka, referentnih ograničenja, rutiranja velike veličine i oznaka spremnosti. `tests/viggle_schedule.py` provjerava onesposobljavanje LoRA nakon koraka sedam, jednog KV ponovnog izvlačenja i obnavljanja.

Uzorak 512×512 u šest koraka, sjemenski 42 plavi uzorak završen u 52.98s uključujući process/model učitavanje. Provjerene su dimenzije i stvarna slika. Prvi pokušaj od devet koraka prekinut je kada je nova tekstualna veza pokrenula zaštitu resursa; ovo nije bila greška u zaključivanju.

Ponovni pokušaj u devet koraka dovršen je u 65.42s na 512×512, sjeme 42. Prebacio se na osnovni model nakon sedmog koraka, dovršio devet koraka i proizveo točne dimenzije. Vizualnim pregledom nije pronađena buka green/magenta. Jedan uzorak po načinu rada nije stabilna referentna vrijednost performansi. Višestruke reference, velike slike i 8K naknadna obrada nisu potvrđene tim izvođenjima.
