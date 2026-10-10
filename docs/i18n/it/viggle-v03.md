[Italiano](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Questi documenti sono traduzioni automatiche di testi di progetti pubblici e non sono stati tutti revisionati da madrelingua. Consultare la fonte inglese o cinese per ambiguità tecniche. Non sono inclusi dati utente privati.

# Installazione e modalità Viggle v0.3

Fonte ufficiale: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Revisione, dimensioni e hash appuntati: `src/viggle_turbo_v03_model.json`. Installatore: `src/install_viggle_turbo_v03.py`. Utilizza una directory `models/viggle-qwen-turbo-v03` separata condividendo il modello base installato e l'ambiente Python esistente. Non aggiorna le dipendenze né sovrascrive v0.1/v0.2.1.

Il menu del modello immagine offre:

- **Viggle v0.3 · Passi 6, immagini più pulite**: programma sigma ufficiale six-node, CFG1.
- **Viggle v0.3 · Passaggi 9, dettaglio migliorato**: sette passaggi Turbo, quindi disabilita LoRA, passa all'estrazione il successivo passaggio KV memorizzato nella cache e utilizza il modello base per gli ultimi due passaggi. LoRA e il comportamento in avanti vengono ripristinati in seguito. Impostare semplicemente un conteggio dei passi regolare su nove non è equivalente.

v0.3 supporta fino a tre riferimenti, nessun prompt negativo e un quadrato 1024px predefinito quando selezionato. Rimangono le precedenti dimensioni predefinite v0.2.1 e iPhone; il modello originale supporta ancora dieci riferimenti. I formati nativi di grandi dimensioni, la piastrellatura VAE e la post-elaborazione 8K esistente rimangono selezionabili, ma non tutte le combinazioni sono state testate.

Lo LoRA non è fuso nei pesi BF16; il punto di forza è 1. Lo scheduler `shift_terminal` deve essere null. v0.3 può essere meno granuloso ma leggermente più morbido; non è garantito che superi le versioni precedenti in ogni caso. I rapporti temporali ufficiali a nove fasi non sono parametri di riferimento locali.

## Convalida

`tests/viggle_model.mjs` utilizza dispositivi di modello sparsi isolati per verificare il conteggio dei passi, i limiti di riferimento, il percorso di grandi dimensioni e gli indicatori di disponibilità. `tests/viggle_schedule.py` verifica la disabilitazione di LoRA dopo il passaggio sette, una riestrazione e ripristino di un KV.

Un campione blue-cup 512×512 in sei fasi, seed-42 completato in 52.98 incluso il caricamento process/model. Sono state controllate le dimensioni e l'immagine reale. Il primo tentativo in nove passaggi si è interrotto quando una nuova connessione testuale ha attivato la protezione delle risorse; questo non era un errore di inferenza.

Il nuovo tentativo in nove passaggi è stato completato in 65.42 a 512×512, seed 42. È passato al modello base dopo il passaggio sette, ha completato nove passaggi e ha prodotto le dimensioni corrette. L'ispezione visiva non ha rilevato alcun rumore green/magenta. Un campione per modalità non è un benchmark prestazionale stabile. Riferimenti multipli, immagini di grandi dimensioni e post-elaborazione 8K non sono stati convalidati da tali esecuzioni.
