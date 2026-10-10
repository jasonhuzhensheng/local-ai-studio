[Čeština](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Tyto dokumenty jsou strojovým překladem textu veřejného projektu a ne všechny byly zkontrolovány rodilými mluvčími. Technické nejasnosti naleznete v anglickém nebo čínském zdroji. Nejsou zahrnuta žádná soukromá uživatelská data.

# Účty webových stránek

## Použití

Na Macu se službou otevřete `http://127.0.0.1:1235/setup` a vytvořte prvního správce. Uživatelská jména obsahují 3–32 písmena, číslice, podtržítka nebo spojovníky a jsou normalizována na malá písmena. Hesla obsahují znaky 12–128. Neexistují žádné výchozí přihlašovací údaje. Vzdálená zařízení si nemohou nárokovat počáteční účet správce.

Po nastavení se neověřeným zařízením zobrazí přihlašovací stránka. Chcete-li změnit heslo nebo se odhlásit, otevřete **Účet / Odhlásit se** (`/account`). Správci mohou vytvářet users/administrators, resetovat hesla, účty disable/enable, měnit role a mazat účty. Smazání a změny oprávnění vyžadují potvrzení. Server zabraňuje smazání, zakázání nebo snížení úrovně posledního povoleného správce. Smazáním účtu se neodstraní sdílené úkoly.

Pomocí nabídky jazyků vpravo nahoře si můžete vybrat z jazyků 33. Prohlížeč si pamatuje váš výběr. Jazykové balíčky jsou poskytovány lokálně; přepínání jazyků neodesílá obsah do online překladatelské služby. Uživatelské výzvy, konverzace a uložený obsah si zachovávají svůj původní jazyk.

Toto je sdílené studio. Přihlášení uživatelé sdílejí přístup k obrázkům, videím a úlohám chatu na straně serveru. Historie chatu v prohlížeči zůstává v localStorage. Neexistuje žádná izolace více tenantů, ukládání úloh pro jednotlivé uživatele ani fakturace. Stávající omezení pouze pro místní video zůstává.

## Skladování a ochrana

- `src/studio_auth.mjs` běží před obchodními trasami, včetně rozhraní API a souborů image/reference/video. Neověřené stránky přesměrovávají pomocí 303; Rozhraní API a média vracejí 401. Aktiva účtu, jazyková aktiva a netajný stav setup/sign-in jsou veřejné.
- Soubor účtu: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, výchozí `app/.local/auth/users.json`; vyhrazené nasazení používá `runtime/auth/users.json`. Adresářový režim: 0700; režim souboru: 0600. Hesla používají scrypt N32768/r8/p1, náhodné soli a porovnání hashů v konstantním čase. Zápisy jsou atomické a změny účtu serializované. Poškozená existující databáze brání spuštění, nikoli opětovnému otevření registrace.
- Relace používají náhodné bajty 32; server ukládá pouze výtah. Soubory cookie jsou HttpOnly, SameSite=Strict, platné po dobu 12 hodin. Restartování vyžaduje opětovné přihlášení. Změny, resetování, deaktivace a odstranění Password/role zruší dotčené relace. Odhlášením se neodstraní ani znovu nespustí již spuštěné úlohy.
- Zápisy vyžadují Origin a JSON stejného původu. X-Forwarded-For není důvěryhodný. Každá zdrojová IP získá maximálně 15 sign-in/setup/self-password-change pokusů za 15 minut. Omezení: 4 souběžné odvození hesla a účty 100. Restartování vymaže limity pokusů.
- Stávající nasazení používá HTTP přes privátní Tailscale. Tailscale šifruje přenos mezi zařízeními; obyčejný LAN HTTP sám o sobě ne. Tento balíček nekonfiguruje veřejný přístup a TLS. Soubory cookie Secure jsou nastaveny pouze pro nativní požadavky TLS. Nevystavujte jej přímo přes veřejný HTTP.
- Nikdy nenahrávejte ověřovací databázi, relace nebo hesla. Při migraci inicializujte nové účty. stdio MCP, místní oprávnění LM Studio a OS jsou mimo ověřování webových stránek.

## Ověření

Spusťte `node tests/studio_auth.mjs` s jeho dočasnou databází účtů a bez skutečného models. Zahrnuje neověřené blokování API/media, omezení původu počátečního nastavení, role, režimy hesel hashing/file, ochranu posledního správce, odvolání relace, persistenci, odmítání poškozených souborů a limity rychlosti.

Testy local_chat, chat_background, image_studio a video_web se přihlašují s izolovanými správci testu; neexistuje žádný produkčně-autentizační bypass. Skutečná hesla zadává uživatel a nesmí být uložena v testech nebo dokumentaci.
