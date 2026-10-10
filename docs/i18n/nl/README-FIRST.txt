Nederlands | ../README.md
Deze documenten zijn machinevertalingen van openbare projectteksten en zijn niet allemaal door moedertaalsprekers beoordeeld. Raadpleeg de Engelse of Chinese bron voor technische dubbelzinnigheid. Er zijn geen privégebruikersgegevens opgenomen.

Local AI Studio: migratiebronpakket voor een nieuwe Apple Silicon Mac

Deze beoordeelde release bevat de frontend/backend-broncode, tests, modeldownloadmanifesten, vastgezette afhankelijkheden, native engine-bron en experimentele Apple-videopatches. Het kan achterlopen op de lokale ontwikkeling of productie.
Het sluit gewichten, virtuele omgevingen, eerdere taken, referentiebeelden, chatrecords, accountconfiguratie en geheimen uit. Het is geen app met één klik.

Geef deze hele map samen met INSTALL-PROMPT.en.txt aan een codeerassistent op de doel-Mac.
De originele validatiemachine was een M2 Max met 96GB-geheugen. Controleer eerst het doelmodel, het geheugen en het besturingssysteem. Gebruik video-instellingen niet blindelings op Macs met minder geheugen.

Inhoud:
 src/ Frontend, backend, download/validation-tools, modelmanifesten
 tests/-tests; sommige vereisen geïnstalleerde models/services.. Voer niet alles zonder onderscheid uit
 requirements/viggle-pinned.txt Vastgezette afbeeldingsomgeving
 src/h3_requirements.lock Aparte vastgezette video-omgeving
 vendor/ Native bron zonder gecompileerde binaire bestanden; upstream-licenties behouden
 patches/ ComfyUI/ClipProj voert Python-wijzigingen door en implementeert deze
 SHA256SUMS.txt Controlesommen per bestand

Modelingangspunten: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (basis model/adapters), wai_model.json, upscale_model.json en h3_apple_models.json (video), onder src/. Controleer elk manifest en het bijbehorende installatieprogramma voordat u het downloadt.
Tekstmodel: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, bestand Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Dit pakket bevat geen volledig vastgezette revision/hash voor dat model. Verkrijg en registreer eerst betrouwbare upstream-metagegevens; claim geen byte-voor-byte gelijkwaardigheid met de originele machine.

Een nieuwe machine-installatie is niet gevalideerd. Bekijk originele machinepaden, modelaliassen en systeemtoolpaden voor de doelgebruiker. Pas historische patches niet opnieuw toe op een reeds gewijzigde leveranciersbron. Een succesvolle download is geen bewijs van succesvolle gevolgtrekking of aanvaardbare kwaliteit.

Gebruik het taalmenu rechtsboven om uit de 33-talen te kiezen. De browser onthoudt uw selectie. Taalpakketten worden lokaal aangeboden; Bij het wisselen van taal wordt geen inhoud naar een online vertaaldienst verzonden. Gebruikersprompts, gesprekken en opgeslagen inhoud behouden hun oorspronkelijke taal.
