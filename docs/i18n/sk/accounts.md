[Slovenčina](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Tieto dokumenty sú strojovými prekladmi textu verejného projektu a nie všetky boli skontrolované rodenými hovorcami. Technické nejasnosti nájdete v anglickom alebo čínskom zdroji. Nie sú zahrnuté žiadne súkromné ​​údaje používateľa.

# Účty webových stránok

## Použitie

Na počítači Mac, na ktorom je spustená služba, otvorte `http://127.0.0.1:1235/setup` a vytvorte prvého správcu. Používateľské mená obsahujú 3–32 písmená, číslice, podčiarkovníky alebo spojovníky a sú normalizované na malé písmená. Heslá obsahujú znaky 12–128. Neexistujú žiadne predvolené poverenia. Vzdialené zariadenia si nemôžu nárokovať počiatočný účet správcu.

Po nastavení sa neovereným zariadeniam zobrazí prihlasovacia stránka. Ak chcete zmeniť heslo alebo sa odhlásiť, otvorte **Účet / Odhlásiť sa** (`/account`). Správcovia môžu vytvárať users/administrators, resetovať heslá, účty disable/enable, meniť roly a mazať účty. Odstránenie a zmeny povolení vyžadujú potvrdenie. Server zabraňuje vymazaniu, zakázaniu alebo zníženiu úrovne posledného povoleného správcu. Odstránením účtu sa neodstránia zdieľané úlohy.

Pomocou ponuky jazykov vpravo hore si môžete vybrať z jazykov 33. Prehliadač si zapamätá váš výber. Jazykové balíčky sa podávajú lokálne; prepínanie jazykov neposiela obsah do online prekladateľskej služby. Používateľské výzvy, konverzácie a uložený obsah si zachovávajú svoj pôvodný jazyk.

Toto je spoločné štúdio. Prihlásení používatelia zdieľajú prístup k obrázkom, videám a chatovým úlohám na strane servera. História chatu prehliadača zostáva v localStorage. Neexistuje žiadna izolácia viacerých nájomníkov, ukladanie úloh pre jednotlivých používateľov ani fakturácia. Existujúce obmedzenie pre video iba miestne zostáva zachované.

## Skladovanie a ochrana

- `src/studio_auth.mjs` beží pred obchodnými trasami vrátane rozhraní API a súborov image/reference/video. Neoverené stránky sa presmerujú pomocou 303; Rozhrania API a médiá vracajú 401. Majetok účtu, jazykový majetok a neutajený stav setup/sign-in sú verejné.
- Súbor účtu: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, predvolené `app/.local/auth/users.json`; vyhradené nasadenie používa `runtime/auth/users.json`. Adresárový režim: 0700; režim súboru: 0600. Heslá používajú scrypt N32768/r8/p1, náhodné soli a porovnanie hash v konštantnom čase. Zápisy sú atomické a zmeny účtu sú serializované. Poškodená existujúca databáza bráni spusteniu a nie opätovnému otvoreniu registrácie.
- Relácie používajú náhodné bajty 32; server ukladá iba súhrn. Súbory cookie sú HttpOnly, SameSite=Strict, platné počas 12 hodín. Reštartovanie vyžaduje opätovné prihlásenie. Password/role zmeny, resety, deaktivácia a vymazanie odvolajú ovplyvnené relácie. Odhlásením sa neodstránia ani znova nespustia už spustené úlohy.
- Zápisy vyžadujú rovnaký pôvod Origin a JSON. X-Forwarded-For nie je dôveryhodný. Každá zdrojová IP získa najviac 15 sign-in/setup/self-password-change pokusov za 15 minút. Limity: 4 odvodené súbežné heslá a účty 100. Reštartovanie vymaže limity pokusov.
- Existujúce nasadenie používa HTTP cez súkromné ​​Tailscale. Tailscale šifruje prenos medzi zariadeniami; obyčajný LAN HTTP sám o sebe nie. Tento balík nekonfiguruje verejný prístup a TLS. Súbory cookie Secure sú nastavené iba pre natívne požiadavky TLS. Nevystavujte ho priamo cez verejný HTTP.
- Nikdy neodovzdávajte autentifikačnú databázu, relácie alebo heslá. Pri migrácii inicializujte nové účty. stdio MCP, miestne LM Studio a povolenia súborov OS sú mimo overenia webovej stránky.

## Overenie

Spustite `node tests/studio_auth.mjs` s dočasnou databázou účtov a bez skutočného models. Zahŕňa neoverené blokovanie API/media, obmedzenia pôvodu počiatočného nastavenia, roly, režimy hesiel hashing/file, ochranu posledného správcu, zrušenie relácie, pretrvávanie, odmietnutie poškodených súborov a limity rýchlosti.

Testy local_chat, chat_background, image_studio a video_web sa prihlasujú pomocou izolovaných správcov testu; neexistuje obtok na overenie výroby. Skutočné heslá zadáva používateľ a nesmú byť uložené v testoch alebo dokumentácii.
