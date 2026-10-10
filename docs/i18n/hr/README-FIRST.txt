Hrvatski | ../README.md
Ovi su dokumenti strojni prijevodi javnog teksta projekta i nisu svi pregledani od strane izvornih govornika. Konzultirajte engleski ili kineski izvor za tehničke nejasnoće. Nema podataka o privatnom korisniku.

Local AI Studio: migracijski izvorni paket za novi Apple Silicon Mac

Ovo recenzirano izdanje uključuje izvor frontend/backend, testove, manifeste preuzimanja modela, prikvačene ovisnosti, izvorni izvor motora i eksperimentalne Apple video zakrpe. Može zaostajati za lokalnim razvojem ili proizvodnjom.
Isključuje težine, virtualna okruženja, prethodne zadatke, referentne slike, zapise razgovora, konfiguraciju računa i tajne. It is not a one-click app.

Dajte cijelu ovu mapu pomoćniku za kodiranje na ciljnom Macu, zajedno sa INSTALL-PROMPT.en.txt.
Izvorni stroj za provjeru valjanosti bio je M2 Max sa 96GB memorije. Prvo provjerite ciljni model, memoriju i OS. Nemojte ponovno slijepo koristiti video postavke na Mac računalima s manje memorije.

Sadržaj:
 src/ Frontend, backend, download/validation alati, manifesti modela
 tests/                        Tests; neki zahtijevaju instaliran models/services. Ne pokrećite sve bez razlike
 requirements/viggle-pinned.txt Pinned image environment
 src/h3_requirements.lock      Separate pinned video environment
 vendor/ Izvorni izvor bez kompajliranih binarnih datoteka; zadržati upstream licence
 patches/ ComfyUI/ClipProj predaje i implementira Python promjene
 SHA256SUMS.txt                Per-file checksums

Ulazne točke modela: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (baza model/adapters), wai_model.json, upscale_model.json i h3_apple_models.json (video), pod src/. Provjerite svaki manifest i njegov instalacijski program prije preuzimanja.
Text model: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, file Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Ovaj paket ne uključuje kompletan pribadani revision/hash za taj model. Najprije nabavite i zabilježite pouzdane upstream metapodatke; ne zahtijevaju bajt-za-bajt ekvivalentnost izvornom stroju.

Instalacija novog stroja nije potvrđena. Pregledajte putanje izvornog stroja, pseudonime modela i putanje alata sustava za ciljnog korisnika. Nemojte ponovno primjenjivati ​​povijesne zakrpe na već modificirani izvor dobavljača. Uspješno preuzimanje nije dokaz uspješnog zaključivanja ili prihvatljive kvalitete.

Koristite izbornik jezika u gornjem desnom kutu za odabir 33 jezika. Preglednik pamti vaš odabir. Jezični paketi poslužuju se lokalno; promjena jezika ne šalje sadržaj online prevoditeljskoj usluzi. Korisnički upiti, razgovori i spremljeni sadržaj zadržavaju svoj izvorni jezik.
