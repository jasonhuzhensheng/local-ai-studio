[Norsk (bokmål)](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Disse dokumentene er maskinoversettelser av offentlig prosjekttekst og har ikke alle blitt gjennomgått av morsmål. Se den engelske eller kinesiske kilden for teknisk tvetydighet. Ingen private brukerdata er inkludert.

# Viggle v0.3 installasjon og moduser

Offisiell kilde: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Festet revisjon, størrelser og hashes: `src/viggle_turbo_v03_model.json`. Installatør: `src/install_viggle_turbo_v03.py`. Bruker en separat `models/viggle-qwen-turbo-v03`-katalog mens du deler den installerte basismodellen og eksisterende Python-miljø. Den oppgraderer ikke avhengigheter eller overskriver v0.1/v0.2.1.

Bildemodellmenyen tilbyr:

- **Viggle v0.3 · 6-trinn, renere bilder**: offisiell seks-node sigma-plan, CFG1.
- **Viggle v0.3 · 9-trinn, forbedrede detaljer**: syv Turbo-trinn, deaktiver deretter LoRA, bytt neste bufrede KV-pass til utvinning og bruk basismodellen for de to siste trinnene. LoRA og fremadferd gjenopprettes etterpå. Bare å sette en vanlig skritttelling til ni er ikke tilsvarende.

v0.3 støtter opptil tre referanser, ingen negativ melding og en 1024px kvadratisk standard når valgt. De forrige v0.2.1 standard- og iPhone-dimensjonene forblir; den originale modellen støtter fortsatt ti referanser. Innfødte store størrelser, VAE flislegging og eksisterende 8K etterbehandling forblir valgbare, men ikke alle kombinasjoner har blitt testet.

LoRA er ikke smeltet inn i BF16-vekter; styrke er 1. Planlegger `shift_terminal` må være null. v0.3 kan være mindre kornete, men litt mykere; det er ikke garantert å overgå eldre versjoner i alle tilfeller. Offisielle ni-trinns tidsforhold er ikke lokale referanser.

## Validering

`tests/viggle_model.mjs` bruker isolerte sparsomme modellarmaturer for å verifisere trinnteller, referansegrenser, ruting i stor størrelse og beredskapsmarkører. `tests/viggle_schedule.py` bekrefter deaktivering av LoRA etter trinn sju, en KV re-ekstrahering og restaurering.

En seks-trinns 512×512, frø-42 blåkoppprøve fullført i 52.98s inkludert process/model-lasting. Dimensjoner og selve bildet ble kontrollert. Det første ni-trinnsforsøket stoppet da en ny tekstforbindelse utløste ressursbeskyttelse; dette var ikke en slutningsfeil.

Det ni-trinns nye forsøket ble fullført i 65.42s ved 512×512, frø 42. Den byttet til basismodellen etter trinn sju, fullførte ni trinn og produserte de riktige dimensjonene. Visuell inspeksjon fant ingen green/magenta-støy. Én prøve per modus er ikke en stabil ytelsesreferanse. Flere referanser, store bilder og 8K etterbehandling ble ikke validert av disse kjøringene.
