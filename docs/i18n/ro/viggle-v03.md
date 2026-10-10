[Română](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Aceste documente sunt traduceri automate ale textului proiectului public și nu au fost toate revizuite de vorbitori nativi. Consultați sursa engleză sau chineză pentru ambiguități tehnice. Nu sunt incluse date private ale utilizatorului.

# Viggle v0.3 instalare și moduri

Sursa oficială: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Versiune fixată, dimensiuni și hashuri: `src/viggle_turbo_v03_model.json`. Instalator: `src/install_viggle_turbo_v03.py`. Utilizează un director `models/viggle-qwen-turbo-v03` separat în timp ce partajează modelul de bază instalat și mediul Python existent. Nu actualizează dependențele și nu suprascrie v0.1/v0.2.1.

Meniul imagine-model oferă:

- **Viggle v0.3 · Pași 6, imagini mai curate**: program oficial șase-node sigma, CFG1.
- **Viggle v0.3 · Pași 9, detalii îmbunătățite**: șapte pași Turbo, apoi dezactivați LoRA, comutați următoarea trecere KV în cache la extracție și utilizați modelul de bază pentru ultimii doi pași. LoRA și comportamentul înainte sunt restabiliți ulterior. Doar stabilirea unui număr obișnuit de pași la nouă nu este echivalentă.

v0.3 acceptă până la trei referințe, niciun prompt negativ și un 1024px pătrat implicit când este selectat. Dimensiunile implicite precedente v0.2.1 și iPhone rămân; modelul original suportă încă zece referințe. Dimensiunile mari native, placarea VAE și post-procesarea existentă 8K rămân selectabile, dar nu toate combinațiile au fost testate.

LoRA nu este fuzionat în greutăți BF16; puterea este 1. Scheduler `shift_terminal` trebuie să fie null. v0.3 poate fi mai puțin granulat, dar ușor mai moale; nu este garantat să depășească versiunile mai vechi în fiecare caz. Rapoartele oficiale de sincronizare în nouă trepte nu sunt repere locale.

## Validare

`tests/viggle_model.mjs` utilizează dispozitive izolate de model rare pentru a verifica numărul de pași, limitele de referință, rutarea de dimensiuni mari și marcatorii de pregătire. `tests/viggle_schedule.py` verifică dezactivarea LoRA după pasul șapte, o reextracție și restaurare KV.

Un eșantion 512×512, în șase pași, cu semințe-42 în cupă albastră, completat în 52.98, inclusiv încărcarea process/model. Au fost verificate dimensiunile și imaginea reală. Prima încercare în nouă pași s-a oprit când o nouă conexiune text a declanșat protecția resurselor; aceasta nu a fost o eroare de inferență.

Reîncercarea în nouă pași finalizată în 65.42 la 512×512, semințe 42. A trecut la modelul de bază după pasul șapte, a finalizat nouă pași și a produs dimensiunile corecte. Inspecția vizuală nu a găsit niciun zgomot green/magenta. Un eșantion per mod nu este un etalon de performanță stabil. Referințele multiple, imaginile mari și post-procesarea 8K nu au fost validate de acele rulări.
