[Suomi](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Nämä asiakirjat ovat konekäännöksiä julkisesta projektitekstistä, eivätkä äidinkielenään puhujat ole kaikkia tarkistaneet. Tarkista tekniset epäselvyydet englannin tai kiinan lähteestä. Yksityisiä käyttäjätietoja ei ole mukana.

# Verkkosivustotilit

## Käyttö

Palvelua käyttävässä Macissa avaa ensimmäinen järjestelmänvalvoja avaamalla `http://127.0.0.1:1235/setup`. Käyttäjätunnukset sisältävät 3–32-kirjaimia, numeroita, alaviivoja tai yhdysmerkkejä, ja ne on normalisoitu pieniksi kirjaimiksi. Salasanat sisältävät 12–128-merkkejä. Oletustunnuksia ei ole. Etälaitteet eivät voi lunastaa alkuperäistä järjestelmänvalvojan tiliä.

Asennuksen jälkeen todentamattomat laitteet näkevät kirjautumissivun. Avaa **Tili / Kirjaudu ulos** (`/account`) vaihtaaksesi salasanasi tai kirjautuaksesi ulos. Järjestelmänvalvojat voivat luoda users/administrators:n, nollata salasanoja, disable/enable-tilejä, muuttaa rooleja ja poistaa tilejä. Poistaminen ja lupamuutokset vaativat vahvistuksen. Palvelin estää viimeksi käytössä olevan järjestelmänvalvojan poistamisen, poistamisen tai alentamisen. Tilin poistaminen ei poista jaettuja tehtäviä.

Käytä oikeassa yläkulmassa olevaa kielivalikkoa valitaksesi 33-kielistä. Selain muistaa valintasi. Kielipaketteja tarjoillaan paikallisesti; kielen vaihtaminen ei lähetä sisältöä online-käännöspalveluun. Käyttäjien kehotteet, keskustelut ja tallennettu sisältö säilyttävät alkuperäisen kielensä.

Tämä on jaettu studio. Kirjautuneet käyttäjät jakavat pääsyn kuviin, videoihin ja palvelinpuolen chat-tehtäviin. Selaimen chat-historia säilyy muodossa localStorage. Ei ole usean vuokraajan eristämistä, käyttäjäkohtaista tehtävien tallennusta tai laskutusta. Nykyinen vain paikallista videota koskeva rajoitus säilyy.

## Varastointi ja suojaus

- `src/studio_auth.mjs` toimii ennen liikereittejä, mukaan lukien API- ja image/reference/video-tiedostot. Todentamattomat sivut uudelleenohjaavat 303:n avulla; API ja media palauttavat 401:n. Tilivarat, kieliomaisuus ja ei-salaisuus setup/sign-in ovat julkisia.
- Tilitiedosto: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, oletus `app/.local/auth/users.json`; omistettu käyttöönotto käyttää `runtime/auth/users.json`:tä. Hakemistotila: 0700; tiedostotila: 0600. Salasanat käyttävät scrypt N32768/r8/p1, satunnaisia ​​suoloja ja jatkuvan ajan hash-vertailua. Kirjoitukset ovat atomeja ja tilimuutokset sarjoitetaan. Vioittunut olemassa oleva tietokanta estää käynnistyksen rekisteröinnin uudelleen avaamisen sijaan.
- Istunnot käyttävät satunnaisia ​​32-tavuja; palvelin tallentaa vain yhteenvedon. Evästeet ovat HttpOnly, SameSite=Strict, voimassa 12 tuntia. Uudelleenkäynnistys vaatii kirjautumisen uudelleen. Password/role:n muutokset, nollaukset, käytöstä poistaminen ja poistaminen peruuttavat vaikuttaneet istunnot. Uloskirjautuminen ei poista tai suorita uudelleen jo aloitettuja tehtäviä.
- Kirjoitukset vaativat samaa alkuperää olevat Origin ja JSON. X-Forwarded-For ei ole luotettava. Jokainen lähde-IP saa enintään 15 sign-in/setup/self-password-change -yritystä 15 minuuttia kohti. Rajat: 4 samanaikaiset salasanajohdannaiset ja 100-tilit. Uudelleenkäynnistys tyhjentää yritysrajat.
- Nykyinen käyttöönotto käyttää HTTP:tä yksityisen Tailscale:n kautta. Tailscale salaa laitteiden välisen kuljetuksen; tavallinen LAN HTTP sinänsä ei. Tämä paketti ei määritä julkista pääsyä ja TLS:ää. Secure-evästeet asetetaan vain alkuperäisille TLS-pyynnöille. Älä paljasta sitä suoraan julkisen HTTP:n kautta.
- Älä koskaan lataa todennustietokantaa, istuntoja tai salasanoja. Alusta uudet tilit siirron aikana. stdio MCP, paikallinen LM Studio ja käyttöjärjestelmän tiedostooikeudet ovat verkkosivuston todennuksen ulkopuolella.

## Vahvistus

Suorita `node tests/studio_auth.mjs` tilapäisen tilitietokannan kanssa ilman todellista models:tä. Se kattaa todentamattoman API/media-eston, alkuasennuksen alkuperärajoitukset, roolit, salasanan hashing/file-tilat, viimeisen järjestelmänvalvojan suojauksen, istunnon peruutuksen, pysyvyyden, korruptoituneiden tiedostojen hylkäämisen ja nopeusrajoitukset.

Local_chat-, chat_background-, image_studio- ja video_web-testit kirjautuvat sisään yksittäisten testijärjestelmänvalvojien kanssa; tuotannon todennuksen ohitusta ei ole. Käyttäjä syöttää oikeat salasanat, eikä niitä saa tallentaa testeihin tai dokumentaatioon.
