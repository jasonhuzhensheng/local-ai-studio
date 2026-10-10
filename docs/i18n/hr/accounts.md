[Hrvatski](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ovi su dokumenti strojni prijevodi javnog teksta projekta i nisu svi pregledani od strane izvornih govornika. Konzultirajte engleski ili kineski izvor za tehničke nejasnoće. Nema podataka o privatnom korisniku.

# Računi web stranica

## Upotreba

Na Macu na kojem je pokrenut servis, otvorite `http://127.0.0.1:1235/setup` da biste kreirali prvog administratora. Korisnička imena sadrže 3–32 slova, znamenke, podvlake ili crtice i normalizirana su na mala slova. Lozinke sadrže znakove 12–128. Ne postoje zadane vjerodajnice. Udaljeni uređaji ne mogu tražiti početni administratorski račun.

Nakon postavljanja, neautentificirani uređaji vide stranicu za prijavu. Otvorite **Račun / Odjava** (`/account`) da biste promijenili lozinku ili se odjavili. Administratori mogu kreirati users/administrators, resetirati lozinke, disable/enable račune, mijenjati uloge i brisati račune. Brisanje i promjene dopuštenja zahtijevaju potvrdu. Poslužitelj sprječava brisanje, onemogućavanje ili degradiranje posljednjeg omogućenog administratora. Brisanjem računa ne brišu se zajednički zadaci.

Koristite izbornik jezika u gornjem desnom kutu za odabir 33 jezika. Preglednik pamti vaš odabir. Jezični paketi poslužuju se lokalno; promjena jezika ne šalje sadržaj online prevoditeljskoj usluzi. Korisnički upiti, razgovori i spremljeni sadržaj zadržavaju svoj izvorni jezik.

Ovo je zajednički studio. Prijavljeni korisnici dijele pristup slikama, videozapisima i zadacima chata na strani poslužitelja. Povijest chata preglednika ostaje u localStorage. Ne postoji izolacija s više stanara, pohrana zadataka po korisniku ili naplata. Ostaje postojeće ograničenje samo lokalnog videa.

## Skladištenje i zaštita

- `src/studio_auth.mjs` radi prije poslovnih ruta, uključujući API-je i image/reference/video datoteke. Neautorizirane stranice preusmjeravaju sa 303; API-ji i mediji vraćaju 401. Sredstva računa, jezična sredstva i status setup/sign-in koji nije tajni su javni.
- Datoteka računa: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, zadano `app/.local/auth/users.json`; namjenska implementacija koristi `runtime/auth/users.json`. Način imenika: 0700; način datoteke: 0600. Lozinke koriste scrypt N32768/r8/p1, nasumične soli i usporedbu hash vrijednosti u konstantnom vremenu. Zapisi su atomski, a promjene računa serijalizirane. Oštećena postojeća baza podataka sprječava pokretanje umjesto ponovnog otvaranja registracije.
- Sesije koriste 32 slučajne bajtove; poslužitelj pohranjuje samo sažetak. Kolačići su HttpOnly, SameSite=Strict, vrijede 12 sati. Ponovno pokretanje zahtijeva ponovnu prijavu. Password/role promjene, resetiranje, onemogućavanje i brisanje opoziva zahvaćene sesije. Odjava ne briše niti ponovno pokreće već započete zadatke.
- Za pisanje su potrebni Origin i JSON istog porijekla. X-Forwarded-For nije pouzdan. Svaki izvorni IP dobiva najviše 15 sign-in/setup/self-password-change pokušaja po 15 minuta. Ograničenja: 4 istovremena izvođenja lozinki i 100 računi. Ponovno pokretanje briše ograničenja pokušaja.
- Postojeća implementacija koristi HTTP preko privatnog Tailscale. Tailscale šifrira prijenos s uređaja na uređaj; obični LAN HTTP sam po sebi ne. Javni pristup i TLS nisu konfigurirani ovim paketom. Kolačići Secure postavljeni su samo za izvorne TLS zahtjeve. Nemojte ga izlagati izravno putem javnog HTTP-a.
- Nikada nemojte učitavati bazu podataka za provjeru autentičnosti, sesije ili lozinke. Inicijalizirajte nove račune prilikom migracije. stdio MCP, lokalne LM Studio i dopuštenja OS datoteka su izvan autentifikacije web stranice.

## Provjera valjanosti

Pokrenite `node tests/studio_auth.mjs` s njegovom privremenom bazom podataka računa i bez stvarnog models. Pokriva neautorizirano blokiranje API/media, izvorna ograničenja početnog postavljanja, uloge, hashing/file modove lozinke, zaštitu zadnjeg administratora, opoziv sesije, postojanost, odbijanje oštećene datoteke i ograničenja brzine.

Testovi local_chat, chat_background, image_studio i video_web prijavljuju se s izoliranim administratorima testa; nema premosnice za provjeru autentičnosti proizvodnje. Prave lozinke unosi korisnik i ne smiju se spremati u testove ili dokumentaciju.
