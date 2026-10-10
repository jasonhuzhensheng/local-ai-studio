[Dansk](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Disse dokumenter er maskinoversættelser af offentlig projekttekst og er ikke alle blevet gennemgået af indfødte. Se den engelske eller kinesiske kilde for teknisk tvetydighed. Ingen private brugerdata er inkluderet.

# Viggle v0.3 installation og tilstande

Officiel kilde: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Fastgjort revision, størrelser og hashes: `src/viggle_turbo_v03_model.json`. Installatør: `src/install_viggle_turbo_v03.py`. Bruger et separat `models/viggle-qwen-turbo-v03`-bibliotek, mens den installerede basismodel og eksisterende Python-miljø deles. Den opgraderer ikke afhængigheder eller overskriver v0.1/v0.2.1.

Billedmodelmenuen tilbyder:

- **Viggle v0.3 · 6 trin, renere billeder**: officiel seks-node sigma tidsplan, CFG1.
- **Viggle v0.3 · 9-trin, forbedrede detaljer**: syv Turbo-trin, deaktiver derefter LoRA, skift det næste cachelagrede KV-pas til ekstraktion og brug basismodellen til de sidste to trin. LoRA og fremadgående adfærd gendannes efterfølgende. Blot at sætte et almindeligt skridttæller til ni svarer ikke til.

v0.3 understøtter op til tre referencer, ingen negativ prompt og en 1024px kvadratisk standard, når valgt. De tidligere v0.2.1 standard- og iPhone-dimensioner forbliver; den originale model understøtter stadig ti referencer. Indbyggede store størrelser, VAE flisebelægning og eksisterende 8K efterbehandling forbliver valgbare, men ikke alle kombinationer er blevet testet.

LoRA er ikke sammensmeltet i BF16 vægte; styrke er 1. Planlægger `shift_terminal` skal være null. v0.3 kan være mindre kornet, men lidt blødere; det er ikke garanteret at overgå ældre versioner i alle tilfælde. Officielle ni-trins timing-forhold er ikke lokale benchmarks.

## Validering

`tests/viggle_model.mjs` bruger isolerede sparsomme modelarmaturer til at verificere skridttællere, referencegrænser, routing i stor størrelse og klarhedsmarkører. `tests/viggle_schedule.py` verificerer deaktivering af LoRA efter trin syv, én KV genudtrækning og gendannelse.

En seks-trins 512×512, frø-42 blå kop prøve afsluttet i 52.98s inklusive process/model loading. Dimensioner og det faktiske billede blev kontrolleret. Det første ni-trins forsøg stoppede, da en ny tekstforbindelse udløste ressourcebeskyttelse; dette var ikke en slutningsfejl.

Det ni-trins genforsøg fuldført i 65.42s ved 512×512, frø 42. Den skiftede til basismodellen efter trin syv, gennemførte ni trin og producerede de korrekte dimensioner. Visuel inspektion fandt ingen green/magenta-støj. En prøve pr. tilstand er ikke et stabilt præstationsbenchmark. Flere referencer, store billeder og 8K-efterbehandling blev ikke valideret af disse kørsler.
