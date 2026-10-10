Čeština | ../README.md
Tyto dokumenty jsou strojovým překladem textu veřejného projektu a ne všechny byly zkontrolovány rodilými mluvčími. Technické nejasnosti naleznete v anglickém nebo čínském zdroji. Nejsou zahrnuta žádná soukromá uživatelská data.

Local AI Studio: zdrojový balíček migrace pro nový Mac Apple Silicon

Tato recenzovaná verze obsahuje zdroj frontend/backend, testy, manifesty ke stažení modelu, připnuté závislosti, nativní zdroj enginu a experimentální záplaty Apple videa. Může zaostávat za místním rozvojem nebo výrobou.
Nezahrnuje váhy, virtuální prostředí, předchozí úkoly, referenční obrázky, záznamy chatu, konfiguraci účtu a tajemství. Není to app na jedno kliknutí.

Dejte celou tuto složku asistentovi kódování na cílovém Macu spolu se INSTALL-PROMPT.en.txt.
Původní ověřovací stroj byl M2 Max s pamětí 96GB. Nejprve zkontrolujte cílový model, paměť a operační systém. Na počítačích Mac s nižší pamětí nepoužívejte slepě nastavení videa.

Obsah:
 src/ Frontend, backend, nástroje download/validation, manifesty modelů
 tests/ testy; některé vyžadují nainstalovaný models/services. Nespouštějte všechny bez rozdílu
 requirements/viggle-pinned.txt Připnuté prostředí obrazu
 src/h3_requirements.lock Samostatné připnuté video prostředí
 vendor/ Nativní zdroj bez zkompilovaných binárních souborů; zachovat upstream licence
 patches/ ComfyUI/ClipProj potvrdí a nasadí změny Python
 SHA256SUMS.txt Kontrolní součty jednotlivých souborů

Vstupní body modelu: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (základní model/adapters), wai_model.json, upscale_model.json a h3_apple_models.json (video), pod src/. Před stažením zkontrolujte každý manifest a jeho instalátor.
Textový model: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, soubor Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Tento balíček neobsahuje kompletní připojený revision/hash pro tento model. Nejprve získejte a zaznamenejte důvěryhodná předřazená metadata; nenárokujte si bajtovou ekvivalenci s původním počítačem.

Nová instalace do počítače nebyla ověřena. Zkontrolujte původní cesty stroje, aliasy modelu a cesty systémových nástrojů pro cílového uživatele. Neaplikujte znovu historické opravy na již upravený zdroj dodavatele. Úspěšné stažení není důkazem úspěšného vyvození nebo přijatelné kvality.

Pomocí nabídky jazyků vpravo nahoře si můžete vybrat z jazyků 33. Prohlížeč si pamatuje váš výběr. Jazykové balíčky jsou poskytovány lokálně; přepínání jazyků neodesílá obsah do online překladatelské služby. Uživatelské výzvy, konverzace a uložený obsah si zachovávají svůj původní jazyk.
