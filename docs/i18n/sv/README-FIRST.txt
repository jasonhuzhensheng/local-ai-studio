Svenska | ../README.md
Dessa dokument är maskinöversättningar av offentlig projekttext och har inte alla granskats av modersmålstalare. Konsultera den engelska eller kinesiska källan för tekniska oklarheter. Inga privata användardata ingår.

Local AI Studio: migreringskällkodspaket för en fräsch Apple Silicon Mac

Den här granskade versionen inkluderar frontend/backend-källa, tester, modellnedladdningsmanifest, fästa beroenden, inbyggd motorkälla och experimentella Apple-videokorrigeringar. Det kan släpa efter lokal utveckling eller produktion.
Det exkluderar vikter, virtuella miljöer, tidigare uppgifter, referensbilder, chattposter, kontokonfiguration och hemligheter. Det är inte en app med ett klick.

Ge hela mappen till en kodningsassistent på mål-Mac, tillsammans med INSTALL-PROMPT.en.txt.
Den ursprungliga valideringsmaskinen var en M2 Max med 96GB-minne. Kontrollera målmodellen, minnet och OS först. Återanvänd inte videoinställningar blint på Mac-datorer med lägre minne.

Innehåll:
 src/ Frontend, backend, download/validation verktyg, modellmanifest
 tests/ Tester; vissa kräver installerat models/services. Kör inte allt utan åtskillnad
 requirements/viggle-pinned.txt Fäst bildmiljö
 src/h3_requirements.lock Separat fäst videomiljö
 vendor/ Inbyggd källa utan kompilerade binärer; behålla uppströmslicenser
 patches/ ComfyUI/ClipProj begår och distribuerar Python ändringar
 SHA256SUMS.txt Kontrollsummor per fil

Modellingångspunkter: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (bas model/adapters), wai_model.json, upscale_model.json och h3_apple_models.json (video), under src/. Kontrollera före nedladdning och dess installationsprogram.
Textmodell: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, fil Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Det här paketet inkluderar inte en komplett stiftad revision/hash för den modellen. Skaffa och spela in betrodd uppströmsmetadata först; gör inte anspråk på byte-för-byte-ekvivalens med den ursprungliga maskinen.

En ny maskininstallation har inte validerats. Granska originalmaskinsvägar, modellalias och systemverktygsvägar för målanvändaren. Applicera inte historiska patchar igen på redan modifierad leverantörskälla. En lyckad nedladdning är inte bevis på framgångsrik slutledning eller acceptabel kvalitet.

Använd språkmenyn uppe till höger för att välja mellan 33-språk. Webbläsaren kommer ihåg ditt val. Språkpaket serveras lokalt; att byta språk skickar inte innehåll till en onlineöversättningstjänst. Användaruppmaningar, konversationer och sparat innehåll behåller sitt originalspråk.
