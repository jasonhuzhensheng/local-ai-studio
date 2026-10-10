[Lietuvių](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Šie dokumentai yra mašininiai viešojo projekto teksto vertimai ir ne visi buvo peržiūrėti gimtakalbių. Dėl techninių neaiškumų kreipkitės į anglų arba kinų šaltinį. Privatūs vartotojo duomenys neįtraukti.

# Svetainės paskyros

## Naudojimas

„Mac“ kompiuteryje, kuriame veikia paslauga, atidarykite `http://127.0.0.1:1235/setup`, kad sukurtumėte pirmąjį administratorių. Vartotojo varduose yra 3–32 raidžių, skaitmenų, apatinių brūkšnių arba brūkšnelių, jie normalizuojami mažosiomis raidėmis. Slaptažodžiuose yra 12–128 simbolių. Numatytųjų kredencialų nėra. Nuotoliniai įrenginiai negali reikalauti pradinės administratoriaus paskyros.

Po sąrankos neautentifikuoti įrenginiai mato prisijungimo puslapį. Atidarykite **Paskyra / Atsijunkite** (`/account`), kad pakeistumėte slaptažodį arba atsijungtumėte. Administratoriai gali sukurti users/administrators, iš naujo nustatyti slaptažodžius, disable/enable paskyras, keisti vaidmenis ir ištrinti paskyras. Ištrynimą ir leidimo pakeitimus reikia patvirtinti. Serveris neleidžia ištrinti, išjungti arba pažeminti paskutinį įjungtą administratorių. Ištrynus paskyrą bendrinamos užduotys neištrinamos.

Norėdami pasirinkti iš 33 kalbų, naudokite viršutiniame dešiniajame kampe esantį kalbos meniu. Naršyklė įsimena jūsų pasirinkimą. Kalbų paketai teikiami vietoje; kalbų perjungimas nesiunčia turinio į internetinę vertimo paslaugą. Vartotojų raginimai, pokalbiai ir išsaugotas turinys išlaiko originalią kalbą.

Tai bendra studija. Prisijungę vartotojai dalijasi prieiga prie vaizdų, vaizdo įrašų ir serverio pokalbių užduočių. Naršyklės pokalbių istorija išlieka localStorage. Nėra kelių nuomininkų izoliacijos, užduočių saugyklos kiekvienam vartotojui ar atsiskaitymo. Esamas tik vietiniam vaizdo įrašų apribojimas išlieka.

## Sandėliavimas ir apsauga

- `src/studio_auth.mjs` veikia prieš verslo maršrutus, įskaitant API ir image/reference/video failus. Neautentifikuoti puslapiai peradresuojami naudojant 303; API ir medija grąžina 401. Paskyros ištekliai, kalbos ištekliai ir neslapti setup/sign-in būsena yra vieši.
- Paskyros failas: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, numatytasis `app/.local/auth/users.json`; specialus diegimas naudoja `runtime/auth/users.json`. Katalogo režimas: 0700; failo režimas: 0600. Slaptažodžiams naudojamos scrypt N32768/r8/p1, atsitiktinės druskos ir pastovaus laiko maišos palyginimas. Įrašai yra atominiai, o paskyros pakeitimai suskirstyti į seriją. Sugadinta esama duomenų bazė neleidžia paleisti, o ne iš naujo atidaryti registraciją.
- Sesijose naudojami 32 atsitiktiniai baitai; serveris saugo tik santrauką. Slapukai yra HttpOnly, SameSite=Strict, galioja 12 valandas. Norint paleisti iš naujo, reikia vėl prisijungti. Password/role pakeitimai, nustatymai iš naujo, išjungimas ir ištrynimas atšaukia paveiktas sesijas. Atsijungus jau pradėtos užduotys neištrinamos arba nevykdomos iš naujo.
- Rašymui reikalingi tos pačios kilmės Origin ir JSON. X-Forwarded-For nepasitiki. Kiekvienas šaltinio IP sulaukia daugiausiai 15 sign-in/setup/self-password-change bandymų per 15 minutes. Ribos: 4 vienu metu naudojami slaptažodžiai ir 100 paskyros. Paleidimas iš naujo pašalina bandymų ribas.
- Esamas diegimas naudoja HTTP per privatų Tailscale. Tailscale užšifruoja perdavimą iš įrenginio į įrenginį; Pats įprastas LAN HTTP to nedaro. Viešoji prieiga ir TLS nėra sukonfigūruoti šiame pakete. Secure slapukai nustatomi tik vietinėms TLS užklausoms. Neatskleiskite jo tiesiogiai per viešąjį HTTP.
- Niekada neįkelkite autentifikavimo duomenų bazės, seansų ar slaptažodžių. Perkeldami inicijuokite naujas paskyras. stdio MCP, vietiniai LM Studio ir OS failų leidimai nepriklauso svetainės autentifikavimui.

## Patvirtinimas

Paleiskite `node tests/studio_auth.mjs` su laikinąja sąskaitų duomenų baze ir be tikrojo models. Tai apima neautentifikuotą API/media blokavimą, pradinės sąrankos kilmės apribojimus, vaidmenis, slaptažodžio hashing/file režimus, paskutinio administratoriaus apsaugą, seanso atšaukimą, išlikimą, sugadintų failų atmetimą ir greičio apribojimus.

Vietiniai_pokalbiai, chat_background, image_studio ir video_web testai prisijungia naudodami atskirus testavimo administratorius; nėra gamybos-autentifikavimo aplinkkelio. Tikruosius slaptažodžius įveda vartotojas ir jie neturi būti saugomi testuose ar dokumentuose.
