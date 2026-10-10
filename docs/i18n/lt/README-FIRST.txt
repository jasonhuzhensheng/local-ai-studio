Lietuvių | ../README.md
Šie dokumentai yra mašininiai viešojo projekto teksto vertimai ir ne visi buvo peržiūrėti gimtakalbių. Dėl techninių neaiškumų kreipkitės į anglų arba kinų šaltinį. Privatūs vartotojo duomenys neįtraukti.

Local AI Studio: perkėlimo šaltinio paketas naujam Apple Silicon Mac

Į šią peržiūrėtą leidimą įtrauktas frontend/backend šaltinis, testai, modelio atsisiuntimo aprašai, prisegtos priklausomybės, vietinis variklio šaltinis ir eksperimentinės Apple vaizdo pataisos. Jis gali atsilikti nuo vietos plėtros ar gamybos.
Tai neapima svorio, virtualios aplinkos, ankstesnių užduočių, nuorodų vaizdų, pokalbių įrašų, paskyros konfigūracijos ir paslapčių. Tai nėra vieno paspaudimo app.

Suteikite visą šį aplanką kodavimo asistentui tiksliniame „Mac“ kompiuteryje kartu su INSTALL-PROMPT.en.txt.
Originali patvirtinimo mašina buvo M2 Max su 96GB atmintimi. Pirmiausia patikrinkite tikslinį modelį, atmintį ir OS. Nenaudokite vaizdo nustatymų pakartotinai aklai mažesnės atminties turinčiuose „Mac“ kompiuteriuose.

Turinys:
 src/ Frontend, backend, download/validation įrankiai, modelių aprašai
 tests/ testai; kai kuriems reikia įdiegti models/services. Neleiskite visų be atrankos
 requirements/viggle-pinned.txt Prisegta vaizdo aplinka
 src/h3_requirements.lock Atskira prisegta vaizdo aplinka
 vendor/ Vietinis šaltinis be sukompiliuotų dvejetainių failų; išlaikyti ankstesnes licencijas
 patches/ ComfyUI/ClipProj atlieka ir įdiegia Python pakeitimus
 SHA256SUMS.txt Failų kontrolinės sumos

Modelio įėjimo taškai: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (pagrindas model/adapters), wai_model.json, upscale_model.json ir h3_apple_models.json (vaizdo įrašas), dalyje src/. Prieš atsisiųsdami patikrinkite kiekvieną aprašą ir jo diegimo programą.
Tekstinis modelis: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, failas Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Šiame pakete nėra viso prisegto revision/hash, skirto tam modeliui. Pirmiausia gaukite ir įrašykite patikimus metaduomenis; nereikalaukite baitų baitų ekvivalentiškumo originaliam įrenginiui.

Naujos mašinos įdiegimas nebuvo patvirtintas. Peržiūrėkite tikslinio vartotojo originalaus įrenginio kelius, modelio slapyvardžius ir sistemos įrankių kelius. Nenaudokite istorinių pataisų iš naujo jau pakeistam tiekėjo šaltiniui. Sėkmingas atsisiuntimas nėra sėkmingos išvados ar priimtinos kokybės įrodymas.

Norėdami pasirinkti iš 33 kalbų, naudokite viršutiniame dešiniajame kampe esantį kalbos meniu. Naršyklė įsimena jūsų pasirinkimą. Kalbų paketai teikiami vietoje; kalbų perjungimas nesiunčia turinio į internetinę vertimo paslaugą. Vartotojų raginimai, pokalbiai ir išsaugotas turinys išlaiko originalią kalbą.
