[Deutsch](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Bei diesen Dokumenten handelt es sich um maschinelle Übersetzungen öffentlicher Projekttexte, die nicht alle von Muttersprachlern überprüft wurden. Konsultieren Sie bei technischen Unklarheiten die englische oder chinesische Quelle. Es sind keine privaten Benutzerdaten enthalten.

# Viggle v0.3 Installation und Modi

Offizielle Quelle: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Angepinnte Revision, Größen und Hashes: `src/viggle_turbo_v03_model.json`. Installer: `src/install_viggle_turbo_v03.py`. Verwendet ein separates `models/viggle-qwen-turbo-v03`-Verzeichnis und teilt gleichzeitig das installierte Basismodell und die vorhandene Python-Umgebung. Abhängigkeiten werden nicht aktualisiert und v0.1/v0.2.1. wird nicht überschrieben

Das Bildmodell-Menü bietet:

- **Viggle v0.3 · 6-Schritte, sauberere Bilder**: offizieller Six-node-Sigma-Zeitplan, CFG1.
- **Viggle v0.3 · 9-Schritte, verbesserte Details**: sieben Turbo-Schritte, dann LoRA deaktivieren, den nächsten zwischengespeicherten KV-Durchlauf auf Extraktion umstellen und das Basismodell für die letzten beiden Schritte verwenden. LoRA und Vorwärtsverhalten werden danach wiederhergestellt. Das bloße Festlegen einer regulären Schrittzahl auf neun ist nicht gleichbedeutend.

v0.3 unterstützt bis zu drei Referenzen, keine negative Eingabeaufforderung und bei Auswahl einen quadratischen 1024px-Standardwert. Die vorherigen Standard- und iPhone-Abmessungen von v0.2.1 bleiben erhalten; Das Originalmodell unterstützt noch zehn Referenzen. Native große Größen, VAE-Kacheln und die vorhandene 8K-Nachbearbeitung bleiben wählbar, aber nicht jede Kombination wurde getestet.

Das LoRA ist nicht mit den BF16-Gewichten verschmolzen; Stärke ist 1. Der Scheduler `shift_terminal` muss null sein. v0.3 kann weniger körnig, aber etwas weicher sein; Es ist nicht garantiert, dass es in jedem Fall ältere Versionen übertrifft. Offizielle Neun-Schritt-Timing-Verhältnisse sind keine lokalen Benchmarks.

## Validierung

`tests/viggle_model.mjs` verwendet isolierte, spärliche Modellvorrichtungen, um Schrittzahlen, Referenzgrenzen, große Routing- und Bereitschaftsmarkierungen zu überprüfen. `tests/viggle_schedule.py` überprüft die Deaktivierung des LoRA nach Schritt sieben, einer KV-Reextraktion und Wiederherstellung.

Eine sechsstufige 512×512, Seed-42 Blue-Cup-Probe, abgeschlossen in 52.98s, einschließlich process/model-Beladung. Abmessungen und das tatsächliche Bild wurden überprüft. Der erste Neun-Schritte-Versuch wurde abgebrochen, als eine neue Textverbindung den Ressourcenschutz auslöste; Dies war kein Schlussfolgerungsfehler.

Der neunstufige Wiederholungsversuch wurde in 65.42s bei 512×512, Seed 42, abgeschlossen. Nach Schritt sieben wechselte es zum Basismodell, absolvierte neun Schritte und stellte die korrekten Abmessungen her. Bei der Sichtprüfung wurden keine green/magenta-Geräusche festgestellt. Ein Sample pro Modus ist kein stabiler Leistungsmaßstab. Mehrere Referenzen, große Bilder und 8K-Nachbearbeitung wurden durch diese Läufe nicht validiert.
