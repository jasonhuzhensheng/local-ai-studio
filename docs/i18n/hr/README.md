[Hrvatski](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ovi su dokumenti strojni prijevodi javnog teksta projekta i nisu svi pregledani od strane izvornih govornika. Konzultirajte engleski ili kineski izvor za tehničke nejasnoće. Nema podataka o privatnom korisniku.

# MacBook Pro Studio

Lokalni studio za slike, chat i eksperimentalni video za Apple Silicon Macove.

## Jezik sučelja

Koristite izbornik jezika u gornjem desnom kutu za odabir 33 jezika. Preglednik pamti vaš odabir. Jezični paketi poslužuju se lokalno; promjena jezika ne šalje sadržaj online prevoditeljskoj usluzi. Korisnički upiti, razgovori i spremljeni sadržaj zadržavaju svoj izvorni jezik.

## Pregledi sučelja

Ovi pregledi koriste objavljene stilove stranice. Sve upute, ID-ovi zadataka, vremenske oznake, ilustracije i razgovori izmišljeni su demo sadržaj stvoren za ovaj README. Ne sadrže stvarne račune, korisničke slike ili zapise razgovora. Ilustracije su programski nacrtane, a ne referentne vrijednosti modela ili tvrdnje o kvaliteti.

### Studio slika

Odaberite model, unesite upit i pregledajte zadatke i rezultate slika.

![Imidž studio s izmišljenim zadacima i programski nacrtanim pejzažnim ilustracijama](../../images/image-studio-demo.en.png)

### Lokalni chat

Razgovarajte u istom studiju i odaberite način odgovora i duljinu.

![Lokalni chat s izmišljenim, ručno napisanim razgovorom o planiranju ilustracija](../../images/chat-studio-demo.en.png)

## Postavite novi Mac

1. Kloniraj ovo spremište.
2. Pročitajte [vodič za implementaciju](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Dajte [instalacijski upit](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) pomoćniku za kodiranje na ciljnom Macu da instalira ovisnosti i preuzme models prikladan za taj hardver.

Stranice: `/edit` za slike, `/chat` za chat, `/video` za video. Zadani web priključak je `1235`.

Ovo spremište je pregledano izdanje i kopija za migraciju. Može zaostajati za lokalnim razvojem ili proizvodnjom. Isključuje težine modela, virtualna okruženja, korisničke zadatke, zapise razgovora, referentne slike i konfiguraciju računa. Potpuna instalacija na novi stroj nije potvrđena. Ovo nije aplikacija jednim klikom.

## Sadržaj spremišta

- `src/`: sučelje, pozadina, manifesti modela, alati za instalaciju i provjeru valjanosti.
- `tests/`: testovi; neki zahtijevaju instaliran models ili pokrenute usluge.
- `requirements/`: prikvačene ovisnosti.
- `vendor/`: izvorni izvor motora, uz zadržane licence za prethodni tok.
- `patches/`: zakačene verzije i Apple adaptacije.

Modeli i izvori treće strane zadržavaju svoje licence za uzlaznu verziju. H3/ClipProj Appleova podrška je eksperimentalna. Uspješan kratki uzorak ne uspostavlja podršku za svaku rezoluciju ili trajanje.

## Prijava i računi

Na Macu na kojem je pokrenut servis, otvorite `http://127.0.0.1:1235/setup` za kreiranje prvog administratora, zatim se prijavite s drugih uređaja. Administratori mogu stvarati, onemogućavati i brisati račune i poništavati lozinke. Pogledajte [dokumentaciju računa](accounts.md) ([中文](../../accounts.md)). Ne postoji zadana lozinka. Datoteke računa ostaju u direktoriju podataka runtime i ne smiju se učitavati. Zadaci ostaju zajednički studijski podaci.

## Viggle v0.3

Dostupni su zasebni načini detalja u šest i devet koraka, uz zadržavanje prethodnih zadanih postavki. Pogledajte [instalacija i provjera ](viggle-v03.md) ([中文](../../viggle-v03.md)). Odvojeno preuzmite težine modela na ciljnom Macu.
