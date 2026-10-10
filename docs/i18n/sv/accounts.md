[Svenska](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dessa dokument är maskinöversättningar av offentlig projekttext och har inte alla granskats av modersmålstalare. Konsultera den engelska eller kinesiska källan för tekniska oklarheter. Inga privata användardata ingår.

# Webbplatskonton

## Användning

På Mac som kör tjänsten öppnar du `http://127.0.0.1:1235/setup` för att skapa den första administratören. Användarnamn innehåller 3–32 bokstäver, siffror, understreck eller bindestreck och är normaliserade till gemener. Lösenord innehåller 12–128 tecken. Det finns inga standarduppgifter. Fjärrenheter kan inte göra anspråk på det ursprungliga administratörskontot.

Efter installationen ser oautentiserade enheter inloggningssidan. Öppna **Konto / Logga ut** (`/account`) för att ändra ditt lösenord eller logga ut. Administratörer kan skapa users/administrators, återställa lösenord, disable/enable-konton, ändra roller och ta bort konton. Förändringar av radering och behörighet kräver bekräftelse. Servern förhindrar att den senast aktiverade administratören tas bort, inaktiveras eller nedgraderas. Att ta bort ett konto tar inte bort delade uppgifter.

Använd språkmenyn uppe till höger för att välja mellan 33-språk. Webbläsaren kommer ihåg ditt val. Språkpaket serveras lokalt; att byta språk skickar inte innehåll till en onlineöversättningstjänst. Användaruppmaningar, konversationer och sparat innehåll behåller sitt originalspråk.

Detta är en delad studio. Inloggade användare delar åtkomst till bilder, videor och chattuppgifter på serversidan. Webbläsarens chatthistorik finns kvar i localStorage. Det finns ingen isolering för flera klienter, uppgiftslagring per användare eller fakturering. Den befintliga videobegränsningen för endast lokalt kvarstår.

## Förvaring och skydd

- `src/studio_auth.mjs` körs före affärsrutter, inklusive API:er och image/reference/video-filer. Oautentiserade sidor omdirigerar med 303; API:er och media returnerar 401. Kontotillgångar, språktillgångar och icke-hemlig setup/sign-in-status är offentliga.
- Kontofil: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, standard `app/.local/auth/users.json`; den dedikerade distributionen använder `runtime/auth/users.json`. Katalogläge: 0700; filläge: 0600. Lösenord använder scrypt N32768/r8/p1, slumpmässiga salter och konstant-tids-hash-jämförelse. Skriver är atomära och kontoändringar serialiserade. En korrupt befintlig databas förhindrar uppstart snarare än att återöppna registreringen.
- Sessioner använder 32 slumpmässiga bytes; servern lagrar endast sammanfattningen. Cookies är HttpOnly, SameSite=Strict, giltiga i 12 timmar. Omstart kräver inloggning igen. Password/role ändringar, återställer, inaktiverar och radering återkallar påverkade sessioner. Att logga ut tar inte bort eller kör om redan påbörjade uppgifter.
- Skriver kräver samma ursprung Origin och JSON. X-Forwarded-For är inte betrodd. Varje käll-IP får högst 15 sign-in/setup/self-password-change försök per 15 minuter. Begränsningar: 4 samtidiga lösenordsavledningar och 100-konton. Omstart rensar försöksgränserna.
- Den befintliga distributionen använder HTTP över privata Tailscale. Tailscale krypterar enhet-till-enhet-transport; vanliga LAN HTTP själv gör det inte. Allmän åtkomst och TLS är inte konfigurerade av detta paket. Secure cookies ställs endast in för inbyggda TLS-förfrågningar. Exponera det inte direkt över offentlig HTTP.
- Ladda aldrig upp autentiseringsdatabasen, sessioner eller lösenord. Initiera nya konton vid migrering. stdio MCP, lokala LM Studio och OS-filbehörigheter är utanför webbplatsautentisering.

## Validering

Kör `node tests/studio_auth.mjs` med sin tillfälliga kontodatabas och ingen riktig models. Den täcker oautentiserad API/media-blockering, ursprungsbegränsningar för initial installation, roller, lösenord hashing/file-lägen, sista administratörsskydd, återkallande av sessioner, beständighet, avvisning av korrupta filer och hastighetsgränser.

Testerna local_chat, chat_background, image_studio och video_web loggar in med isolerade testadministratörer; det finns ingen förbikoppling av produktionsautentisering. Riktiga lösenord skrivs in av användaren och får inte sparas i tester eller dokumentation.
