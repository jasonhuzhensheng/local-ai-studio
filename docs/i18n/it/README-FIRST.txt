Italiano | ../README.md
Questi documenti sono traduzioni automatiche di testi di progetti pubblici e non sono stati tutti revisionati da madrelingua. Consultare la fonte inglese o cinese per ambiguità tecniche. Non sono inclusi dati utente privati.

Local AI Studio: pacchetto sorgente di migrazione per un nuovo Mac Apple Silicon

Questa versione rivista include sorgente frontend/backend, test, manifest di download del modello, dipendenze aggiunte, sorgente del motore nativo e patch video Apple sperimentali. Potrebbe restare indietro rispetto allo sviluppo o alla produzione locale.
Sono esclusi pesi, ambienti virtuali, attività precedenti, immagini di riferimento, record di chat, configurazione dell'account e segreti. Non è uno app con un clic.

Assegna l'intera cartella a un assistente di codifica sul Mac di destinazione, insieme a INSTALL-PROMPT.en.txt.
La macchina di validazione originale era un M2 Max con memoria 96GB. Controllare prima il modello di destinazione, la memoria e il sistema operativo. Non riutilizzare ciecamente le impostazioni video sui Mac con poca memoria.

Contenuto:
 src/ Frontend, backend, strumenti download/validation, manifest del modello
 Prove tests/; alcuni richiedono models/services. installato. Non eseguire tutti indiscriminatamente
 requirements/viggle-pinned.txt Ambiente immagine bloccata
 src/h3_requirements.lock Ambiente video aggiunto separato
 vendor/ Sorgente nativa senza binari compilati; mantenere le licenze a monte
 patches/ ComfyUI/ClipProj conferma e distribuisce le modifiche Python
 SHA256SUMS.txt Checksum per file

Punti di ingresso del modello: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json e h3_apple_models.json (video), in src/. Controlla ogni manifest e il relativo programma di installazione prima del download.
Modello testo: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, file Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Questo pacchetto non include uno revision/hash completo per quel modello. Ottenere e registrare prima metadati upstream attendibili; non rivendicare l'equivalenza byte per byte con la macchina originale.

L'installazione su una nuova macchina non è stata convalidata. Esamina i percorsi della macchina originale, gli alias dei modelli e i percorsi degli strumenti di sistema per l'utente di destinazione. Non riapplicare le patch storiche all'origine del fornitore già modificata. Un download riuscito non è prova di un'inferenza riuscita o di una qualità accettabile.

Utilizza il menu della lingua in alto a destra per scegliere tra le lingue 33. Il browser ricorda la tua selezione. I pacchetti linguistici vengono serviti localmente; cambiare lingua non invia contenuti a un servizio di traduzione online. Le richieste dell'utente, le conversazioni e i contenuti salvati mantengono la loro lingua originale.
