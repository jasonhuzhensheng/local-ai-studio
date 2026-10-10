[Italiano](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Questi documenti sono traduzioni automatiche di testi di progetti pubblici e non sono stati tutti revisionati da madrelingua. Consultare la fonte inglese o cinese per ambiguità tecniche. Non sono inclusi dati utente privati.

# MacBook Pro Studio

Uno studio locale di immagini, chat e video sperimentale per Mac Apple Silicon.

## Lingua dell'interfaccia

Utilizza il menu della lingua in alto a destra per scegliere tra le lingue 33. Il browser ricorda la tua selezione. I pacchetti linguistici vengono serviti localmente; cambiare lingua non invia contenuti a un servizio di traduzione online. Le richieste dell'utente, le conversazioni e i contenuti salvati mantengono la loro lingua originale.

## Anteprime dell'interfaccia

Queste anteprime utilizzano gli stili di pagina rilasciati. Tutti i suggerimenti, gli ID attività, i timestamp, le illustrazioni e le conversazioni sono contenuti demo fittizi creati per questo README. Non contengono account reali, immagini degli utenti o record di chat. Le illustrazioni sono disegnate in modo programmatico, non benchmark di modelli o dichiarazioni di qualità.

### Studio di immagine

Scegli un modello, inserisci un messaggio e sfoglia le attività e i risultati delle immagini.

![Studio di immagini con compiti immaginari e illustrazioni di paesaggi disegnate a livello di codice](../../images/image-studio-demo.en.png)

### Chat locale

Chatta nello stesso studio e seleziona una modalità e una durata di risposta.

![Chat locale con una conversazione immaginaria di pianificazione delle illustrazioni scritta manualmente](../../images/chat-studio-demo.en.png)

## Configura un nuovo Mac

1. Clona questo repository.
2. Leggi la [guida alla distribuzione](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Fornisci il [prompt di installazione](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) a un assistente di codifica sul Mac di destinazione per installare le dipendenze e scaricare models appropriato per quell'hardware.

Pagine: `/edit` per immagini, `/chat` per chat, `/video` per video. La porta Web predefinita è `1235`.

Questo repository è una versione rivista e una copia di migrazione. Potrebbe restare indietro rispetto allo sviluppo o alla produzione locale. Sono esclusi i pesi dei modelli, gli ambienti virtuali, le attività degli utenti, i record delle chat, le immagini di riferimento e la configurazione dell'account. Un'installazione completa su una nuova macchina non è stata convalidata. Questa non è un'applicazione con un solo clic.

## Contenuti del repository

- `src/`: frontend, backend, manifest del modello, strumenti di installazione e convalida.
- `tests/`: prove; alcuni richiedono models installato o servizi in esecuzione.
- `requirements/`: dipendenze bloccate.
- `vendor/`: sorgente motore nativa, con licenze upstream mantenute.
- `patches/`: versioni fissate e adattamenti Apple.

I modelli e le fonti di terze parti mantengono le loro licenze a monte. H3/ClipProj Il supporto Apple è sperimentale. Un breve esempio di successo non stabilisce il supporto per ogni risoluzione o durata.

## Accesso e account

Sul Mac che esegue il servizio, apri `http://127.0.0.1:1235/setup` per creare il primo amministratore, quindi accedi da altri dispositivi. Gli amministratori possono creare, disattivare ed eliminare account e reimpostare le password. Consulta la [documentazione dell'account](accounts.md) ([中文](../../accounts.md)). Non esiste una password predefinita. I file dell'account rimangono nella directory dei dati runtime e non devono essere caricati. Le attività rimangono dati di studio condivisi.

## Viggle v0.3

Sono disponibili modalità di dettaglio separate a sei e nove passaggi, mantenendo l'impostazione predefinita precedente. Vedere [installazione e convalida](viggle-v03.md) ([中文](../../viggle-v03.md)). Scarica i pesi dei modelli separatamente sul Mac di destinazione.
