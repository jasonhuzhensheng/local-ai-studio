Slovenčina | ../README.md
Tieto dokumenty sú strojovými prekladmi textu verejného projektu a nie všetky boli skontrolované rodenými hovorcami. Technické nejasnosti nájdete v anglickom alebo čínskom zdroji. Nie sú zahrnuté žiadne súkromné ​​údaje používateľa.

Local AI Studio: zdrojový balík migrácie pre nový Mac Apple Silicon

Toto recenzované vydanie obsahuje zdroj frontend/backend, testy, manifesty na stiahnutie modelu, pripnuté závislosti, natívny zdroj enginu a experimentálne záplaty Apple videa. Môže zaostávať za miestnym rozvojom alebo výrobou.
Nezahŕňa váhy, virtuálne prostredia, predchádzajúce úlohy, referenčné obrázky, záznamy rozhovorov, konfiguráciu účtu a tajomstvá. Nie je to app na jedno kliknutie.

Dajte celý tento priečinok asistentovi kódovania na cieľovom Macu spolu so INSTALL-PROMPT.en.txt.
Pôvodný overovací stroj bol M2 Max s pamäťou 96GB. Najprv skontrolujte cieľový model, pamäť a operačný systém. Na počítačoch Mac s nižšou pamäťou nepoužívajte naslepo nastavenia videa.

Obsah:
 src/ Frontend, backend, nástroje download/validation, manifesty modelov
 Testy tests/; niektoré vyžadujú nainštalovaný models/services. Nespúšťajte všetky bez rozdielu
 requirements/viggle-pinned.txt Pripnuté obrazové prostredie
 src/h3_requirements.lock Samostatné pripnuté video prostredie
 vendor/ Natívny zdroj bez kompilovaných binárnych súborov; ponechať upstream licencie
 patches/ ComfyUI/ClipProj potvrdí a nasadí zmeny Python
 SHA256SUMS.txt Kontrolné súčty jednotlivých súborov

Vstupné body modelu: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (základ model/adapters), wai_model.json, upscale_model.json a h3_apple_models.json (video), pod src/. Pred stiahnutím skontrolujte každý manifest a jeho inštalátor.
Textový model: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, súbor Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Tento balík neobsahuje kompletný pripojený revision/hash pre tento model. Najprv získajte a zaznamenajte dôveryhodné metaúdaje smerom hore; nenárokujte si bajtovú ekvivalentnosť s pôvodným počítačom.

Nová inštalácia na stroji nebola overená. Skontrolujte pôvodné cesty stroja, aliasy modelu a cesty systémových nástrojov pre cieľového používateľa. Neaplikujte znova historické opravy na už upravený zdroj dodávateľa. Úspešné sťahovanie nie je dôkazom úspešného odvodzovania alebo prijateľnej kvality.

Pomocou ponuky jazykov vpravo hore si môžete vybrať z jazykov 33. Prehliadač si zapamätá váš výber. Jazykové balíčky sa podávajú lokálne; prepínanie jazykov neposiela obsah do online prekladateľskej služby. Používateľské výzvy, konverzácie a uložený obsah si zachovávajú svoj pôvodný jazyk.
