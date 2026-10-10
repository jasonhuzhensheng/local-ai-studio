[Magyar](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ezek a dokumentumok nyilvános projektszöveg gépi fordításai, és nem mindegyiket nézték át anyanyelvi beszélők. Forduljon angol vagy kínai forráshoz a technikai kétértelműségért. Nincsenek benne privát felhasználói adatok.

# MacBook Pro Studio

Helyi kép-, chat- és kísérleti videóstúdió Apple Silicon Mac-ekhez.

## A felület nyelve

A jobb felső sarokban található nyelvi menü segítségével válasszon a 33 nyelvek közül. A böngésző megjegyzi a választást. A nyelvi csomagokat helyben szolgálják fel; a nyelvváltás nem küld tartalmat online fordítószolgálatnak. A felhasználói felszólítások, beszélgetések és mentett tartalom megtartja eredeti nyelvét.

## Interfész előnézetek

Ezek az előnézetek a kiadott oldalstílusokat használják. Minden prompt, feladatazonosító, időbélyeg, illusztráció és beszélgetés kitalált demótartalom, amelyet ehhez a README-hoz hoztak létre. Nem tartalmaznak valódi fiókokat, felhasználói képeket vagy csevegési rekordokat. Az illusztrációk programozottan készültek, nem modell-benchmarkok vagy minőségi állítások.

### Képstúdió

Válasszon egy modellt, írjon be egy promptot, és böngésszen a feladatok és a képeredmények között.

![Képstúdió kitalált feladatokkal és programozottan rajzolt tájképekkel](../../images/image-studio-demo.en.png)

### Helyi csevegés

Csevegés ugyanabban a stúdióban, és válassza ki a válasz módot és hosszát.

![Helyi csevegés egy kitalált, kézzel írott illusztrációs-tervezési beszélgetéssel](../../images/chat-studio-demo.en.png)

## Állítson be egy új Mac gépet

1. A tár klónozása.
2. Olvassa el a [telepítési útmutatót](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Adja át a [telepítési prompt](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) -t a kódolási asszisztensnek a cél Mac-en a függőségek telepítéséhez, és töltse le az adott hardvernek megfelelő models fájlt.

Oldalak: `/edit` képekhez, `/chat` csevegéshez, `/video` videóhoz. Az alapértelmezett webport a `1235`.

Ez a tárház egy felülvizsgált kiadási és áttelepítési másolat. Ez elmaradhat a helyi fejlesztéstől vagy termeléstől. Nem tartalmazza a modellsúlyokat, a virtuális környezeteket, a felhasználói feladatokat, a csevegési rekordokat, a referenciaképeket és a fiókkonfigurációt. A teljes telepítés friss gépen nincs érvényesítve. Ez nem egy kattintással használható alkalmazás.

## Az adattár tartalma

- `src/`: előtér, háttérrendszer, modelljegyzékek, telepítő és érvényesítő eszközök.
- `tests/`: tesztek; egyesekhez telepített models vagy futó szolgáltatások szükségesek.
- `requirements/`: rögzített függőségek.
- `vendor/`: natív motorforrás, az upstream licencekkel.
- `patches/`: rögzített változatok és Apple adaptációk.

A modellek és a harmadik féltől származó források megtartják upstream licenceiket. H3/ClipProj Az Apple támogatása kísérleti jellegű. A sikeres rövid minta nem támaszt alá minden felbontást vagy időtartamot.

## Bejelentkezés és fiókok

A szolgáltatást futtató Mac számítógépen nyissa meg a `http://127.0.0.1:1235/setup` fájlt az első rendszergazda létrehozásához, majd jelentkezzen be más eszközökről. A rendszergazdák fiókokat hozhatnak létre, letilthatnak és törölhetnek, valamint visszaállíthatják a jelszavakat. Lásd: [számladokumentáció](accounts.md) ([中文](../../accounts.md)). Nincs alapértelmezett jelszó. A fiókfájlok a runtime adatkönyvtárban maradnak, és nem tölthetők fel. A feladatok megosztott stúdióadatok maradnak.

## Viggle v0.3

Külön hat- és kilenclépcsős részletezési módok állnak rendelkezésre, a korábbi alapértelmezés megtartásával. Lásd: [telepítés és érvényesítés](viggle-v03.md) ([中文](../../viggle-v03.md)). A modellsúlyokat külön töltse le a cél Macre.
