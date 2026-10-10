[Lietuvių](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Šie dokumentai yra mašininiai viešojo projekto teksto vertimai ir ne visi buvo peržiūrėti gimtakalbių. Dėl techninių neaiškumų kreipkitės į anglų arba kinų šaltinį. Privatūs vartotojo duomenys neįtraukti.

# MacBook Pro Studio

Vietinė vaizdo, pokalbių ir eksperimentinė vaizdo įrašų studija, skirta Apple Silicon Mac kompiuteriams.

## Sąsajos kalba

Norėdami pasirinkti iš 33 kalbų, naudokite viršutiniame dešiniajame kampe esantį kalbos meniu. Naršyklė įsimena jūsų pasirinkimą. Kalbų paketai teikiami vietoje; kalbų perjungimas nesiunčia turinio į internetinę vertimo paslaugą. Vartotojų raginimai, pokalbiai ir išsaugotas turinys išlaiko originalią kalbą.

## Sąsajos peržiūros

Šiose peržiūrose naudojami išleisti puslapių stiliai. Visi raginimai, užduočių ID, laiko žymos, iliustracijos ir pokalbiai yra išgalvotas demonstracinis turinys, sukurtas šiam README. Juose nėra tikrų paskyrų, vartotojų vaizdų ar pokalbių įrašų. Iliustracijos yra programiškai nupieštos, o ne modelio etalonas ar kokybės teiginiai.

### Vaizdo studija

Pasirinkite modelį, įveskite raginimą ir naršykite užduotis bei vaizdo rezultatus.

![Vaizdo studija su išgalvotomis užduotimis ir programiškai pieštomis kraštovaizdžio iliustracijomis](../../images/image-studio-demo.en.png)

### Vietinis pokalbis

Kalbėkitės toje pačioje studijoje ir pasirinkite atsakymo režimą bei trukmę.

![Vietinis pokalbis su išgalvotu, rankiniu būdu parašytu iliustracijų planavimo pokalbiu](../../images/chat-studio-demo.en.png)

## Nustatykite naują „Mac“.

1. Klonuoti šią saugyklą.
2. Perskaitykite [diegimo vadovą](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Suteikite [installation prompt](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) kodavimo asistentui tiksliniame "Mac", kad jis įdiegtų priklausomybes ir atsisiųstų tai aparatinei įrangai tinkamą models.

Puslapiai: `/edit` vaizdams, `/chat` pokalbiams, `/video` vaizdo įrašams. Numatytasis žiniatinklio prievadas yra `1235`.

Ši saugykla yra peržiūrėta leidimo ir perkėlimo kopija. Jis gali atsilikti nuo vietos plėtros ar gamybos. Tai neapima modelio svorio, virtualios aplinkos, vartotojo užduočių, pokalbių įrašų, nuorodų vaizdų ir paskyros konfigūracijos. Visiškas diegimas naujame įrenginyje nebuvo patvirtintas. Tai nėra vieno paspaudimo programa.

## Saugyklos turinys

- `src/`: frontend, backend, modelio aprašai, diegimo ir patvirtinimo įrankiai.
- `tests/`: testai; kai kuriems reikia įdiegti models arba veikiančias paslaugas.
- `requirements/`: prisegtos priklausomybės.
- `vendor/`: vietinis variklio šaltinis, su ankstesnėmis licencijomis.
- `patches/`: prisegtos versijos ir Apple adaptacijos.

Modeliai ir trečiosios šalies šaltinis išlaiko savo ankstesnes licencijas. H3/ClipProj Apple palaikymas yra eksperimentinis. Sėkmingas trumpas pavyzdys nenustato kiekvienos skiriamosios gebos ar trukmės palaikymo.

## Prisijungimas ir paskyros

„Mac“ kompiuteryje, kuriame veikia paslauga, atidarykite `http://127.0.0.1:1235/setup`, kad sukurtumėte pirmąjį administratorių, tada prisijunkite iš kitų įrenginių. Administratoriai gali kurti, išjungti ir ištrinti paskyras bei iš naujo nustatyti slaptažodžius. Žr. [sąskaitos dokumentacija](accounts.md) ([中文](../../accounts.md)). Nėra numatytojo slaptažodžio. Paskyros failai lieka runtime duomenų kataloge ir negali būti įkelti. Užduotys išlieka bendrinamos studijos duomenimis.

## Viggle v0.3

Galimi atskiri šešių ir devynių žingsnių išsamios informacijos režimai, išlaikant ankstesnius numatytuosius nustatymus. Žr. [įdiegimas ir patvirtinimas](viggle-v03.md) ([中文](../../viggle-v03.md)). Atskirai atsisiųskite modelio svorius tiksliniame „Mac“.
