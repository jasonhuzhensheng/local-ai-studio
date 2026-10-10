[Suomi](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Nämä asiakirjat ovat konekäännöksiä julkisesta projektitekstistä, eivätkä äidinkielenään puhujat ole kaikkia tarkistaneet. Tarkista tekniset epäselvyydet englannin tai kiinan lähteestä. Yksityisiä käyttäjätietoja ei ole mukana.

# MacBook Pro Studio

Paikallinen kuva-, keskustelu- ja kokeellinen videostudio Apple Silicon Mac -tietokoneille.

## Käyttöliittymän kieli

Käytä oikeassa yläkulmassa olevaa kielivalikkoa valitaksesi 33-kielistä. Selain muistaa valintasi. Kielipaketteja tarjoillaan paikallisesti; kielen vaihtaminen ei lähetä sisältöä online-käännöspalveluun. Käyttäjien kehotteet, keskustelut ja tallennettu sisältö säilyttävät alkuperäisen kielensä.

## Käyttöliittymän esikatselut

Näissä esikatseluissa käytetään julkaistuja sivutyylejä. Kaikki kehotteet, tehtävätunnukset, aikaleimat, kuvat ja keskustelut ovat kuvitteellista esittelysisältöä, joka on luotu tätä README:tä varten. Ne eivät sisällä oikeita tilejä, käyttäjäkuvia tai chat-tietueita. Kuvat on piirretty ohjelmallisesti, eivät mallien vertailuarvoja tai laatuvaatimuksia.

### Kuvastudio

Valitse malli, kirjoita kehote ja selaa tehtäviä ja kuvatuloksia.

![Kuvastudio, jossa on fiktiivisiä tehtäviä ja ohjelmallisesti piirrettyjä maisemakuvia](../../images/image-studio-demo.en.png)

### Paikallinen chat

Keskustele samassa studiossa ja valitse vastaustila ja pituus.

![Paikallinen keskustelu kuvitteellisella, manuaalisesti kirjoitetulla kuvitusta suunnittelevalla keskustelulla](../../images/chat-studio-demo.en.png)

## Asenna uusi Mac

1. Kloonaa tämä arkisto.
2. Lue [käyttöönottoopas](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Anna [asennuskehote](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) kohde-Macin koodausavustajalle riippuvuuksien asentamista varten ja lataa kyseiselle laitteistolle sopiva models.

Sivut: `/edit` kuville, `/chat` chatille, `/video` videoille. Oletusverkkoportti on `1235`.

Tämä arkisto on tarkistettu julkaisu- ja siirtokopio. Se voi jäädä jälkeen paikallisesta kehityksestä tai tuotannosta. Se ei sisällä mallipainot, virtuaaliympäristöt, käyttäjätehtävät, keskustelutietueet, viitekuvat ja tilin määritykset. Täydellistä asennusta uuteen koneeseen ei ole vahvistettu. Tämä ei ole yhden napsautuksen sovellus.

## Arkiston sisältö

- `src/`: käyttöliittymä, taustajärjestelmä, malliluettelot, asennus- ja validointityökalut.
- `tests/`: testit; Jotkut vaativat asennetun models:n tai käynnissä olevat palvelut.
- `requirements/`: kiinnitetyt riippuvuudet.
- `vendor/`: alkuperäinen moottorin lähde, alkupään lisenssit säilytetään.
- `patches/`: kiinnitetyt versiot ja Applen mukautukset.

Mallit ja kolmannen osapuolen lähde säilyttävät alkupään lisenssinsä. H3/ClipProj Applen tuki on kokeellista. Onnistunut lyhyt näyte ei anna tukea jokaiselle resoluutiolle tai kestolle.

## Kirjautuminen ja tilit

Luo ensimmäinen järjestelmänvalvoja avaamalla palvelua käyttävässä Macissa `http://127.0.0.1:1235/setup` ja kirjaudu sitten sisään muilta laitteilta. Järjestelmänvalvojat voivat luoda, poistaa käytöstä ja poistaa tilejä sekä nollata salasanoja. Katso [tilidokumentaatio](accounts.md) ([中文](../../accounts.md)). Oletussalasanaa ei ole. Tilitiedostot pysyvät runtime-datahakemistossa, eikä niitä saa ladata. Tehtävät pysyvät jaettuna studion datana.

## Viggle v0.3

Erilliset kuusi- ja yhdeksänvaiheiset yksityiskohdat ovat käytettävissä, ja edellinen oletusarvo säilyy. Katso [asennus ja validointi](viggle-v03.md) ([中文](../../viggle-v03.md)). Lataa mallin painot erikseen kohde-Maciin.
