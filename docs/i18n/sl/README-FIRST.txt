Slovenščina | ../README.md
Ti dokumenti so strojni prevodi javnega projektnega besedila in niso vseh pregledali naravni govorci. Za tehnične nejasnosti se obrnite na angleški ali kitajski vir. Zasebni uporabniški podatki niso vključeni.

Local AI Studio: selitveni izvorni paket za nov Apple Silicon Mac

Ta pregledana izdaja vključuje vir frontend/backend, teste, manifeste prenosa modela, pripete odvisnosti, izvirni izvor motorja in eksperimentalne Apple video popravke. Lahko zaostaja za lokalnim razvojem ali proizvodnjo.
Izključuje uteži, virtualna okolja, prejšnje naloge, referenčne slike, zapise klepetov, konfiguracijo računa in skrivnosti. To ni app z enim klikom.

Predajte to celotno mapo pomočniku za kodiranje na ciljnem Macu skupaj z INSTALL-PROMPT.en.txt.
Prvotni validacijski stroj je bil M2 Max s pomnilnikom 96GB. Najprej preverite ciljni model, pomnilnik in OS. V računalnikih Mac z manj pomnilnika ne uporabljajte na slepo video nastavitev.

Vsebina:
 src/ Frontend, backend, orodja download/validation, manifesti modela
 tests/ testi; nekateri zahtevajo nameščen models/services. Ne izvajajte vseh brez razlikovanja
 requirements/viggle-pinned.txt Okolje pripete slike
 src/h3_requirements.lock Ločeno pripeto video okolje
 vendor/ Izvorni izvor brez prevedenih binarnih datotek; obdržati licence navzgor
 patches/ ComfyUI/ClipProj objavi in uvede spremembe Python
 SHA256SUMS.txt Kontrolne vsote po datotekah

Vstopne točke modela: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (osnova model/adapters), wai_model.json, upscale_model.json in h3_apple_models.json (video), pod src/. Preverite vsak manifest in njegov namestitveni program pred prenosom.
Besedilni model: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, datoteka Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Ta paket ne vključuje celotnega pripetega revision/hash za ta model. Najprej pridobite in zabeležite zaupanja vredne metapodatke navzgor; ne zahtevajte enakovrednosti bajt za bajt originalnemu stroju.

Namestitev novega stroja ni bila potrjena. Preglejte poti izvirnega stroja, vzdevke modelov in poti sistemskih orodij za ciljnega uporabnika. Ne uporabljajte znova zgodovinskih popravkov za že spremenjen vir dobavitelja. Uspešen prenos ni dokaz uspešnega sklepanja ali sprejemljive kakovosti.

Za izbiro jezikov 33 uporabite jezikovni meni zgoraj desno. Brskalnik si zapomni vašo izbiro. Jezikovni paketi so na voljo lokalno; preklapljanje med jeziki ne pošlje vsebine spletni prevajalski storitvi. Uporabniški pozivi, pogovori in shranjena vsebina ohranjajo izvirni jezik.
