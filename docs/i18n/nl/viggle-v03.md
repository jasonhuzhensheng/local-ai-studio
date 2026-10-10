[Nederlands](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Deze documenten zijn machinevertalingen van openbare projectteksten en zijn niet allemaal door moedertaalsprekers beoordeeld. Raadpleeg de Engelse of Chinese bron voor technische dubbelzinnigheid. Er zijn geen privégebruikersgegevens opgenomen.

# Viggle v0.3 installatie en modi

Officiële bron: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Vastgezette revisie, maten en hashes: `src/viggle_turbo_v03_model.json`. Installateur: `src/install_viggle_turbo_v03.py`. Gebruikt een aparte `models/viggle-qwen-turbo-v03`-directory terwijl het geïnstalleerde basismodel en de bestaande Python-omgeving worden gedeeld. Het upgradet geen afhankelijkheden en overschrijft v0.1/v0.2.1. niet

Het afbeeldingsmodelmenu biedt:

- **Viggle v0.3 · 6-stappen, schonere afbeeldingen**: officieel zes-node sigma-schema, CFG1.
- **Viggle v0.3 · 9-stappen, verbeterde details**: zeven Turbo-stappen, schakel vervolgens de LoRA uit, schakel de volgende in de cache opgeslagen KV-pas naar extractie en gebruik het basismodel voor de laatste twee stappen. LoRA en voorwaarts gedrag worden daarna hersteld. Het simpelweg instellen van een normaal aantal stappen op negen is niet hetzelfde.

v0.3 ondersteunt maximaal drie referenties, geen negatieve prompt en een vierkante 1024px-standaard indien geselecteerd. De vorige standaard- en iPhone-afmetingen van v0.2.1 blijven bestaan; het originele model ondersteunt nog steeds tien referenties. Native grote formaten, VAE-tegels en bestaande 8K-nabewerking blijven selecteerbaar, maar niet elke combinatie is getest.

De LoRA is niet versmolten met BF16-gewichten; sterkte is 1. Planner `shift_terminal` moet null zijn. v0.3 kan minder korrelig maar iets zachter zijn; Het is niet gegarandeerd dat het in alle gevallen beter presteert dan oudere versies. Officiële timingratio's in negen stappen zijn geen lokale benchmarks.

## Validatie

`tests/viggle_model.mjs` maakt gebruik van geïsoleerde, spaarzame modelarmaturen om het aantal stappen, referentielimieten, routing op groot formaat en gereedheidsmarkeringen te verifiëren. `tests/viggle_schedule.py` verifieert het uitschakelen van de LoRA na stap zeven, één KV-herextractie en -herstel.

Een zesstaps 512×512, zaad-42 blue-cup-monster voltooid in 52.98's inclusief process/model-lading. Afmetingen en werkelijke afbeelding zijn gecontroleerd. De eerste poging van negen stappen stopte toen een nieuwe tekstverbinding bronbescherming activeerde; dit was geen gevolgtrekkingsfout.

De nieuwe poging in negen stappen voltooid in 65.42s op 512×512, zaad 42. Na stap zeven stapte het over op het basismodel, doorliep negen stappen en produceerde de juiste afmetingen. Bij visuele inspectie is geen green/magenta-geluid aangetroffen. Eén monster per modus is geen stabiele prestatiebenchmark. Meerdere referenties, grote afbeeldingen en 8K-naverwerking werden door deze runs niet gevalideerd.
