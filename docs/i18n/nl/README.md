[Nederlands](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Deze documenten zijn machinevertalingen van openbare projectteksten en zijn niet allemaal door moedertaalsprekers beoordeeld. Raadpleeg de Engelse of Chinese bron voor technische dubbelzinnigheid. Er zijn geen privégebruikersgegevens opgenomen.

# MacBook Pro Studio

Een lokale beeld-, chat- en experimentele videostudio voor Apple Silicon Macs.

## Interfacetaal

Gebruik het taalmenu rechtsboven om uit de 33-talen te kiezen. De browser onthoudt uw selectie. Taalpakketten worden lokaal aangeboden; Bij het wisselen van taal wordt geen inhoud naar een online vertaaldienst verzonden. Gebruikersprompts, gesprekken en opgeslagen inhoud behouden hun oorspronkelijke taal.

## Interfacevoorbeelden

Deze voorbeelden gebruiken de vrijgegeven paginastijlen. Alle aanwijzingen, taak-ID's, tijdstempels, illustraties en gesprekken zijn fictieve demo-inhoud die voor deze README is gemaakt. Ze bevatten geen echte accounts, gebruikersafbeeldingen of chatrecords. De illustraties zijn programmatisch getekend, geen modelbenchmarks of kwaliteitsclaims.

### Beeldstudio

Kies een model, voer een prompt in en blader door taken en afbeeldingsresultaten.

![Beeldstudio met fictieve taken en programmatisch getekende landschapsillustraties](../../images/image-studio-demo.en.png)

### Lokale chat

Chat in dezelfde studio en selecteer een reactiemodus en -duur.

![Lokale chat met een fictief, handmatig geschreven gesprek over illustratieplanning](../../images/chat-studio-demo.en.png)

## Stel een nieuwe Mac in

1. Kloon deze repository.
2. Lees de [implementatiehandleiding](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Geef de [installatieprompt](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) aan een codeerassistent op de doel-Mac om afhankelijkheden te installeren en models te downloaden die geschikt is voor die hardware.

Pagina's: `/edit` voor afbeeldingen, `/chat` voor chat, `/video` voor video. De standaardwebpoort is `1235`.

Deze repository is een beoordeelde release en migratiekopie. Het kan achterlopen op de lokale ontwikkeling of productie. Het is exclusief modelgewichten, virtuele omgevingen, gebruikerstaken, chatrecords, referentieafbeeldingen en accountconfiguratie. Een volledige installatie op een nieuwe machine is niet gevalideerd. Dit is geen applicatie met één klik.

## Inhoud van de opslagplaats

- `src/`: frontend, backend, modelmanifesten, installatie- en validatietools.
- `tests/`: testen; sommige vereisen geïnstalleerde models of actieve services.
- `requirements/`: vastgezette afhankelijkheden.
- `vendor/`: native enginebron, met behoud van upstream-licenties.
- `patches/`: vastgezette versies en Apple-aanpassingen.

Modellen en externe bronnen behouden hun upstream-licenties. H3/ClipProj Apple-ondersteuning is experimenteel. Een succesvolle korte steekproef biedt geen steun voor elke resolutie of duur.

## Inloggen en accounts

Op de Mac waarop de service draait, opent u `http://127.0.0.1:1235/setup` om de eerste beheerder aan te maken en logt u vervolgens in vanaf andere apparaten. Beheerders kunnen accounts aanmaken, uitschakelen en verwijderen en wachtwoorden opnieuw instellen. Zie [accountdocumentatie](accounts.md) ([中文](../../accounts.md)). Er is geen standaardwachtwoord. Accountbestanden blijven in de runtime-gegevensdirectory en mogen niet worden geüpload. Taken blijven gedeelde studiogegevens.

## Viggle v0.3

Er zijn afzonderlijke detailmodi met zes en negen stappen beschikbaar, waarbij de vorige standaard behouden blijft. Zie [installatie en validatie](viggle-v03.md) ([中文](../../viggle-v03.md)). Download modelgewichten afzonderlijk op de doel-Mac.
