Deutsch | ../README.md
Bei diesen Dokumenten handelt es sich um maschinelle Übersetzungen öffentlicher Projekttexte, die nicht alle von Muttersprachlern überprüft wurden. Konsultieren Sie bei technischen Unklarheiten die englische oder chinesische Quelle. Es sind keine privaten Benutzerdaten enthalten.

Local AI Studio: Migrationsquellpaket für einen neuen Apple Silicon Mac

Diese überprüfte Version umfasst frontend/backend-Quelle, Tests, Modell-Download-Manifeste, angeheftete Abhängigkeiten, native Engine-Quelle und experimentelle Apple-Video-Patches. Es kann hinter der lokalen Entwicklung oder Produktion zurückbleiben.
Ausgenommen sind Gewichtungen, virtuelle Umgebungen, frühere Aufgaben, Referenzbilder, Chat-Aufzeichnungen, Kontokonfiguration und Geheimnisse. Es ist kein Ein-Klick-app.

Geben Sie diesen gesamten Ordner zusammen mit INSTALL-PROMPT.en.txt an einen Programmierassistenten auf dem Ziel-Mac weiter.
Die ursprüngliche Validierungsmaschine war ein M2 Max mit 96GB-Speicher. Überprüfen Sie zunächst das Zielmodell, den Speicher und das Betriebssystem. Verwenden Sie Videoeinstellungen auf Macs mit weniger Speicher nicht blind wieder.

Inhalt:
 src/ Frontend, Backend, download/validation Tools, Modellmanifeste
 tests/-Tests; Einige erfordern die Installation von models/services.. Führen Sie nicht alle wahllos aus
 requirements/viggle-pinned.txt Angeheftete Bildumgebung
 src/h3_requirements.lock Separate angeheftete Videoumgebung
 vendor/ Native Quelle ohne kompilierte Binärdateien; Upstream-Lizenzen behalten
 patches/ ComfyUI/ClipProj schreibt und stellt Python-Änderungen bereit
 SHA256SUMS.txt Prüfsummen pro Datei

Modelleinstiegspunkte: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (Basis model/adapters), wai_model.json, upscale_model.json und h3_apple_models.json (Video), unter src/. Überprüfen Sie jedes Manifest und sein Installationsprogramm vor dem Herunterladen.
Textmodell: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, Datei Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Dieses Paket enthält keinen komplett bestückten revision/hash für dieses Modell. Besorgen Sie sich zunächst vertrauenswürdige Upstream-Metadaten und zeichnen Sie diese auf. erheben keinen Anspruch auf Byte-für-Byte-Äquivalenz mit der Originalmaschine.

Eine Neuinstallation der Maschine wurde nicht validiert. Überprüfen Sie Originalmaschinenpfade, Modellaliase und Systemwerkzeugpfade für den Zielbenutzer. Wenden Sie historische Patches nicht erneut auf bereits geänderte Anbieterquellen an. Ein erfolgreicher Download ist kein Beweis für eine erfolgreiche Schlussfolgerung oder eine akzeptable Qualität.

Verwenden Sie das Sprachmenü oben rechts, um eine der 33-Sprachen auszuwählen. Der Browser merkt sich Ihre Auswahl. Sprachpakete werden lokal bereitgestellt; Beim Wechseln der Sprache werden Inhalte nicht an einen Online-Übersetzungsdienst gesendet. Benutzeransagen, Konversationen und gespeicherte Inhalte behalten ihre Originalsprache.
