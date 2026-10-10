Magyar | ../README.md
Ezek a dokumentumok nyilvános projektszöveg gépi fordításai, és nem mindegyiket nézték át anyanyelvi beszélők. Forduljon angol vagy kínai forráshoz a technikai kétértelműségért. Nincsenek benne privát felhasználói adatok.

Local AI Studio: migrációs forráscsomag egy friss Apple Silicon Machez

Ez a felülvizsgált kiadás tartalmazza a frontend/backend forrást, a teszteket, a modellletöltési jegyzékeket, a rögzített függőségeket, a natív motorforrást és a kísérleti Apple-videójavításokat. Ez elmaradhat a helyi fejlesztéstől vagy termeléstől.
Nem tartalmazza a súlyokat, a virtuális környezeteket, a korábbi feladatokat, a referenciaképeket, a csevegési rekordokat, a fiókkonfigurációt és a titkokat. Ez nem egy egykattintásos app.

Adja át ezt a teljes mappát egy kódolási asszisztensnek a cél Macen, a INSTALL-PROMPT.en.txt-vel együtt.
Az eredeti hitelesítő gép egy M2 Max volt, 96GB memóriával. Először ellenőrizze a célmodellt, a memóriát és az operációs rendszert. Ne használja újra vakon a videóbeállításokat alacsonyabb memóriájú Maceken.

Tartalom:
 src/ Frontend, backend, download/validation eszközök, modelljegyzékek
 tests/ tesztek; egyesekhez telepített models/services. szükséges. Ne futtassa az összeset válogatás nélkül
 requirements/viggle-pinned.txt Rögzített képkörnyezet
 src/h3_requirements.lock Külön rögzített videó környezet
 vendor/ Natív forrás lefordított binárisok nélkül; megőrzi az upstream licenceket
 A patches/ ComfyUI/ClipProj véglegesíti és telepíti a Python módosításokat
 SHA256SUMS.txt Fájlonkénti ellenőrző összegek

Modell belépési pontok: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (alap model/adapters), wai_model.json, upscale_model.json és h3_apple_models.json (videó), a src/. alatt Ellenőrizze az egyes jegyzékeket és azok telepítőit a letöltés előtt.
Szöveges modell: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, reszelő Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Ez a csomag nem tartalmazza a teljes rögzített revision/hash-t ehhez a modellhez. Először szerezze be és rögzítse a megbízható upstream metaadatokat; ne állítson bájtról bájtra egyenértékűséget az eredeti géppel.

Friss gépi telepítés nincs érvényesítve. Tekintse át a célfelhasználó eredeti gép-útvonalait, modellálneveit és rendszereszköz-útvonalait. Ne alkalmazza újra a korábbi javításokat a már módosított szállítói forráshoz. A sikeres letöltés nem bizonyíték a sikeres következtetésre vagy az elfogadható minőségre.

A jobb felső sarokban található nyelvi menü segítségével válasszon a 33 nyelvek közül. A böngésző megjegyzi a választást. A nyelvi csomagokat helyben szolgálják fel; a nyelvváltás nem küld tartalmat online fordítószolgálatnak. A felhasználói felszólítások, beszélgetések és mentett tartalom megtartja eredeti nyelvét.
