Română | ../README.md
Aceste documente sunt traduceri automate ale textului proiectului public și nu au fost toate revizuite de vorbitori nativi. Consultați sursa engleză sau chineză pentru ambiguități tehnice. Nu sunt incluse date private ale utilizatorului.

Local AI Studio: pachet sursă de migrare pentru un Mac Apple Silicon proaspăt

Această versiune revizuită include sursa frontend/backend, teste, manifeste de descărcare a modelului, dependențe fixate, sursa motorului nativ și corecții video Apple experimentale. Poate rămâne în urma dezvoltării sau producției locale.
Exclude greutățile, mediile virtuale, sarcinile anterioare, imaginile de referință, înregistrările de chat, configurarea contului și secretele. Nu este un app cu un singur clic.

Dați acest folder întreg unui asistent de codare pe Mac-ul țintă, împreună cu INSTALL-PROMPT.en.txt.
Mașina de validare originală a fost un M2 Max cu memorie 96GB. Verificați mai întâi modelul țintă, memoria și sistemul de operare. Nu reutilizați setările video orbește pe Mac-uri cu memorie mai mică.

Continut:
 src/ Frontend, backend, instrumente download/validation, manifeste model
 Teste tests/; unele necesită instalat models/services. Nu rulați totul fără discernământ
 requirements/viggle-pinned.txt Mediu de imagine fixat
 src/h3_requirements.lock Mediu video fixat separat
 vendor/ Sursă nativă fără binare compilate; păstrează licențele în amonte
 patches/ ComfyUI/ClipProj comite și implementează modificări Python
 SHA256SUMS.txt Sume de verificare per fișier

Puncte de intrare model: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (bază model/adapters), wai_model.json, upscale_model.json și h3_apple_models.json (video), sub src/. Verificați înainte de descărcarea fiecărui manifest și a programului de instalare.
Model text: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, fișier Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Acest pachet nu include un revision/hash fixat complet pentru modelul respectiv. Obțineți și înregistrați mai întâi metadate de încredere în amonte; nu revendicați echivalența octet cu octet cu mașina originală.

O instalare proaspătă a mașinii nu a fost validată. Examinați căile originale ale mașinii, aliasurile modelului și căile instrumentelor de sistem pentru utilizatorul țintă. Nu reaplicați corecțiile istorice la sursa furnizorului deja modificată. O descărcare reușită nu este o dovadă a unei inferențe reușite sau a unei calități acceptabile.

Utilizați meniul de limbă din dreapta sus pentru a alege dintre limbile 33. Browserul își amintește selecția dvs. Pachetele lingvistice sunt servite local; schimbarea limbii nu trimite conținut către un serviciu de traducere online. Solicitările utilizatorului, conversațiile și conținutul salvat își păstrează limba inițială.
