[Svenska](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dessa dokument är maskinöversättningar av offentlig projekttext och har inte alla granskats av modersmålstalare. Konsultera den engelska eller kinesiska källan för tekniska oklarheter. Inga privata användardata ingår.

# Viggle v0.3 installation och lägen

Officiell källa: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Fäst version, storlekar och hash: `src/viggle_turbo_v03_model.json`. Installatör: `src/install_viggle_turbo_v03.py`. Använder en separat `models/viggle-qwen-turbo-v03`-katalog samtidigt som den installerade basmodellen och befintlig Python-miljö delas. Den uppgraderar inte beroenden eller skriver över v0.1/v0.2.1.

Bildmodellmenyn erbjuder:

- **Viggle v0.3 · 6 steg, renare bilder**: officiellt sex-node sigma-schema, CFG1.
- **Viggle v0.3 · 9-steg, förbättrade detaljer**: sju Turbo-steg, inaktivera sedan LoRA, växla nästa cachade KV-pass till extraktion och använd basmodellen för de två sista stegen. LoRA och framåtbeteende återställs efteråt. Att bara sätta ett vanligt stegräkning till nio är inte likvärdigt.

v0.3 stöder upp till tre referenser, ingen negativ prompt och en 1024px kvadratisk standard när den är markerad. De tidigare v0.2.1 standard- och iPhone-måtten kvarstår; originalmodellen stöder fortfarande tio referenser. Inbyggda stora storlekar, VAE plattsättning och befintlig 8K efterbearbetning är fortfarande valbara, men inte alla kombinationer har testats.

LoRA är inte smält till BF16 vikter; styrkan är 1. Schemaläggaren `shift_terminal` måste vara null. v0.3 kan vara mindre kornig men något mjukare; Det är inte garanterat att det överträffar äldre versioner i alla fall. Officiella niostegs timingkvoter är inte lokala riktmärken.

## Validering

`tests/viggle_model.mjs` använder isolerade glesa modellfixturer för att verifiera stegräkningar, referensgränser, stor routing och beredskapsmarkörer. `tests/viggle_schedule.py` verifierar inaktivering av LoRA efter steg sju, en KV återutvinning och återställning.

Ett sexstegs 512×512, frö-42 blåkoppsprov färdigt i 52.98 inklusive process/model-laddning. Mått och den faktiska bilden kontrollerades. Det första niostegsförsöket avbröts när en ny textanslutning utlöste resursskydd; detta var inte ett slutledningsfel.

Niostegsförsöket slutfördes i 65.42s vid 512×512, seed 42. Den bytte till basmodellen efter steg sju, genomförde nio steg och tog fram rätt dimensioner. Visuell inspektion fann inget green/magenta-ljud. Ett prov per läge är inte ett stabilt prestandariktmärke. Flera referenser, stora bilder och 8K efterbearbetning validerades inte av dessa körningar.
