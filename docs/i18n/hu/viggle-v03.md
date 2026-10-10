[Magyar](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ezek a dokumentumok nyilvános projektszöveg gépi fordításai, és nem mindegyiket nézték át anyanyelvi beszélők. Forduljon angol vagy kínai forráshoz a technikai kétértelműségért. Nincsenek benne privát felhasználói adatok.

# Viggle v0.3 telepítés és módok

Hivatalos forrás: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Rögzített változat, méretek és hash: `src/viggle_turbo_v03_model.json`. Szerelő: `src/install_viggle_turbo_v03.py`. Külön `models/viggle-qwen-turbo-v03` könyvtárat használ, miközben megosztja a telepített alapmodellt és a meglévő Python környezetet. Nem frissíti a függőségeket, és nem írja felül a v0.1/v0.2.1.-t

A képmodell menü a következőket kínálja:

- **Viggle v0.3 · 6 lépések, tisztább képek**: hivatalos hat-node szigma menetrend, CFG1.
- **Viggle v0.3 · 9 lépések, továbbfejlesztett részletek**: hét Turbó lépés, majd tiltsa le a LoRA-t, állítsa át a következő gyorsítótárazott KV átmenetet kibontásra, és használja az alapmodellt az utolsó két lépéshez. A LoRA és a továbbítási viselkedés ezután visszaáll. Pusztán egy szabályos lépésszám kilencre állítása nem egyenértékű.

A v0.3 legfeljebb három hivatkozást támogat, nincs negatív prompt, és egy 1024px négyzetes alapértelmezés, ha kiválasztja. A korábbi v0.2.1 alapértelmezett és iPhone méretei megmaradnak; az eredeti modell még mindig tíz referenciát támogat. A natív nagy méretek, a VAE csempézés és a meglévő 8K utófeldolgozás továbbra is választható, de nem minden kombinációt teszteltek.

A LoRA nincs beolvasztva BF16 súlyokba; erőssége 1. A `shift_terminal` ütemezőnek null értékűnek kell lennie. A v0.3 lehet kevésbé szemcsés, de kissé lágyabb; nem garantált, hogy minden esetben felülmúlja a régebbi verziókat. A hivatalos kilenclépcsős időarányok nem helyi viszonyítási alapok.

## Érvényesítés

A `tests/viggle_model.mjs` izolált ritka modellkészülékeket használ a lépésszámok, a referenciahatárok, a nagy méretű útválasztási és készenléti jelzők ellenőrzésére. A `tests/viggle_schedule.py` ellenőrzi a LoRA letiltását a hetedik lépés, egy KV újrakivonás és helyreállítás után.

Hatlépcsős 512×512, vetőmag-42 kékpohár minta 52.98-ben, beleértve a process/model betöltést. A méreteket és a tényleges képet ellenőrizték. Az első kilenc lépéses kísérlet leállt, amikor egy új szöveges kapcsolat váltotta ki az erőforrásvédelmet; ez nem következtetési hiba volt.

A kilenclépcsős újrapróbálkozás befejeződött a 65.42s-ben a 512×512-nél, a 42 kezdőértéke. A hetedik lépés után átváltott az alapmodellre, kilenc lépést teljesített, és a megfelelő méreteket készítette el. A szemrevételezés nem talált green/magenta zajt. Módonként egy minta nem stabil teljesítmény-benchmark. A többszörös hivatkozásokat, a nagy képeket és a 8K utófeldolgozást nem ellenőrizték ezek a futtatások.
