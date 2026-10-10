[Norsk (bokmål)](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Disse dokumentene er maskinoversettelser av offentlig prosjekttekst og har ikke alle blitt gjennomgått av morsmål. Se den engelske eller kinesiske kilden for teknisk tvetydighet. Ingen private brukerdata er inkludert.

# MacBook Pro Studio

Et lokalt bilde-, chat- og eksperimentelt videostudio for Apple Silicon Mac-er.

## Grensesnittspråk

Bruk språkmenyen øverst til høyre for å velge mellom 33-språk. Nettleseren husker valget ditt. Språkpakker serveres lokalt; å bytte språk sender ikke innhold til en online oversettelsestjeneste. Brukerforespørsler, samtaler og lagret innhold beholder originalspråket.

## Forhåndsvisninger av grensesnitt

Disse forhåndsvisningene bruker de utgitte sidestilene. Alle meldinger, oppgave-IDer, tidsstempler, illustrasjoner og samtaler er fiktivt demoinnhold laget for denne README. De inneholder ingen ekte kontoer, brukerbilder eller chat-oppføringer. Illustrasjonene er programmatisk tegnet, ikke modellbenchmarks eller kvalitetskrav.

### Bildestudio

Velg en modell, skriv inn en melding og bla gjennom oppgaver og bilderesultater.

![Bildestudio med fiktive oppgaver og programmatisk tegnede landskapsillustrasjoner](../../images/image-studio-demo.en.png)

### Lokal chat

Chat i samme studio og velg en responsmodus og lengde.

![Lokal chat med en fiktiv, manuelt skrevet illustrasjonsplanleggingssamtale](../../images/chat-studio-demo.en.png)

## Sett opp en ny Mac

1. Klon dette depotet.
2. Les [distribusjonsveiledningen](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Gi [installasjonsprompt](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) til en kodingsassistent på mål-Macen for å installere avhengigheter og laste ned models som passer for den maskinvaren.

Sider: `/edit` for bilder, `/chat` for chat, `/video` for video. Standard nettport er `1235`.

Dette depotet er en gjennomgått utgivelses- og migreringskopi. Det kan ligge etter lokal utvikling eller produksjon. Den ekskluderer modellvekter, virtuelle miljøer, brukeroppgaver, chat-poster, referansebilder og kontokonfigurasjon. En komplett installasjon på en fersk maskin har ikke blitt validert. Dette er ikke et ett-klikks program.

## Depotinnhold

- `src/`: frontend, backend, modellmanifester, installasjons- og valideringsverktøy.
- `tests/`: tester; noen krever installert models eller kjørende tjenester.
- `requirements/`: festede avhengigheter.
- `vendor/`: innebygd motorkilde, med oppstrømslisenser beholdt.
- `patches/`: festede versjoner og Apple-tilpasninger.

Modeller og tredjepartskilder beholder sine oppstrømslisenser. H3/ClipProj Apple-støtte er eksperimentell. En vellykket kort prøve etablerer ikke støtte for hver oppløsning eller varighet.

## Innlogging og kontoer

På Mac-en som kjører tjenesten, åpne `http://127.0.0.1:1235/setup` for å opprette den første administratoren, og logg deretter på fra andre enheter. Administratorer kan opprette, deaktivere og slette kontoer og tilbakestille passord. Se [kontodokumentasjon](accounts.md) ([中文](../../accounts.md)). Det er ikke noe standardpassord. Kontofiler forblir i runtime-datakatalogen og må ikke lastes opp. Oppgaver forblir delte studiodata.

## Viggle v0.3

Separate seks-trinns og ni-trinns detaljmoduser er tilgjengelige, med den forrige standarden beholdt. Se [installasjon og validering](viggle-v03.md) ([中文](../../viggle-v03.md)). Last ned modellvekter separat på mål-Macen.
