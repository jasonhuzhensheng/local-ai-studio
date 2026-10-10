[Dansk](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Disse dokumenter er maskinoversættelser af offentlig projekttekst og er ikke alle blevet gennemgået af indfødte. Se den engelske eller kinesiske kilde for teknisk tvetydighed. Ingen private brugerdata er inkluderet.

# Hjemmesidekonti

## Brug

På den Mac, der kører tjenesten, skal du åbne `http://127.0.0.1:1235/setup` for at oprette den første administrator. Brugernavne indeholder 3–32 bogstaver, cifre, understregninger eller bindestreger og er normaliseret til små bogstaver. Adgangskoder indeholder 12–128 tegn. Der er ingen standardlegitimationsoplysninger. Fjernenheder kan ikke gøre krav på den oprindelige administratorkonto.

Efter opsætningen ser ikke-godkendte enheder login-siden. Åbn **Konto / Log ud** (`/account`) for at ændre din adgangskode eller logge ud. Administratorer kan oprette users/administrators, nulstille adgangskoder, disable/enable-konti, ændre roller og slette konti. Ændringer af sletning og tilladelse kræver bekræftelse. Serveren forhindrer sletning, deaktivering eller nedrykning af den sidst aktiverede administrator. Sletning af en konto sletter ikke delte opgaver.

Brug sprogmenuen øverst til højre for at vælge mellem 33-sprog. Browseren husker dit valg. Sprogpakker serveres lokalt; at skifte sprog sender ikke indhold til en online oversættelsestjeneste. Brugermeddelelser, samtaler og gemt indhold bevarer deres originalsprog.

Dette er et delt studie. Loggede brugere deler adgang til billeder, videoer og chatopgaver på serversiden. Browserchathistorik forbliver i localStorage. Der er ingen isolering af flere lejere, lagring af opgaver pr. bruger eller fakturering. Den eksisterende videobegrænsning, der kun er lokalt, forbliver.

## Opbevaring og beskyttelse

- `src/studio_auth.mjs` kører før forretningsruter, inklusive API'er og image/reference/video-filer. Ugodkendte sider omdirigerer med 303; API'er og medier returnerer 401. Kontoaktiver, sprogaktiver og ikke-hemmelig setup/sign-in-status er offentlige.
- Kontofil: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, standard `app/.local/auth/users.json`; den dedikerede implementering bruger `runtime/auth/users.json`. Directory mode: 0700; filtilstand: 0600. Adgangskoder bruger scrypt N32768/r8/p1, tilfældige salte og konstant-tids-hash-sammenligning. Skrifter er atomare og kontoændringer serialiseret. En korrupt eksisterende database forhindrer opstart i stedet for at genåbne registreringen.
- Sessioner bruger 32 tilfældige bytes; serveren gemmer kun digest. Cookies er HttpOnly, SameSite=Strict, gyldige i 12 timer. Genstart kræver, at du logger ind igen. Password/role ændringer, nulstillinger, deaktivering og sletning tilbagekalder berørte sessioner. At logge ud sletter eller genkører ikke allerede påbegyndte opgaver.
- Skrivninger kræver Origin og JSON med samme oprindelse. X-Forwarded-For er ikke tillid til. Hver kilde-IP får højst 15 sign-in/setup/self-password-change forsøg pr. 15 minutter. Grænser: 4 samtidige adgangskodeafledninger og 100 konti. Genstart rydder forsøgsgrænser.
- Den eksisterende implementering bruger HTTP over private Tailscale. Tailscale krypterer enhed-til-enhed-transport; almindelig LAN HTTP selv gør det ikke. Offentlig adgang og TLS er ikke konfigureret af denne pakke. Secure-cookies indstilles kun til native TLS-anmodninger. Udsæt det ikke direkte over offentlig HTTP.
- Upload aldrig autentificeringsdatabasen, sessioner eller adgangskoder. Initialiser nye konti ved migrering. stdio MCP, lokale LM Studio og OS-filtilladelser er uden for webstedsgodkendelse.

## Validering

Kør `node tests/studio_auth.mjs` med dens midlertidige kontodatabase og ingen rigtig models. Det dækker uautoriseret API/media-blokering, oprindelige opsætningsbegrænsninger, roller, adgangskode hashing/file-tilstande, sidste-administratorbeskyttelse, tilbagekaldelse af sessioner, persistens, afvisning af korrupte filer og hastighedsgrænser.

Local_chat, chat_background, image_studio og video_web testene logger på med isolerede testadministratorer; der er ingen omgåelse af produktionsgodkendelse. Rigtige adgangskoder indtastes af brugeren og må ikke gemmes i test eller dokumentation.
