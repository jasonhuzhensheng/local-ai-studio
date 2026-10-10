[Dansk](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Disse dokumenter er maskinoversættelser af offentlig projekttekst og er ikke alle blevet gennemgået af indfødte. Se den engelske eller kinesiske kilde for teknisk tvetydighed. Ingen private brugerdata er inkluderet.

# MacBook Pro Studio

Et lokalt billed-, chat- og eksperimentelt videostudie til Apple Silicon Macs.

## Interface sprog

Brug sprogmenuen øverst til højre for at vælge mellem 33-sprog. Browseren husker dit valg. Sprogpakker serveres lokalt; at skifte sprog sender ikke indhold til en online oversættelsestjeneste. Brugermeddelelser, samtaler og gemt indhold bevarer deres originalsprog.

## Forhåndsvisninger af grænsefladen

Disse forhåndsvisninger bruger de frigivne sidestile. Alle prompter, opgave-id'er, tidsstempler, illustrationer og samtaler er fiktivt demoindhold, der er oprettet til denne README. De indeholder ingen rigtige konti, brugerbilleder eller chatoptegnelser. Illustrationerne er programmatisk tegnede, ikke modelbenchmarks eller kvalitetskrav.

### Billedstudie

Vælg en model, indtast en prompt, og gennemse opgaver og billedresultater.

![Billedstudie med fiktive opgaver og programmatisk tegnede landskabsillustrationer](../../images/image-studio-demo.en.png)

### Lokal chat

Chat i det samme studie og vælg en svartilstand og -længde.

![Lokal chat med en fiktiv, manuelt skrevet illustrationsplanlægningssamtale](../../images/chat-studio-demo.en.png)

## Konfigurer en ny Mac

1. Klon dette lager.
2. Læs [implementeringsvejledningen](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Giv [installationsprompt](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) til en kodningsassistent på mål-Mac'en for at installere afhængigheder og downloade models passende til den hardware.

Sider: `/edit` til billeder, `/chat` til chat, `/video` til video. Standardwebporten er `1235`.

Dette lager er en gennemgået udgivelses- og migreringskopi. Det kan halte bagefter lokal udvikling eller produktion. Det udelukker modelvægte, virtuelle miljøer, brugeropgaver, chatregistreringer, referencebilleder og kontokonfiguration. En komplet installation på en ny maskine er ikke blevet valideret. Dette er ikke et et-klik-program.

## Lagerindhold

- `src/`: frontend, backend, modelmanifester, installations- og valideringsværktøjer.
- `tests/`: tests; nogle kræver installeret models eller kørende tjenester.
- `requirements/`: fastgjorte afhængigheder.
- `vendor/`: indbygget motorkilde, med opstrømslicenser bibeholdt.
- `patches/`: fastgjorte versioner og Apple-tilpasninger.

Modeller og tredjepartskilder beholder deres upstream-licenser. H3/ClipProj Apple-support er eksperimentel. En vellykket kort prøve etablerer ikke understøttelse for hver opløsning eller varighed.

## Log ind og konti

På den Mac, der kører tjenesten, skal du åbne `http://127.0.0.1:1235/setup` for at oprette den første administrator, og derefter logge ind fra andre enheder. Administratorer kan oprette, deaktivere og slette konti og nulstille adgangskoder. Se [kontodokumentation](accounts.md) ([中文](../../accounts.md)). Der er ingen standardadgangskode. Kontofiler forbliver i runtime-datamappen og må ikke uploades. Opgaver forbliver delte studiedata.

## Viggle v0.3

Separate seks-trins og ni-trins detaljetilstande er tilgængelige, med den tidligere standard bibeholdt. Se [installation og validering](viggle-v03.md) ([中文](../../viggle-v03.md)). Download modelvægte separat på mål-Mac'en.
