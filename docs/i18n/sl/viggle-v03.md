[Slovenščina](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ti dokumenti so strojni prevodi javnega projektnega besedila in niso vseh pregledali naravni govorci. Za tehnične nejasnosti se obrnite na angleški ali kitajski vir. Zasebni uporabniški podatki niso vključeni.

# Viggle v0.3 namestitev in načini

Uradni vir: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Pripeta revizija, velikosti in zgoščene vrednosti: `src/viggle_turbo_v03_model.json`. Namestitev: `src/install_viggle_turbo_v03.py`. Uporablja ločen imenik `models/viggle-qwen-turbo-v03`, medtem ko souporablja nameščeni osnovni model in obstoječe okolje Python. Ne nadgrajuje odvisnosti ali prepisuje v0.1/v0.2.1.

Meni slikovnega modela ponuja:

- **Viggle v0.3 · 6 koraki, čistejše slike**: uradni sigma razpored šest-node, CFG1.
- **Viggle v0.3 · 9 koraki, izboljšane podrobnosti**: sedem korakov Turbo, nato onemogočite LoRA, preklopite naslednji predpomnjeni prehod KV na ekstrakcijo in uporabite osnovni model za zadnja dva koraka. LoRA in vedenje naprej se pozneje obnovita. Zgolj nastavitev običajnega števila korakov na devet ni enakovredna.

v0.3 podpira do tri sklice, brez negativnega poziva in privzeti kvadrat 1024px, ko je izbran. Prejšnja privzeta v0.2.1 in dimenzije iPhone ostanejo; izvirni model še vedno podpira deset referenc. Izvorne velike velikosti, ploščice VAE in obstoječa naknadna obdelava 8K ostajajo na voljo, vendar ni bila preizkušena vsaka kombinacija.

LoRA ni združen v uteži BF16; moč je 1. Razporejevalnik `shift_terminal` mora biti null. v0.3 je lahko manj zrnat, vendar nekoliko mehkejši; ni zagotovljeno, da bo v vsakem primeru presegla starejše različice. Uradna časovna razmerja v devetih korakih niso lokalna merila.

## Preverjanje

`tests/viggle_model.mjs` uporablja izolirane redke napeljave modela za preverjanje števila korakov, referenčnih omejitev, usmerjanja velike velikosti in označevalcev pripravljenosti. `tests/viggle_schedule.py` preveri onemogočanje LoRA po sedmem koraku, eni ponovni ekstrakciji KV in obnovitvi.

Šeststopenjski vzorec modre skodelice 512×512, seme-42, dokončan v 52.98, vključno z nalaganjem process/model. Preverjene so bile dimenzije in dejanska slika. Prvi poskus v devetih korakih se je ustavil, ko je nova besedilna povezava sprožila zaščito vira; to ni bila napaka pri sklepanju.

Ponovni poskus v devetih korakih je bil zaključen v 65.42s pri 512×512, seme 42. Po sedmem koraku je preklopil na osnovni model, opravil devet korakov in izdelal pravilne dimenzije. Vizualni pregled ni odkril hrupa green/magenta. En vzorec na način ni stabilno merilo uspešnosti. Več sklicev, velike slike in naknadna obdelava 8K niso bile potrjene s temi zagoni.
