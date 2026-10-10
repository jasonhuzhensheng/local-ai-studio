[Nederlands](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Deze documenten zijn machinevertalingen van openbare projectteksten en zijn niet allemaal door moedertaalsprekers beoordeeld. Raadpleeg de Engelse of Chinese bron voor technische dubbelzinnigheid. Er zijn geen privégebruikersgegevens opgenomen.

# Website-accounts

## Gebruik

Op de Mac waarop de service draait, opent u `http://127.0.0.1:1235/setup` om de eerste beheerder aan te maken. Gebruikersnamen bevatten letters, cijfers, onderstrepingstekens of koppeltekens 3–32 en zijn genormaliseerd naar kleine letters. Wachtwoorden bevatten 12–128-tekens. Er zijn geen standaardreferenties. Externe apparaten kunnen het initiële beheerdersaccount niet claimen.

Na de installatie zien niet-geverifieerde apparaten de inlogpagina. Open **Account / Afmelden** (`/account`) om uw wachtwoord te wijzigen of af te melden. Beheerders kunnen users/administrators aanmaken, wachtwoorden opnieuw instellen, disable/enable-accounts, rollen wijzigen en accounts verwijderen. Voor verwijdering en wijziging van rechten is bevestiging vereist. De server voorkomt dat de laatst ingeschakelde beheerder wordt verwijderd, uitgeschakeld of gedegradeerd. Als u een account verwijdert, worden gedeelde taken niet verwijderd.

Gebruik het taalmenu rechtsboven om uit de 33-talen te kiezen. De browser onthoudt uw selectie. Taalpakketten worden lokaal aangeboden; Bij het wisselen van taal wordt geen inhoud naar een online vertaaldienst verzonden. Gebruikersprompts, gesprekken en opgeslagen inhoud behouden hun oorspronkelijke taal.

Dit is een gedeelde studio. Ingelogde gebruikers delen toegang tot afbeeldingen, video's en chattaken op de server. Browserchatgeschiedenis blijft in localStorage. Er is geen isolatie van meerdere tenants, taakopslag per gebruiker of facturering. De bestaande videobeperking voor alleen lokaal gebruik blijft bestaan.

## Opslag en bescherming

- `src/studio_auth.mjs` draait vóór zakelijke routes, inclusief API's en image/reference/video-bestanden. Niet-geverifieerde pagina's worden omgeleid met 303; API's en media retourneren 401. Accountactiva, taalactiva en niet-geheime setup/sign-in-status zijn openbaar.
- Accountbestand: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, standaard `app/.local/auth/users.json`; de speciale implementatie maakt gebruik van `runtime/auth/users.json`. Directorymodus: 0700; bestandsmodus: 0600. Wachtwoorden gebruiken scrypt N32768/r8/p1, willekeurige salts en constante-time hash-vergelijking. Schrijfbewerkingen zijn atomair en accountwijzigingen zijn geserialiseerd. Een corrupte bestaande database verhindert het opstarten in plaats van het heropenen van de registratie.
- Sessies gebruiken willekeurige 32-bytes; de server slaat alleen de samenvatting op. Cookies zijn HttpOnly, SameSite=Strict, geldig gedurende 12-uren. Voor opnieuw opstarten is opnieuw inloggen vereist. Password/role-wijzigingen, resets, uitschakelen en verwijderen trekken de betreffende sessies in. Als u zich afmeldt, worden reeds gestarte taken niet verwijderd of opnieuw uitgevoerd.
- Voor schrijfbewerkingen zijn Origin en JSON van dezelfde oorsprong vereist. X-Forwarded-For wordt niet vertrouwd. Elk bron-IP krijgt maximaal 15 sign-in/setup/self-password-change-pogingen per 15-minuten. Limieten: 4 gelijktijdige wachtwoordafleidingen en 100-accounts. Door opnieuw te starten worden de pogingslimieten gewist.
- De bestaande implementatie gebruikt HTTP via privé Tailscale. Tailscale codeert apparaat-naar-apparaat-transport; gewone LAN HTTP zelf niet. Openbare toegang en TLS worden niet geconfigureerd door dit pakket. Secure-cookies worden alleen ingesteld voor native TLS-verzoeken. Stel het niet rechtstreeks via openbare HTTP beschikbaar.
- Upload nooit de authenticatiedatabase, sessies of wachtwoorden. Initialiseer nieuwe accounts tijdens de migratie. stdio MCP, lokale LM Studio en OS-bestandsrechten vallen buiten website-authenticatie.

## Validatie

Voer `node tests/studio_auth.mjs` uit met zijn tijdelijke accountdatabase en geen echte models. Het omvat niet-geverifieerde API/media-blokkering, oorsprongsbeperkingen voor de initiële installatie, rollen, wachtwoord-hashing/file-modi, bescherming van de laatste beheerder, intrekking van sessies, persistentie, afwijzing van corrupte bestanden en snelheidslimieten.

Bij de tests local_chat, chat_background, image_studio en video_web logt u in met geïsoleerde testbeheerders; er is geen bypass voor productie-authenticatie. Echte wachtwoorden worden door de gebruiker ingevoerd en mogen niet worden opgeslagen in tests of documentatie.
