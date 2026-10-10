[Deutsch](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Bei diesen Dokumenten handelt es sich um maschinelle Übersetzungen öffentlicher Projekttexte, die nicht alle von Muttersprachlern überprüft wurden. Konsultieren Sie bei technischen Unklarheiten die englische oder chinesische Quelle. Es sind keine privaten Benutzerdaten enthalten.

# Website-Konten

## Nutzung

Öffnen Sie auf dem Mac, auf dem der Dienst ausgeführt wird, `http://127.0.0.1:1235/setup`, um den ersten Administrator zu erstellen. Benutzernamen enthalten die Buchstaben 3–32, Ziffern, Unterstriche oder Bindestriche und werden in Kleinbuchstaben normalisiert. Passwörter enthalten die Zeichen 12–128. Es gibt keine Standardanmeldeinformationen. Remote-Geräte können das ursprüngliche Administratorkonto nicht beanspruchen.

Nach der Einrichtung wird für nicht authentifizierte Geräte die Anmeldeseite angezeigt. Öffnen Sie **Konto / Abmelden** (`/account`), um Ihr Passwort zu ändern oder sich abzumelden. Administratoren können users/administrators erstellen, Passwörter zurücksetzen, disable/enable-Konten erstellen, Rollen ändern und Konten löschen. Lösch- und Berechtigungsänderungen erfordern eine Bestätigung. Der Server verhindert das Löschen, Deaktivieren oder Herabstufen des zuletzt aktivierten Administrators. Durch das Löschen eines Kontos werden keine freigegebenen Aufgaben gelöscht.

Verwenden Sie das Sprachmenü oben rechts, um eine der 33-Sprachen auszuwählen. Der Browser merkt sich Ihre Auswahl. Sprachpakete werden lokal bereitgestellt; Beim Wechseln der Sprache werden Inhalte nicht an einen Online-Übersetzungsdienst gesendet. Benutzeransagen, Konversationen und gespeicherte Inhalte behalten ihre Originalsprache.

Dies ist ein Gemeinschaftsstudio. Angemeldete Benutzer teilen sich den Zugriff auf Bilder, Videos und serverseitige Chat-Aufgaben. Der Browser-Chat-Verlauf bleibt in localStorage. Es gibt keine Multi-Tenant-Isolation, keine Aufgabenspeicherung pro Benutzer oder keine Abrechnung. Die bestehende Beschränkung auf nur lokale Videos bleibt bestehen.

## Lagerung und Schutz

– `src/studio_auth.mjs` wird vor Geschäftsrouten ausgeführt, einschließlich APIs und image/reference/video-Dateien. Nicht authentifizierte Seiten werden mit 303 umgeleitet; APIs und Medien geben 401 zurück. Konto-Assets, Sprach-Assets und der nicht geheime setup/sign-in-Status sind öffentlich.
- Kontodatei: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, Standard `app/.local/auth/users.json`; Die dedizierte Bereitstellung verwendet `runtime/auth/users.json`. Verzeichnismodus: 0700; Dateimodus: 0600. Passwörter verwenden scrypt N32768/r8/p1, zufällige Salts und einen zeitkonstanten Hash-Vergleich. Schreibvorgänge sind atomar und Kontoänderungen werden serialisiert. Eine beschädigte vorhandene Datenbank verhindert den Start, anstatt die Registrierung erneut zu öffnen.
- Sitzungen verwenden zufällige 32-Bytes; Der Server speichert nur den Digest. Cookies sind HttpOnly, SameSite=Strict, gültig für 12 Stunden. Für einen Neustart ist eine erneute Anmeldung erforderlich. Durch Password/role werden betroffene Sitzungen durch Änderungen, Zurücksetzen, Deaktivieren und Löschen widerrufen. Durch das Abmelden werden bereits gestartete Aufgaben weder gelöscht noch erneut ausgeführt.
– Für Schreibvorgänge sind Origin und JSON gleichen Ursprungs erforderlich. X-Forwarded-For ist nicht vertrauenswürdig. Jede Quell-IP erhält höchstens 15 sign-in/setup/self-password-change-Versuche pro 15-Minuten. Einschränkungen: gleichzeitige 4-Passwortableitungen und 100-Konten. Durch einen Neustart werden die Versuchslimits gelöscht.
– Die vorhandene Bereitstellung verwendet HTTP über privates Tailscale. Tailscale verschlüsselt den Gerät-zu-Gerät-Transport; Bei gewöhnlichem LAN-HTTP selbst ist dies nicht der Fall. Öffentlicher Zugriff und TLS werden von diesem Paket nicht konfiguriert. Secure-Cookies werden nur für native TLS-Anfragen gesetzt. Stellen Sie es nicht direkt über öffentliches HTTP bereit.
- Laden Sie niemals die Authentifizierungsdatenbank, Sitzungen oder Passwörter hoch. Initialisieren Sie bei der Migration neue Konten. stdio MCP-, lokale LM Studio- und Betriebssystemdateiberechtigungen liegen außerhalb der Website-Authentifizierung.

## Validierung

Führen Sie `node tests/studio_auth.mjs` mit seiner temporären Kontodatenbank und ohne echtes models aus. Es umfasst die nicht authentifizierte API/media-Blockierung, Ursprungseinschränkungen bei der Ersteinrichtung, Rollen, Kennwort-hashing/file-Modi, Schutz durch den letzten Administrator, Sitzungswiderruf, Persistenz, Zurückweisung beschädigter Dateien und Ratenbegrenzungen.

Die Tests local_chat, chat_background, image_studio und video_web melden sich mit isolierten Testadministratoren an; Es gibt keine Umgehung der Produktionsauthentifizierung. Echte Passwörter werden vom Benutzer eingegeben und dürfen nicht in Tests oder Dokumentationen gespeichert werden.
