[Română](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Aceste documente sunt traduceri automate ale textului proiectului public și nu au fost toate revizuite de vorbitori nativi. Consultați sursa engleză sau chineză pentru ambiguități tehnice. Nu sunt incluse date private ale utilizatorului.

# MacBook Pro Studio

Un studio local de imagine, chat și video experimental pentru Mac-uri Apple Silicon.

## Limba interfeței

Utilizați meniul de limbă din dreapta sus pentru a alege dintre limbile 33. Browserul își amintește selecția dvs. Pachetele lingvistice sunt servite local; schimbarea limbii nu trimite conținut către un serviciu de traducere online. Solicitările utilizatorului, conversațiile și conținutul salvat își păstrează limba inițială.

## Previzualizările interfeței

Aceste previzualizări folosesc stilurile de pagină lansate. Toate solicitările, ID-urile sarcinilor, marcajele de timp, ilustrațiile și conversațiile sunt conținut demonstrativ fictiv creat pentru acest README. Nu conțin conturi reale, imagini de utilizator sau înregistrări de chat. Ilustrațiile sunt desenate programatic, nu modele de referință sau afirmații de calitate.

### Studio de imagine

Alegeți un model, introduceți o solicitare și răsfoiți sarcinile și rezultatele imaginii.

![Studio de imagini cu sarcini fictive și ilustrații de peisaj desenate programatic](../../images/image-studio-demo.en.png)

### Chat local

Discutați în același studio și selectați un mod de răspuns și o lungime.

![Chat local cu o conversație fictivă, scrisă manual, de planificare a ilustrațiilor](../../images/chat-studio-demo.en.png)

## Configurați un nou Mac

1. Clonează acest depozit.
2. Citiți [ghidul de implementare](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Dați [promptul de instalare](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) unui asistent de codare pe Mac-ul țintă pentru a instala dependențe și a descărca models potrivit pentru acel hardware.

Pagini: `/edit` pentru imagini, `/chat` pentru chat, `/video` pentru video. Portul web implicit este `1235`.

Acest depozit este o versiune revizuită și o copie de migrare. Poate rămâne în urma dezvoltării sau producției locale. Exclude greutățile modelului, mediile virtuale, sarcinile utilizatorului, înregistrările de chat, imaginile de referință și configurarea contului. O instalare completă pe o mașină nouă nu a fost validată. Aceasta nu este o aplicație cu un singur clic.

## Conținutul depozitului

- `src/`: frontend, backend, manifeste model, instrumente de instalare și validare.
- `tests/`: teste; unele necesită instalarea models sau servicii care rulează.
- `requirements/`: dependențe fixate.
- `vendor/`: sursă nativă de motor, cu licențele upstream reținute.
- `patches/`: versiuni fixate și adaptări Apple.

Modelele și sursa terță parte își păstrează licențele din amonte. H3/ClipProj Suportul Apple este experimental. Un eșantion scurt de succes nu stabilește suport pentru fiecare rezoluție sau durată.

## Conectare și conturi

Pe Mac care rulează serviciul, deschideți `http://127.0.0.1:1235/setup` pentru a crea primul administrator, apoi conectați-vă de pe alte dispozitive. Administratorii pot crea, dezactiva și șterge conturi și pot reseta parolele. Consultați [documentația contului](accounts.md) ([中文](../../accounts.md)). Nu există o parolă implicită. Fișierele contului rămân în directorul de date runtime și nu trebuie încărcate. Sarcinile rămân date de studio partajate.

## Viggle v0.3

Sunt disponibile moduri de detaliu separate în șase pași și nouă pași, cu reținerea implicită anterioară. Consultați [instalare și validare](viggle-v03.md) ([中文](../../viggle-v03.md)). Descărcați separat greutățile modelului pe Mac-ul țintă.
