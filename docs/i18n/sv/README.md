[Svenska](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dessa dokument är maskinöversättningar av offentlig projekttext och har inte alla granskats av modersmålstalare. Konsultera den engelska eller kinesiska källan för tekniska oklarheter. Inga privata användardata ingår.

# MacBook Pro Studio

En lokal bild-, chatt- och experimentell videostudio för Apple Silicon Mac-datorer.

## Gränssnittsspråk

Använd språkmenyn uppe till höger för att välja mellan 33-språk. Webbläsaren kommer ihåg ditt val. Språkpaket serveras lokalt; att byta språk skickar inte innehåll till en onlineöversättningstjänst. Användaruppmaningar, konversationer och sparat innehåll behåller sitt originalspråk.

## Gränssnittsförhandsvisningar

Dessa förhandsvisningar använder de släppta sidstilarna. Alla uppmaningar, uppgifts-ID:n, tidsstämplar, illustrationer och konversationer är fiktivt demoinnehåll skapat för denna README. De innehåller inga riktiga konton, användarbilder eller chattposter. Illustrationerna är programmatiskt ritade, inte modellriktmärken eller kvalitetskrav.

### Bildstudio

Välj en modell, ange en uppmaning och bläddra bland uppgifter och bildresultat.

![Bildstudio med fiktiva uppgifter och programmatiskt ritade landskapsillustrationer](../../images/image-studio-demo.en.png)

### Lokal chatt

Chatta i samma studio och välj ett svarsläge och längd.

![Lokal chatt med en fiktiv, manuellt skriven illustrationsplaneringskonversation](../../images/chat-studio-demo.en.png)

## Konfigurera en ny Mac

1. Klona detta förråd.
2. Läs [distributionsguiden](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Ge [installationsprompten](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) till en kodningsassistent på mål-Mac för att installera beroenden och ladda ner models som är lämplig för den hårdvaran.

Sidor: `/edit` för bilder, `/chat` för chatt, `/video` för video. Standardwebbporten är `1235`.

Det här arkivet är en granskad version och migreringskopia. Det kan släpa efter lokal utveckling eller produktion. Det exkluderar modellvikter, virtuella miljöer, användaruppgifter, chattposter, referensbilder och kontokonfiguration. En komplett installation på en ny maskin har inte validerats. Det här är inte en applikation med ett klick.

## Förvarets innehåll

- `src/`: frontend, backend, modellmanifest, installations- och valideringsverktyg.
- `tests/`: tester; vissa kräver installerad models eller körande tjänster.
- `requirements/`: fästa beroenden.
- `vendor/`: inbyggd motorkälla, med bibehållna uppströmslicenser.
- `patches/`: låsta versioner och Apple-anpassningar.

Modeller och tredjepartskällor behåller sina uppströmslicenser. H3/ClipProj Apple-stöd är experimentellt. Ett framgångsrikt kort prov ger inte stöd för varje upplösning eller varaktighet.

## Inloggning och konton

På Mac som kör tjänsten öppnar du `http://127.0.0.1:1235/setup` för att skapa den första administratören och loggar sedan in från andra enheter. Administratörer kan skapa, inaktivera och ta bort konton och återställa lösenord. Se [kontodokumentation](accounts.md) ([中文](../../accounts.md)). Det finns inget standardlösenord. Kontofiler stannar i runtime-datakatalogen och får inte laddas upp. Uppgifter förblir delad studiodata.

## Viggle v0.3

Separata sex-stegs och nio-stegs detaljlägen är tillgängliga, med den tidigare standardinställningen bibehållen. Se [installation och validering](viggle-v03.md) ([中文](../../viggle-v03.md)). Ladda ner modellvikter separat på mål-Mac.
