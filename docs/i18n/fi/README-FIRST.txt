Suomi | ../README.md
Nämä asiakirjat ovat konekäännöksiä julkisesta projektitekstistä, eivätkä äidinkielenään puhujat ole kaikkia tarkistaneet. Tarkista tekniset epäselvyydet englannin tai kiinan lähteestä. Yksityisiä käyttäjätietoja ei ole mukana.

Local AI Studio: siirtolähdepaketti tuoreelle Apple Silicon Macille

Tämä tarkistettu julkaisu sisältää frontend/backend-lähdekoodin, testit, mallin latausluettelot, kiinnitetyt riippuvuudet, alkuperäisen moottorin lähteen ja kokeelliset Applen videokorjaukset. Se voi jäädä jälkeen paikallisesta kehityksestä tai tuotannosta.
Se ei sisällä painot, virtuaaliympäristöt, aiemmat tehtävät, viitekuvat, chat-tietueet, tilin määritykset ja salaisuudet. Se ei ole yhden napsautuksen app.

Anna koko kansio kohde-Macin koodausavustajalle yhdessä INSTALL-PROMPT.en.txt:n kanssa.
Alkuperäinen validointikone oli M2 Max, jossa oli 96GB-muisti. Tarkista ensin kohdemalli, muisti ja käyttöjärjestelmä. Älä käytä videoasetuksia uudelleen sokeasti pienemmän muistin omaavissa Maceissa.

Sisältö:
 src/ Frontend, backend, download/validation työkalut, malliluettelot
 tests/ Testit; Jotkut vaativat asennettua models/services. Älä suorita kaikkia umpimähkäisesti
 requirements/viggle-pinned.txt Kiinnitetty kuvaympäristö
 src/h3_requirements.lock Erillinen kiinnitetty videoympäristö
 vendor/ Alkuperäinen lähde ilman käännettyjä binaaritiedostoja; säilyttää alkupään lisenssit
 patches/ ComfyUI/ClipProj sitoutuu ja ottaa käyttöön Python-muutokset
 SHA256SUMS.txt Tiedostokohtaiset tarkistussummat

Mallin sisääntulokohdat: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (perus model/adapters), wai_model.json, upscale_model.json ja h3_apple_models.json (video), kohdassa src/. Tarkista jokainen luettelo ja sen asennusohjelma ennen latausta.
Tekstimalli: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, tiedosto Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Tämä paketti ei sisällä täydellistä kiinnitettyä revision/hash:tä kyseiselle mallille. Hanki ja tallenna ensin luotetut alkupään metatiedot; älä vaadi tavukohtaista vastaavuutta alkuperäisen koneen kanssa.

Tuoreen koneen asennusta ei ole vahvistettu. Tarkista kohdekäyttäjän alkuperäisen koneen polut, mallialiakset ja järjestelmätyökalupolut. Älä lisää historiallisia korjaustiedostoja uudelleen jo muokattuun toimittajalähteeseen. Onnistunut lataus ei ole todiste onnistuneesta päätelmästä tai hyväksyttävästä laadusta.

Käytä oikeassa yläkulmassa olevaa kielivalikkoa valitaksesi 33-kielistä. Selain muistaa valintasi. Kielipaketteja tarjoillaan paikallisesti; kielen vaihtaminen ei lähetä sisältöä online-käännöspalveluun. Käyttäjien kehotteet, keskustelut ja tallennettu sisältö säilyttävät alkuperäisen kielensä.
