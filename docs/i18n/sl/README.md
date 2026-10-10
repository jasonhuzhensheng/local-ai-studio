[Slovenščina](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ti dokumenti so strojni prevodi javnega projektnega besedila in niso vseh pregledali naravni govorci. Za tehnične nejasnosti se obrnite na angleški ali kitajski vir. Zasebni uporabniški podatki niso vključeni.

# MacBook Pro Studio

Lokalni slikovni, klepetalni in eksperimentalni video studio za Apple Silicon Mace.

## Jezik vmesnika

Za izbiro jezikov 33 uporabite jezikovni meni zgoraj desno. Brskalnik si zapomni vašo izbiro. Jezikovni paketi so na voljo lokalno; preklapljanje med jeziki ne pošlje vsebine spletni prevajalski storitvi. Uporabniški pozivi, pogovori in shranjena vsebina ohranjajo izvirni jezik.

## Predogled vmesnika

Ti predogledi uporabljajo izdane sloge strani. Vsi pozivi, ID-ji nalog, časovni žigi, ilustracije in pogovori so izmišljena predstavitvena vsebina, ustvarjena za ta README. Ne vsebujejo pravih računov, uporabniških slik ali zapisov klepetov. Ilustracije so programsko narisane, ne pa merila uspešnosti modela ali trditve o kakovosti.

### Slikovni studio

Izberite model, vnesite poziv in brskajte po opravilih in rezultatih slik.

![Slikovni studio z izmišljenimi nalogami in programsko narisanimi ležečimi ilustracijami](../../images/image-studio-demo.en.png)

### Lokalni klepet

Klepetajte v istem studiu in izberite način odziva in dolžino.

![Lokalni klepet z izmišljenim, ročno napisanim pogovorom o načrtovanju ilustracij ](../../images/chat-studio-demo.en.png)

## Nastavite nov Mac

1. Kloniraj to skladišče.
2. Preberite [vodnik za uvajanje](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Dajte [namestitveni poziv](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) pomočniku za kodiranje na ciljnem Macu, da namesti odvisnosti in prenese models, ki ustreza tej strojni opremi.

Strani: `/edit` za slike, `/chat` za klepet, `/video` za video. Privzeta spletna vrata so `1235`.

To skladišče je pregledana izdaja in kopija za selitev. Lahko zaostaja za lokalnim razvojem ali proizvodnjo. Izključuje uteži modelov, virtualna okolja, uporabniška opravila, zapise klepeta, referenčne slike in konfiguracijo računa. Popolna namestitev na nov računalnik ni bila potrjena. To ni aplikacija z enim klikom.

## Vsebina skladišča

- `src/`: frontend, backend, manifesti modela, orodja za namestitev in preverjanje veljavnosti.
- `tests/`: testi; nekateri zahtevajo nameščen models ali delujoče storitve.
- `requirements/`: pripete odvisnosti.
- `vendor/`: izvorni izvor motorja, z ohranjenimi licencami navzgor.
- `patches/`: pripete različice in prilagoditve Apple.

Modeli in vir tretjih oseb obdržijo svoje licence navzgor. H3/ClipProj Appleova podpora je poskusna. Uspešen kratek vzorec ne vzpostavi podpore za vsako ločljivost ali trajanje.

## Prijava in računi

V računalniku Mac, ki izvaja storitev, odprite `http://127.0.0.1:1235/setup`, da ustvarite prvega skrbnika, nato pa se prijavite iz drugih naprav. Administratorji lahko ustvarijo, onemogočijo in izbrišejo račune ter ponastavijo gesla. Glejte [dokumentacijo računa ](accounts.md) ([中文](../../accounts.md)). Privzetega gesla ni. Datoteke računa ostanejo v podatkovnem imeniku runtime in jih ni dovoljeno nalagati. Naloge ostanejo v skupni rabi studijskih podatkov.

## Viggle v0.3

Na voljo sta ločena načina s podrobnostmi v šestih in devetih korakih, pri čemer se ohrani prejšnja privzeta vrednost. Glejte [namestitev in preverjanje ](viggle-v03.md) ([中文](../../viggle-v03.md)). Ločeno prenesite uteži modelov na ciljni Mac.
