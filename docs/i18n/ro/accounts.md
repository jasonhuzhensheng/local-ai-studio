[Română](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Aceste documente sunt traduceri automate ale textului proiectului public și nu au fost toate revizuite de vorbitori nativi. Consultați sursa engleză sau chineză pentru ambiguități tehnice. Nu sunt incluse date private ale utilizatorului.

# Conturi de site

## Utilizare

Pe Mac care rulează serviciul, deschideți `http://127.0.0.1:1235/setup` pentru a crea primul administrator. Numele de utilizator conțin litere 3–32, cifre, caractere de subliniere sau cratime și sunt normalizate la litere mici. Parolele conțin caractere 12–128. Nu există acreditări implicite. Dispozitivele de la distanță nu pot revendica contul inițial de administrator.

După configurare, dispozitivele neautentificate văd pagina de conectare. Deschideți **Cont/Deconectați-vă** (`/account`) pentru a vă schimba parola sau pentru a vă deconecta. Administratorii pot crea users/administrators, reseta parole, conturi disable/enable, pot schimba roluri și șterge conturi. Ștergerea și modificarea permisiunii necesită confirmare. Serverul împiedică ștergerea, dezactivarea sau retrogradarea ultimului administrator activat. Ștergerea unui cont nu șterge sarcinile partajate.

Utilizați meniul de limbă din dreapta sus pentru a alege dintre limbile 33. Browserul își amintește selecția dvs. Pachetele lingvistice sunt servite local; schimbarea limbii nu trimite conținut către un serviciu de traducere online. Solicitările utilizatorului, conversațiile și conținutul salvat își păstrează limba inițială.

Acesta este un studio comun. Utilizatorii conectați partajează accesul la imagini, videoclipuri și sarcini de chat pe partea serverului. Istoricul chat-ului din browser rămâne în localStorage. Nu există izolarea multi-locatari, stocarea sarcinilor per utilizator sau facturare. Restricția existentă numai pentru videoclipuri locale rămâne.

## Depozitare și protecție

- `src/studio_auth.mjs` rulează înaintea rutelor de afaceri, inclusiv API-urile și fișierele image/reference/video. Redirecționarea paginilor neautentificate cu 303; API-urile și media returnează 401. Activele contului, activele lingvistice și statutul non-secret setup/sign-in sunt publice.
- Fișier cont: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, implicit `app/.local/auth/users.json`; implementarea dedicată folosește `runtime/auth/users.json`. Modul director: 0700; modul fișier: 0600. Parolele folosesc scrypt N32768/r8/p1, săruri aleatorii și comparație de hash în timp constant. Scrierile sunt atomice, iar modificările contului sunt serializate. O bază de date existentă coruptă împiedică pornirea mai degrabă decât redeschiderea înregistrării.
- Sesiunile folosesc octeți aleatori 32; serverul stochează doar rezumatul. Cookie-urile sunt HttpOnly, SameSite=Strict, valabile pentru orele 12. Repornirea necesită conectarea din nou. Password/role modificările, resetările, dezactivarea și ștergerea revocă sesiunile afectate. Deconectarea nu șterge sau rulează din nou sarcinile deja începute.
- Scrierile necesită Origin și JSON de aceeași origine. X-Forwarded-For nu este de încredere. Fiecare IP sursă primește cel mult 15 sign-in/setup/self-password-change încercări la fiecare 15 minute. Limite: 4 derivații simultane de parole și conturi 100. Repornirea șterge limitele încercărilor.
- Implementarea existentă folosește HTTP peste Tailscale privat. Tailscale criptează transportul de la dispozitiv la dispozitiv; HTTP LAN obișnuit în sine nu. Accesul public și TLS nu sunt configurate de acest pachet. Cookie-urile Secure sunt setate numai pentru solicitările TLS native. Nu-l expuneți direct prin HTTP public.
- Nu încărcați niciodată baza de date de autentificare, sesiuni sau parole. Inițializați conturi noi la migrare. Permisiunile MCP stdio, LM Studio locale și fișierele OS sunt în afara autentificării site-ului web.

## Validare

Rulați `node tests/studio_auth.mjs` cu baza de date temporară a contului și fără models real. Acesta acoperă blocarea neautentificată API/media, restricțiile de origine a configurării inițiale, roluri, moduri de parolă hashing/file, protecția ultimului administrator, revocarea sesiunii, persistența, respingerea fișierelor corupte și limitele de rată.

Testele local_chat, chat_background, image_studio și video_web se conectează cu administratori de testare izolați; nu există ocolire de autentificare a producției. Parolele reale sunt introduse de utilizator și nu trebuie salvate în teste sau documentație.
