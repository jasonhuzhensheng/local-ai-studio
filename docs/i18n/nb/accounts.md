[Norsk (bokmål)](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Disse dokumentene er maskinoversettelser av offentlig prosjekttekst og har ikke alle blitt gjennomgått av morsmål. Se den engelske eller kinesiske kilden for teknisk tvetydighet. Ingen private brukerdata er inkludert.

# Nettstedkontoer

## Bruk

På Mac-en som kjører tjenesten, åpne `http://127.0.0.1:1235/setup` for å opprette den første administratoren. Brukernavn inneholder 3–32 bokstaver, sifre, understreker eller bindestreker og er normalisert til små bokstaver. Passord inneholder 12–128 tegn. Det er ingen standardlegitimasjon. Eksterne enheter kan ikke gjøre krav på den opprinnelige administratorkontoen.

Etter oppsett ser uautentiserte enheter påloggingssiden. Åpne **Konto / Logg av** (`/account`) for å endre passordet ditt eller logge av. Administratorer kan opprette users/administrators, tilbakestille passord, disable/enable-kontoer, endre roller og slette kontoer. Sletting og endringer i tillatelser krever bekreftelse. Serveren forhindrer sletting, deaktivering eller nedgradering av den sist aktiverte administratoren. Å slette en konto sletter ikke delte oppgaver.

Bruk språkmenyen øverst til høyre for å velge mellom 33-språk. Nettleseren husker valget ditt. Språkpakker serveres lokalt; å bytte språk sender ikke innhold til en online oversettelsestjeneste. Brukerforespørsler, samtaler og lagret innhold beholder originalspråket.

Dette er et delt studio. Påloggede brukere deler tilgang til bilder, videoer og chat-oppgaver på serversiden. Nettleserchathistorikk forblir i localStorage. Det er ingen isolasjon for flere leietakere, lagring per bruker eller fakturering. Den eksisterende videobegrensningen for kun lokalt gjenstår.

## Lagring og beskyttelse

- `src/studio_auth.mjs` kjører før forretningsruter, inkludert APIer og image/reference/video-filer. Uautentiserte sider omdirigerer med 303; APIer og media returnerer 401. Kontomidler, språkressurser og ikke-hemmelig setup/sign-in-status er offentlige.
- Kontofil: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, standard `app/.local/auth/users.json`; den dedikerte distribusjonen bruker `runtime/auth/users.json`. Katalogmodus: 0700; filmodus: 0600. Passord bruker scrypt N32768/r8/p1, tilfeldige salter og hash-sammenligning med konstant tid. Skrifter er atomære og kontoendringer serialisert. En korrupt eksisterende database forhindrer oppstart i stedet for å gjenåpne registreringen.
- Sesjoner bruker 32 tilfeldige byte; serveren lagrer bare sammendraget. Informasjonskapsler er HttpOnly, SameSite=Strict, gyldige i 12 timer. Omstart krever pålogging igjen. Password/role endringer, tilbakestillinger, deaktivering og sletting opphever berørte økter. Avlogging sletter eller kjører ikke allerede påbegynte oppgaver på nytt.
- Skriving krever samme opprinnelse Origin og JSON. X-Forwarded-For er ikke klarert. Hver kilde-IP får maksimalt 15 sign-in/setup/self-password-change forsøk per 15 minutter. Begrensninger: 4 samtidige passordavledninger og 100-kontoer. Omstart fjerner forsøksgrenser.
- Den eksisterende distribusjonen bruker HTTP over private Tailscale. Tailscale krypterer enhet-til-enhet-transport; vanlig LAN HTTP gjør det ikke. Offentlig tilgang og TLS er ikke konfigurert av denne pakken. Secure informasjonskapsler settes kun for native TLS-forespørsler. Ikke eksponer det direkte over offentlig HTTP.
- Last aldri opp autentiseringsdatabasen, økter eller passord. Initialiser nye kontoer ved migrering. stdio MCP, lokale LM Studio og OS-filtillatelser er utenfor nettstedautentisering.

## Validering

Kjør `node tests/studio_auth.mjs` med sin midlertidige kontodatabase og ingen ekte models. Den dekker uautentisert API/media-blokkering, opprinnelsesbegrensninger for første oppsett, roller, passord hashing/file-moduser, beskyttelse mot siste administrator, tilbakekalling av økter, utholdenhet, avvisning av korrupte filer og hastighetsgrenser.

Testene local_chat, chat_background, image_studio og video_web logger på med isolerte testadministratorer; det er ingen omkjøringsvei for produksjonsautentisering. Ekte passord legges inn av brukeren og skal ikke lagres i tester eller dokumentasjon.
