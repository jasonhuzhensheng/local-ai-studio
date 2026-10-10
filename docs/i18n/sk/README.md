[Slovenčina](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Tieto dokumenty sú strojovými prekladmi textu verejného projektu a nie všetky boli skontrolované rodenými hovorcami. Technické nejasnosti nájdete v anglickom alebo čínskom zdroji. Nie sú zahrnuté žiadne súkromné ​​údaje používateľa.

# MacBook Pro Studio

Lokálne obrazové, chatové a experimentálne video štúdio pre počítače Mac Apple Silicon.

## Jazyk rozhrania

Pomocou ponuky jazykov vpravo hore si môžete vybrať z jazykov 33. Prehliadač si zapamätá váš výber. Jazykové balíčky sa podávajú lokálne; prepínanie jazykov neposiela obsah do online prekladateľskej služby. Používateľské výzvy, konverzácie a uložený obsah si zachovávajú svoj pôvodný jazyk.

## Ukážky rozhrania

Tieto ukážky používajú uvoľnené štýly stránky. Všetky výzvy, ID úloh, časové pečiatky, ilustrácie a konverzácie sú fiktívnym demo obsahom vytvoreným pre tento README. Neobsahujú žiadne skutočné účty, obrázky používateľov ani záznamy chatu. Ilustrácie sú kreslené programovo, nie modelové benchmarky alebo nároky na kvalitu.

### Obrazové štúdio

Vyberte model, zadajte výzvu a prehliadajte úlohy a výsledky obrázkov.

![Obrázkové štúdio s fiktívnymi úlohami a programovo nakreslenými ilustráciami krajiny](../../images/image-studio-demo.en.png)

### Miestny chat

Chatujte v rovnakom štúdiu a vyberte si režim a dĺžku odozvy.

![Miestny rozhovor s fiktívnym, ručne napísaným rozhovorom o plánovaní ilustrácií](../../images/chat-studio-demo.en.png)

## Nastavte si nový Mac

1. Naklonujte toto úložisko.
2. Prečítajte si [príručku nasadenia](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Poskytnite [inštalačný príkaz](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) asistentovi kódovania na cieľovom Macu, aby nainštaloval závislosti a stiahol models vhodný pre daný hardvér.

Stránky: `/edit` pre obrázky, `/chat` pre chat, `/video` pre video. Predvolený webový port je `1235`.

Tento archív je skontrolovanou kópiou vydania a migrácie. Môže zaostávať za miestnym rozvojom alebo výrobou. Nezahŕňa váhy modelov, virtuálne prostredia, používateľské úlohy, záznamy rozhovorov, referenčné obrázky a konfiguráciu účtu. Úplná inštalácia na novom počítači nebola overená. Toto nie je aplikácia na jedno kliknutie.

## Obsah úložiska

- `src/`: frontend, backend, manifesty modelov, inštalačné a overovacie nástroje.
- `tests/`: testy; niektoré vyžadujú nainštalované models alebo spustené služby.
- `requirements/`: pripnuté závislosti.
- `vendor/`: natívny zdroj motora so zachovanými upstream licenciami.
- `patches/`: pripnuté verzie a úpravy Apple.

Modely a zdroje tretích strán si ponechávajú svoje upstream licencie. H3/ClipProj Podpora Apple je experimentálna. Úspešná krátka vzorka nezabezpečuje podporu pre každé rozlíšenie alebo trvanie.

## Prihlásenie a účty

Na Macu, na ktorom je spustená služba, otvorte `http://127.0.0.1:1235/setup`, vytvorte prvého správcu a potom sa prihláste z iných zariadení. Správcovia môžu vytvárať, deaktivovať a odstraňovať účty a resetovať heslá. Pozrite si [dokumentáciu účtu](accounts.md) ([中文](../../accounts.md)). Neexistuje žiadne predvolené heslo. Súbory účtov zostávajú v adresári údajov runtime a nesmú sa nahrávať. Úlohy zostávajú zdieľané údaje štúdia.

## Viggle v0.3

K dispozícii sú samostatné šesťkrokové a deväťkrokové režimy detailov, pričom predchádzajúce predvolené nastavenie zostane zachované. Pozrite si [inštalácia a overenie](viggle-v03.md) ([中文](../../viggle-v03.md)). Stiahnite si modelové závažia samostatne na cieľovom Macu.
