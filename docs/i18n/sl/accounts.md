[Slovenščina](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ti dokumenti so strojni prevodi javnega projektnega besedila in niso vseh pregledali naravni govorci. Za tehnične nejasnosti se obrnite na angleški ali kitajski vir. Zasebni uporabniški podatki niso vključeni.

# Računi spletnih mest

## Uporaba

V računalniku Mac, ki izvaja storitev, odprite `http://127.0.0.1:1235/setup`, da ustvarite prvega skrbnika. Uporabniška imena vsebujejo 3–32 črke, števke, podčrtaje ali vezaje in so normalizirana na male črke. Gesla vsebujejo znake 12–128. Ni privzetih poverilnic. Oddaljene naprave ne morejo zahtevati začetnega skrbniškega računa.

Po nastavitvi nepreverjene naprave vidijo stran za prijavo. Odprite **Račun / Odjava** (`/account`), da spremenite geslo ali se odjavite. Skrbniki lahko ustvarijo users/administrators, ponastavijo gesla, račune disable/enable, spremenijo vloge in izbrišejo račune. Brisanje in spremembe dovoljenj zahtevajo potrditev. Strežnik preprečuje brisanje, onemogočanje ali degradacijo zadnjega omogočenega skrbnika. Z brisanjem računa ne izbrišete skupnih nalog.

Za izbiro jezikov 33 uporabite jezikovni meni zgoraj desno. Brskalnik si zapomni vašo izbiro. Jezikovni paketi so na voljo lokalno; preklapljanje med jeziki ne pošlje vsebine spletni prevajalski storitvi. Uporabniški pozivi, pogovori in shranjena vsebina ohranjajo izvirni jezik.

To je skupni studio. Prijavljeni uporabniki si delijo dostop do slik, videoposnetkov in opravil klepeta na strani strežnika. Zgodovina klepeta v brskalniku ostane v localStorage. Ni izolacije več najemnikov, shranjevanja opravil na uporabnika ali zaračunavanja. Obstoječa omejitev samo lokalnega videa ostaja.

## Shranjevanje in zaščita

- `src/studio_auth.mjs` teče pred poslovnimi potmi, vključno z API-ji in datotekami image/reference/video. Nepreverjene strani preusmerijo z 303; API-ji in mediji vrnejo 401. Sredstva računa, jezikovna sredstva in nezaupni status setup/sign-in so javni.
- Datoteka računa: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, privzeto `app/.local/auth/users.json`; namenska uvedba uporablja `runtime/auth/users.json`. Način imenika: 0700; način datoteke: 0600. Gesla uporabljajo scrypt N32768/r8/p1, naključne soli in primerjavo zgoščenih vrednosti v konstantnem času. Zapisi so atomski, spremembe računa pa serializirane. Poškodovana obstoječa zbirka podatkov preprečuje zagon in ne ponovno odpiranje registracije.
- Seje uporabljajo naključne bajte 32; strežnik shrani samo povzetek. Piškotki so HttpOnly, SameSite=Strict, veljavni 12 ur. Ponovni zagon zahteva ponovno prijavo. Password/role spremembe, ponastavitve, onemogočanje in brisanje prekličejo prizadete seje. Odjava ne izbriše ali znova zažene že začetih opravil.
- Za pisanje sta potrebna Origin in JSON istega izvora. X-Forwarded-For ni zaupanja vreden. Vsak izvorni IP prejme največ 15 sign-in/setup/self-password-change poskusov na 15 minut. Omejitve: sočasne izpeljave gesel 4 in računi 100. Ponovni zagon počisti omejitve poskusov.
- Obstoječa uvedba uporablja HTTP prek zasebnega Tailscale. Tailscale šifrira prenos od naprave do naprave; navaden LAN HTTP sam po sebi ne. Ta paket ne konfigurira javnega dostopa in TLS. Piškotki Secure so nastavljeni samo za izvorne zahteve TLS. Ne izpostavljajte ga neposredno prek javnega HTTP-ja.
- Nikoli ne nalagajte baze podatkov za preverjanje pristnosti, sej ali gesel. Pri selitvi inicializirajte nove račune. stdio MCP, lokalna dovoljenja LM Studio in datoteke OS so zunaj preverjanja pristnosti spletnega mesta.

## Preverjanje

Zaženite `node tests/studio_auth.mjs` z začasno bazo podatkov o računih in brez pravega models. Zajema neoverjeno blokiranje API/media, omejitve izvora začetne nastavitve, vloge, načine hashing/file z geslom, zaščito zadnjega skrbnika, preklic seje, obstojnost, zavrnitev poškodovanih datotek in omejitve hitrosti.

Preizkusi local_chat, chat_background, image_studio in video_web se prijavijo z izoliranimi skrbniki testov; ni obvoda za avtentifikacijo proizvodnje. Prava gesla vnese uporabnik in se jih ne sme shranjevati v testih ali dokumentaciji.
