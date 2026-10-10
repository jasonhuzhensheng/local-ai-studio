[Italiano](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Questi documenti sono traduzioni automatiche di testi di progetti pubblici e non sono stati tutti revisionati da madrelingua. Consultare la fonte inglese o cinese per ambiguità tecniche. Non sono inclusi dati utente privati.

# Account del sito web

## Utilizzo

Sul Mac che esegue il servizio, apri `http://127.0.0.1:1235/setup` per creare il primo amministratore. I nomi utente contengono lettere, cifre, trattini bassi o trattini 3–32 e sono normalizzati in minuscolo. Le password contengono caratteri 12–128. Non sono presenti credenziali predefinite. I dispositivi remoti non possono richiedere l'account amministratore iniziale.

Dopo la configurazione, i dispositivi non autenticati visualizzano la pagina di accesso. Apri **Account/Esci** (`/account`) per modificare la password o uscire. Gli amministratori possono creare users/administrators, reimpostare password, account disable/enable, modificare ruoli ed eliminare account. La cancellazione e le modifiche alle autorizzazioni richiedono conferma. Il server impedisce l'eliminazione, la disabilitazione o la retrocessione dell'ultimo amministratore abilitato. L'eliminazione di un account non elimina le attività condivise.

Utilizza il menu della lingua in alto a destra per scegliere tra le lingue 33. Il browser ricorda la tua selezione. I pacchetti linguistici vengono serviti localmente; cambiare lingua non invia contenuti a un servizio di traduzione online. Le richieste dell'utente, le conversazioni e i contenuti salvati mantengono la loro lingua originale.

Questo è uno studio condiviso. Gli utenti che hanno effettuato l'accesso condividono l'accesso a immagini, video e attività di chat lato server. La cronologia chat del browser rimane in localStorage. Non sono previsti isolamento multi-tenant, archiviazione delle attività per utente o fatturazione. Rimane la restrizione video esistente solo a livello locale.

## Conservazione e protezione

- `src/studio_auth.mjs` viene eseguito prima delle rotte commerciali, incluse API e file image/reference/video. Le pagine non autenticate reindirizzano con 303; API e contenuti multimediali restituiscono 401. Le risorse dell'account, le risorse linguistiche e lo stato setup/sign-in non segreto sono pubblici.
- File account: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, predefinito `app/.local/auth/users.json`; la distribuzione dedicata utilizza `runtime/auth/users.json`. Modalità directory: 0700; modalità file: 0600. Le password utilizzano scrypt N32768/r8/p1, sali casuali e confronto hash a tempo costante. Le scritture sono atomiche e le modifiche dell'account sono serializzate. Un database esistente danneggiato impedisce l'avvio anziché la riapertura della registrazione.
- Le sessioni utilizzano byte casuali 32; il server memorizza solo il digest. I cookie sono HttpOnly, SameSite=Strict, validi per le ore 12. Per riavviare è necessario effettuare nuovamente l'accesso. Password/role modifiche, reimpostazioni, disabilitazione ed eliminazione revocano le sessioni interessate. La disconnessione non elimina né esegue nuovamente le attività già avviate.
- Le scritture richiedono Origin e JSON con la stessa origine. X-Forwarded-For non è affidabile. Ogni IP di origine riceve al massimo 15 sign-in/setup/self-password-change tentativi per 15 minuti. Limiti: derivazioni di password simultanee 4 e account 100. Il riavvio cancella i limiti dei tentativi.
- La distribuzione esistente utilizza HTTP su Tailscale privato. Tailscale crittografa il trasporto da dispositivo a dispositivo; lo stesso HTTP LAN ordinario no. L'accesso pubblico e TLS non sono configurati da questo pacchetto. I cookie Secure vengono impostati solo per le richieste TLS native. Non esporlo direttamente tramite HTTP pubblico.
- Non caricare mai il database di autenticazione, le sessioni o le password. Inizializza nuovi account durante la migrazione. Le autorizzazioni per MCP stdio, LM Studio locale e file del sistema operativo sono esterne all'autenticazione del sito Web.

## Convalida

Esegui `node tests/studio_auth.mjs` con il suo database di account temporaneo e nessun vero models. Copre il blocco API/media non autenticato, le restrizioni sull'origine della configurazione iniziale, i ruoli, le modalità hashing/file della password, la protezione dell'ultimo amministratore, la revoca della sessione, la persistenza, il rifiuto di file corrotti e i limiti di velocità.

I test local_chat, chat_ background, image_studio e video_web accedono con amministratori di test isolati; non esiste alcun bypass dell'autenticazione della produzione. Le password reali vengono inserite dall'utente e non devono essere salvate in test o documentazione.
