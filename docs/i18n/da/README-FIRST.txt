Dansk | ../README.md
Disse dokumenter er maskinoversættelser af offentlig projekttekst og er ikke alle blevet gennemgået af indfødte. Se den engelske eller kinesiske kilde for teknisk tvetydighed. Ingen private brugerdata er inkluderet.

Local AI Studio: migreringskildepakke til en frisk Apple Silicon Mac

Denne gennemgåede udgivelse inkluderer frontend/backend-kilde, test, modeldownload-manifester, fastgjorte afhængigheder, native engine-kilde og eksperimentelle Apple-videorettelser. Det kan halte bagefter lokal udvikling eller produktion.
Det udelukker vægte, virtuelle miljøer, tidligere opgaver, referencebilleder, chatregistreringer, kontokonfiguration og hemmeligheder. Det er ikke et enkelt-klik app.

Giv hele denne mappe til en kodningsassistent på mål-Mac'en sammen med INSTALL-PROMPT.en.txt.
Den originale valideringsmaskine var en M2 Max med 96GB hukommelse. Tjek først målmodellen, hukommelsen og OS. Genbrug ikke videoindstillinger blindt på Mac'er med lavere hukommelse.

Indhold:
 src/ Frontend, backend, download/validation værktøjer, modelmanifester
 tests/ Tests; nogle kræver installeret models/services. Kør ikke alle vilkårligt
 requirements/viggle-pinned.txt Fastgjort billedmiljø
 src/h3_requirements.lock Separat fastgjort videomiljø
 vendor/ Native kilde uden kompilerede binære filer; beholde upstream-licenser
 patches/ ComfyUI/ClipProj forpligter og implementerer Python ændringer
 SHA256SUMS.txt Kontrolsummer pr. fil

Modelindgangspunkter: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json og h3_apple_models.json (video), under src/. Tjek før download og dets installationsprogram.
Tekstmodel: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, fil Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Denne pakke inkluderer ikke en komplet fastgjort revision/hash til den model. Indhent og optag først pålidelige upstream-metadata; gør ikke krav på byte-for-byte-ækvivalens til den originale maskine.

En ny maskine-installation er ikke blevet valideret. Gennemgå stier til originale maskiner, modelaliasser og systemværktøjsstier for målbrugeren. Genanvend ikke historiske programrettelser på allerede ændret leverandørkilde. En vellykket download er ikke bevis på vellykket slutning eller acceptabel kvalitet.

Brug sprogmenuen øverst til højre for at vælge mellem 33-sprog. Browseren husker dit valg. Sprogpakker serveres lokalt; at skifte sprog sender ikke indhold til en online oversættelsestjeneste. Brugermeddelelser, samtaler og gemt indhold bevarer deres originalsprog.
