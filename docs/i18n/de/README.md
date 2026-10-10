[Deutsch](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Bei diesen Dokumenten handelt es sich um maschinelle Übersetzungen öffentlicher Projekttexte, die nicht alle von Muttersprachlern überprüft wurden. Konsultieren Sie bei technischen Unklarheiten die englische oder chinesische Quelle. Es sind keine privaten Benutzerdaten enthalten.

# MacBook Pro Studio

Ein lokales Bild-, Chat- und experimentelles Videostudio für Apple Silicon Macs.

## Schnittstellensprache

Verwenden Sie das Sprachmenü oben rechts, um eine der 33-Sprachen auszuwählen. Der Browser merkt sich Ihre Auswahl. Sprachpakete werden lokal bereitgestellt; Beim Wechseln der Sprache werden Inhalte nicht an einen Online-Übersetzungsdienst gesendet. Benutzeransagen, Konversationen und gespeicherte Inhalte behalten ihre Originalsprache.

## Vorschau der Benutzeroberfläche

Diese Vorschauen verwenden die veröffentlichten Seitenstile. Alle Eingabeaufforderungen, Aufgaben-IDs, Zeitstempel, Illustrationen und Gespräche sind fiktive Demoinhalte, die für diese README-Datei erstellt wurden. Sie enthalten keine echten Konten, Benutzerbilder oder Chat-Aufzeichnungen. Die Abbildungen sind programmatisch gezeichnet, keine Modellbenchmarks oder Qualitätsansprüche.

### Bildstudio

Wählen Sie ein Modell, geben Sie eine Eingabeaufforderung ein und durchsuchen Sie Aufgaben und Bildergebnisse.

![Bildstudio mit fiktionalen Aufgaben und programmatisch gezeichneten Landschaftsillustrationen](../../images/image-studio-demo.en.png)

### Lokaler Chat

Chatten Sie im selben Studio und wählen Sie einen Antwortmodus und eine Antwortdauer aus.

![Lokaler Chat mit einem fiktiven, manuell geschriebenen Illustrationsplanungsgespräch](../../images/chat-studio-demo.en.png)

## Richten Sie einen neuen Mac ein

1. Klonen Sie dieses Repository.
2. Lesen Sie den [Bereitstellungsleitfaden](README-FIRST.txt) ([中文](../../../README-先读我.txt))].
3. Geben Sie die [Installationsaufforderung](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt))] an einen Codierungsassistenten auf dem Ziel-Mac weiter, um Abhängigkeiten zu installieren und models entsprechend für diese Hardware herunterzuladen.

Seiten: `/edit` für Bilder, `/chat` für Chat, `/video` für Video. Der Standard-Webport ist `1235`.

Bei diesem Repository handelt es sich um eine geprüfte Versions- und Migrationskopie. Es kann hinter der lokalen Entwicklung oder Produktion zurückbleiben. Ausgenommen sind Modellgewichtungen, virtuelle Umgebungen, Benutzeraufgaben, Chat-Aufzeichnungen, Referenzbilder und Kontokonfiguration. Eine vollständige Installation auf einer neuen Maschine wurde nicht validiert. Dies ist keine Ein-Klick-Anwendung.

## Repository-Inhalte

- `src/`: Frontend, Backend, Modellmanifeste, Installations- und Validierungstools.
- `tests/`: Tests; Einige erfordern die Installation von models oder die Ausführung von Diensten.
- `requirements/`: angeheftete Abhängigkeiten.
- `vendor/`: native Engine-Quelle, wobei die Upstream-Lizenzen beibehalten werden.
- `patches/`: angepinnte Versionen und Apple-Anpassungen.

Modelle und Drittanbieterquellen behalten ihre Upstream-Lizenzen. H3/ClipProj Apple-Unterstützung ist experimentell. Eine erfolgreiche Kurzprobe stellt nicht die Unterstützung für jede Auflösung oder Dauer dar.

## Anmeldung und Konten

Öffnen Sie auf dem Mac, auf dem der Dienst ausgeführt wird, `http://127.0.0.1:1235/setup`, um den ersten Administrator zu erstellen, und melden Sie sich dann von anderen Geräten aus an. Administratoren können Konten erstellen, deaktivieren und löschen sowie Passwörter zurücksetzen. Siehe [Kontodokumentation](accounts.md) ([中文](../../accounts.md)). Es gibt kein Standardpasswort. Kontodateien bleiben im runtime-Datenverzeichnis und dürfen nicht hochgeladen werden. Aufgaben bleiben gemeinsame Studiodaten.

## Viggle v0.3

Es stehen separate sechsstufige und neunstufige Detailmodi zur Verfügung, wobei die vorherige Standardeinstellung beibehalten wird. Siehe [Installation und Validierung](viggle-v03.md) ([中文](../../viggle-v03.md)). Laden Sie die Modellgewichte separat auf den Ziel-Mac herunter.
