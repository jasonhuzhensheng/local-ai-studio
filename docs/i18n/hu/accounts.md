[Magyar](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ezek a dokumentumok nyilvános projektszöveg gépi fordításai, és nem mindegyiket nézték át anyanyelvi beszélők. Forduljon angol vagy kínai forráshoz a technikai kétértelműségért. Nincsenek benne privát felhasználói adatok.

# Webhelyfiókok

## Használat

A szolgáltatást futtató Mac számítógépen nyissa meg a `http://127.0.0.1:1235/setup` fájlt az első rendszergazda létrehozásához. A felhasználónevek 3–32 betűket, számokat, aláhúzásjeleket vagy kötőjeleket tartalmaznak, és kisbetűre normalizálva vannak. A jelszavak 12–128 karaktereket tartalmaznak. Nincsenek alapértelmezett hitelesítő adatok. A távoli eszközök nem igényelhetik a kezdeti rendszergazdai fiókot.

A beállítás után a nem hitelesített eszközök látják a bejelentkezési oldalt. Nyissa meg a **Fiók / Kijelentkezés** (`/account`) lehetőséget a jelszó megváltoztatásához vagy a kijelentkezéshez. A rendszergazdák létrehozhatják a users/administrators-t, visszaállíthatják a jelszavakat, disable/enable-fiókokat, megváltoztathatják a szerepköröket és törölhetik a fiókokat. A törlés és az engedélyek módosítása megerősítést igényel. A szerver megakadályozza az utoljára engedélyezett rendszergazda törlését, letiltását vagy lefokozását. A fiók törlése nem törli a megosztott feladatokat.

A jobb felső sarokban található nyelvi menü segítségével válasszon a 33 nyelvek közül. A böngésző megjegyzi a választást. A nyelvi csomagokat helyben szolgálják fel; a nyelvváltás nem küld tartalmat online fordítószolgálatnak. A felhasználói felszólítások, beszélgetések és mentett tartalom megtartja eredeti nyelvét.

Ez egy közös stúdió. A bejelentkezett felhasználók megosztják a hozzáférést a képekhez, videókhoz és szerveroldali csevegési feladatokhoz. A böngésző csevegési előzményei a localStorage-ben maradnak. Nincs több bérlős elkülönítés, felhasználónkénti feladattárolás vagy számlázás. A meglévő, csak helyi videókra vonatkozó korlátozás megmarad.

## Tárolás és védelem

- A `src/studio_auth.mjs` az üzleti útvonalak előtt fut, beleértve az API-kat és a image/reference/video fájlokat. A nem hitelesített oldalak átirányítása a 303-vel; Az API-k és a média a 401-t adják vissza. A fiókeszközök, a nyelvi eszközök és a nem titkos setup/sign-in állapot nyilvános.
- Számlafájl: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, alapértelmezett `app/.local/auth/users.json`; a dedikált telepítés a `runtime/auth/users.json`-t használja. Címtár mód: 0700; fájl mód: 0600. A jelszavak scrypt N32768/r8/p1, véletlenszerű sókat és állandó idejű hash összehasonlítást használnak. Az írások atomizáltak, a fiókmódosítások pedig sorba rendeződnek. A sérült meglévő adatbázis megakadályozza az indítást, nem pedig a regisztráció újranyitását.
- A munkamenetek 32 véletlenszerű bájtokat használnak; a szerver csak a kivonatot tárolja. A cookie-k HttpOnly, SameSite=Strict, 12 óráig érvényesek. Az újraindításhoz újbóli bejelentkezés szükséges. A Password/role módosításai, alaphelyzetbe állítása, letiltása és törlése visszavonja az érintett munkameneteket. A kijelentkezés nem törli vagy nem futja újra a már elindított feladatokat.
- Az íráshoz azonos eredetű Origin és JSON szükséges. A X-Forwarded-For nem megbízható. Minden forrás IP-cím legfeljebb 15 sign-in/setup/self-password-change próbálkozást kap 15 percenként. Korlátok: 4 párhuzamos jelszavak levezetése és 100 fiókok. Az újraindítás törli a kísérleti korlátokat.
- A meglévő telepítés HTTP-t használ privát Tailscale-n keresztül. A Tailscale titkosítja az eszközök közötti átvitelt; A hagyományos LAN HTTP önmagában nem. A nyilvános hozzáférést és a TLS-t ez a csomag nem konfigurálja. A Secure cookie-k csak a natív TLS-kérésekhez vannak beállítva. Ne tegye ki közvetlenül nyilvános HTTP-n keresztül.
- Soha ne töltse fel a hitelesítési adatbázist, a munkameneteket vagy a jelszavakat. Inicializálja az új fiókokat a migráció során. A stdio MCP, a helyi LM Studio és az operációs rendszer fájlengedélyei kívül esnek a webhely hitelesítésén.

## Érvényesítés

Futtassa a `node tests/studio_auth.mjs`-t ideiglenes fiókadatbázisával, valódi models nélkül. Lefedi a nem hitelesített API/media blokkolást, a kezdeti beállítás eredetkorlátozásait, a szerepköröket, a jelszó hashing/file módokat, az utolsó adminisztrátor védelmét, a munkamenet visszavonását, a fennmaradást, a sérült fájlok elutasítását és a sebességkorlátokat.

A local_chat, chat_background, image_studio és video_web tesztek elszigetelt tesztadminisztrátorokkal jelentkeznek be; nincs gyártás-hitelesítés bypass. A valódi jelszavakat a felhasználó adja meg, és nem menthető el tesztekben vagy dokumentációban.
