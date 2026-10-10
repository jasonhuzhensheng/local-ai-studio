[Suomi](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Nämä asiakirjat ovat konekäännöksiä julkisesta projektitekstistä, eivätkä äidinkielenään puhujat ole kaikkia tarkistaneet. Tarkista tekniset epäselvyydet englannin tai kiinan lähteestä. Yksityisiä käyttäjätietoja ei ole mukana.

# Viggle v0.3 asennus ja tilat

Virallinen lähde: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Kiinnitetty versio, koot ja tiivisteet: `src/viggle_turbo_v03_model.json`. Asentaja: `src/install_viggle_turbo_v03.py`. Käyttää erillistä `models/viggle-qwen-turbo-v03`-hakemistoa jakaessaan asennetun perusmallin ja olemassa olevan Python-ympäristön. Se ei päivitä riippuvuuksia tai korvaa v0.1/v0.2.1.:tä

Kuvamallivalikko tarjoaa:

- **Viggle v0.3 · 6 vaiheet, puhtaammat kuvat**: virallinen kuuden node sigma-aikataulu, CFG1.
- **Viggle v0.3 · 9-vaiheet, parannetut yksityiskohdat**: seitsemän Turbo-vaihetta, poista sitten LoRA käytöstä, vaihda seuraava välimuistissa oleva KV-passi purkamiseen ja käytä perusmallia kahdessa viimeisessä vaiheessa. LoRA ja eteenpäin suuntautuva käyttäytyminen palautetaan myöhemmin. Pelkkä säännöllisen askelmäärän asettaminen yhdeksään ei ole sama asia.

v0.3 tukee enintään kolmea viittausta, ei negatiivista kehotetta ja 1024px-neliön oletusarvoa valittuna. Edellinen v0.2.1 oletus- ja iPhone-mitat säilyvät; alkuperäinen malli tukee edelleen kymmentä viittausta. Alkuperäiset suuret koot, VAE-laatoitus ja olemassa oleva 8K-jälkikäsittely ovat valittavissa, mutta kaikkia yhdistelmiä ei ole testattu.

LoRA:tä ei ole sulatettu BF16-painoihin; vahvuus on 1. Ajastimen `shift_terminal` on oltava null. v0.3 voi olla vähemmän rakeinen, mutta hieman pehmeämpi; ei ole taattu, että se olisi kaikissa tapauksissa parempi kuin vanhemmat versiot. Viralliset yhdeksän vaiheen ajoitussuhteet eivät ole paikallisia vertailuarvoja.

## Vahvistus

`tests/viggle_model.mjs` käyttää eristettyjä harvoja mallivalaisimia askelmäärän, referenssirajojen, suurikokoisten reititys- ja valmiusmerkkien tarkistamiseen. `tests/viggle_schedule.py` varmistaa LoRA:n poistamisen käytöstä vaiheen seitsemän, yhden KV:n uudelleenpurkamisen ja palauttamisen jälkeen.

Kuusivaiheinen 512×512, siemen-42 sininen kuppinäyte valmis 52.98:issä, mukaan lukien process/model-lataus. Mitat ja todellinen kuva tarkistettiin. Ensimmäinen yhdeksän vaiheen yritys pysähtyi, kun uusi tekstiyhteys laukaisi resurssien suojauksen; tämä ei ollut päättelyvirhe.

Yhdeksänvaiheinen uudelleenyritys suoritettiin 65.42:ssä osoitteessa 512×512, siemen 42. Se siirtyi perusmalliin vaiheen seitsemän jälkeen, suoritti yhdeksän vaihetta ja tuotti oikeat mitat. Silmämääräinen tarkastus ei löytänyt green/magenta-melua. Yksi näyte tilaa kohden ei ole vakaa suorituskyvyn vertailuarvo. Useita viittauksia, suuria kuvia ja 8K-jälkikäsittelyä ei vahvistettu näillä ajoilla.
