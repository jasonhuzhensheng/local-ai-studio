[Lietuvių](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Šie dokumentai yra mašininiai viešojo projekto teksto vertimai ir ne visi buvo peržiūrėti gimtakalbių. Dėl techninių neaiškumų kreipkitės į anglų arba kinų šaltinį. Privatūs vartotojo duomenys neįtraukti.

# Viggle v0.3 diegimas ir režimai

Oficialus šaltinis: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Prisegta versija, dydžiai ir maišos: `src/viggle_turbo_v03_model.json`. Montuotojas: `src/install_viggle_turbo_v03.py`. Naudoja atskirą `models/viggle-qwen-turbo-v03` katalogą, kai dalijasi įdiegtu baziniu modeliu ir esama Python aplinka. Jis neatnaujina priklausomybių ir neperrašo v0.1/v0.2.1.

Vaizdo modelio meniu yra:

- **Viggle v0.3 · 6 žingsniai, švaresni vaizdai**: oficialus šešių node sigmos grafikas, CFG1.
- **Viggle v0.3 · 9 žingsniai, patobulinta detalė**: septyni Turbo žingsniai, tada išjunkite LoRA, perjunkite kitą talpykloje saugomą KV perdavimą į ištraukimą ir naudokite bazinį modelį paskutiniams dviem veiksmams. Po to atkuriami LoRA ir elgesys pirmyn. Vien įprasto žingsnių skaičiaus nustatymas iki devynių nėra lygiavertis.

v0.3 palaiko iki trijų nuorodų, jokio neigiamo raginimo ir numatytąjį 1024px kvadratinį, kai pasirinkta. Išlieka ankstesni v0.2.1 numatytieji ir iPhone matmenys; pradinis modelis vis dar palaiko dešimt nuorodų. Galimi vietiniai dideli dydžiai, VAE plytelių klojimas ir esamas 8K tolesnis apdorojimas, tačiau ne kiekvienas derinys buvo išbandytas.

LoRA nėra sujungtas su BF16 svareliais; stiprumas yra 1. Planuoklis `shift_terminal` turi būti null. v0.3 gali būti mažiau grūdėtas, bet šiek tiek minkštesnis; negarantuojama, kad kiekvienu atveju jis pranoks senesnes versijas. Oficialūs devynių žingsnių laiko koeficientai nėra vietiniai etalonai.

## Patvirtinimas

`tests/viggle_model.mjs` naudoja izoliuotus retus modelio šviestuvus, kad patikrintų žingsnių skaičių, atskaitos ribas, didelio dydžio maršruto parinkimą ir parengties žymeklius. `tests/viggle_schedule.py` patikrina LoRA išjungimą po septinto veiksmo, vieno KV pakartotinio ištraukimo ir atkūrimo.

Šešių pakopų 512×512, sėklos 42 mėlynojo puodelio pavyzdys, užpildytas 52.98, įskaitant process/model pakrovimą. Buvo patikrinti matmenys ir tikras vaizdas. Pirmasis devynių žingsnių bandymas buvo sustabdytas, kai naujas teksto ryšys suaktyvino išteklių apsaugą; tai nebuvo išvados klaida.

Devynių etapų pakartotinis bandymas baigtas 65.42s 512×512, pradinė 42. Po septinto veiksmo jis perėjo prie bazinio modelio, atliko devynis veiksmus ir sukūrė tinkamus matmenis. Vizualiai apžiūrėjus green/magenta triukšmo nerasta. Vienas pavyzdys kiekvienam režimui nėra stabilus našumo etalonas. Tais paleidimais nebuvo patvirtintos kelios nuorodos, dideli vaizdai ir 8K tolesnis apdorojimas.
