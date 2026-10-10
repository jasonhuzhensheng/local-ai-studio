Norsk (bokmål) | ../README.md
Disse dokumentene er maskinoversettelser av offentlig prosjekttekst og har ikke alle blitt gjennomgått av morsmål. Se den engelske eller kinesiske kilden for teknisk tvetydighet. Ingen private brukerdata er inkludert.

Local AI Studio: migreringskildepakke for en fersk Apple Silicon Mac

Denne gjennomgåtte utgivelsen inkluderer frontend/backend-kilde, tester, modellnedlastingsmanifester, festede avhengigheter, innebygd motorkilde og eksperimentelle Apple-videooppdateringer. Det kan ligge etter lokal utvikling eller produksjon.
Den ekskluderer vekter, virtuelle miljøer, tidligere oppgaver, referansebilder, chat-oppføringer, kontokonfigurasjon og hemmeligheter. Det er ikke en ett-klikk app.

Gi hele denne mappen til en kodeassistent på mål-Macen, sammen med INSTALL-PROMPT.en.txt.
Den originale valideringsmaskinen var en M2 Max med 96GB-minne. Sjekk målmodellen, minnet og OS først. Ikke gjenbruk videoinnstillinger blindt på Mac-maskiner med lavere minne.

Innhold:
 src/ Frontend, backend, download/validation-verktøy, modellmanifester
 tests/ tester; noen krever installert models/services. Ikke kjør alt tilfeldig
 requirements/viggle-pinned.txt Festet bildemiljø
 src/h3_requirements.lock Separat festet videomiljø
 vendor/ Innfødt kilde uten kompilerte binærfiler; beholde oppstrømslisenser
 patches/ ComfyUI/ClipProj forplikter og distribuerer Python endringer
 SHA256SUMS.txt Kontrollsummer per fil

Modellinngangspunkter: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json og h3_apple_models.json (video), under src/. Sjekk før nedlasting og installering.
Tekstmodell: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, fil Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Denne pakken inkluderer ikke en komplett festet revision/hash for den modellen. Innhent og registrer pålitelige oppstrøms metadata først; ikke hevder byte-for-byte-ekvivalens til den opprinnelige maskinen.

En ny maskininstallasjon er ikke validert. Gjennomgå originale maskinbaner, modellaliaser og systemverktøybaner for målbrukeren. Ikke bruk historiske oppdateringer på nytt på allerede modifisert leverandørkilde. En vellykket nedlasting er ikke bevis på vellykket slutning eller akseptabel kvalitet.

Bruk språkmenyen øverst til høyre for å velge mellom 33-språk. Nettleseren husker valget ditt. Språkpakker serveres lokalt; å bytte språk sender ikke innhold til en online oversettelsestjeneste. Brukerforespørsler, samtaler og lagret innhold beholder originalspråket.
