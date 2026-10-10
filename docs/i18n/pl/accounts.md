[Polski](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumenty te są tłumaczeniami maszynowymi tekstów projektów publicznych i nie wszystkie zostały sprawdzone przez rodzimych użytkowników języka. W przypadku niejasności technicznych należy zapoznać się ze źródłem angielskim lub chińskim. Żadne prywatne dane użytkownika nie są uwzględniane.

# Konta internetowe

## Użycie

Na komputerze Mac z uruchomioną usługą otwórz `http://127.0.0.1:1235/setup`, aby utworzyć pierwszego administratora. Nazwy użytkowników zawierają litery, cyfry, podkreślenia lub łączniki 3–32 i są normalizowane na małe litery. Hasła zawierają znaki 12–128. Nie ma domyślnych poświadczeń. Urządzenia zdalne nie mogą przejąć początkowego konta administratora.

Po konfiguracji nieuwierzytelnione urządzenia zobaczą stronę logowania. Otwórz **Konto / Wyloguj** (`/account`), aby zmienić hasło lub się wylogować. Administratorzy mogą tworzyć users/administrators, resetować hasła, konta disable/enable, zmieniać role i usuwać konta. Usunięcie i zmiany uprawnień wymagają potwierdzenia. Serwer uniemożliwia usunięcie, wyłączenie lub zdegradowanie ostatnio włączonego administratora. Usunięcie konta nie powoduje usunięcia udostępnionych zadań.

Użyj menu języka w prawym górnym rogu, aby wybrać język 33. Przeglądarka pamięta Twój wybór. Pakiety językowe są dostarczane lokalnie; zmiana języka nie powoduje przesłania treści do usługi tłumaczeń online. Podpowiedzi użytkownika, rozmowy i zapisana treść zachowują swój oryginalny język.

To jest wspólne studio. Zalogowani użytkownicy mają dostęp do zdjęć, filmów i zadań czatu po stronie serwera. Historia czatów przeglądarki pozostaje w localStorage. Nie ma izolacji wielu dzierżawców, przechowywania zadań dla poszczególnych użytkowników ani rozliczeń. Istniejące ograniczenie dotyczące wideo tylko lokalnego pozostaje nadal aktualne.

## Przechowywanie i ochrona

- `src/studio_auth.mjs` działa przed trasami biznesowymi, łącznie z interfejsami API i plikami image/reference/video. Nieuwierzytelnione strony przekierowują za pomocą 303; Interfejsy API i zwrot multimediów 401. Aktywa konta, zasoby językowe i nietajny status setup/sign-in są publiczne.
- Plik konta: `LOCAL_IMAGE_DATA_DIR/auth/users.json`, domyślnie `app/.local/auth/users.json`; dedykowane wdrożenie wykorzystuje `runtime/auth/users.json`. Tryb katalogu: 0700; tryb pliku: 0600. Hasła wykorzystują scrypt N32768/r8/p1, losowe sole i porównanie skrótów w czasie stałym. Zapisy są niepodzielne, a zmiany konta serializowane. Uszkodzona istniejąca baza danych uniemożliwia uruchomienie zamiast ponownego otwarcia rejestracji.
- Sesje wykorzystują losowe bajty 32; serwer przechowuje tylko podsumowanie. Pliki cookies to HttpOnly, SameSite=Strict, ważne przez godziny 12. Ponowne uruchomienie wymaga ponownego zalogowania się. Zmiany, resetowanie, wyłączanie i usuwanie Password/role unieważniają sesje, których to dotyczy. Wylogowanie nie powoduje usunięcia ani ponownego uruchomienia już rozpoczętych zadań.
- Zapisy wymagają tego samego pochodzenia Origin i JSON. X-Forwarded-For nie jest zaufany. Każdy źródłowy adres IP ma najwięcej prób 15 sign-in/setup/self-password-change na minutę 15. Ograniczenia: jednoczesne wyprowadzanie haseł 4 i konta 100. Ponowne uruchomienie usuwa limity prób.
— Istniejące wdrożenie korzysta z protokołu HTTP w trybie prywatnym Tailscale. Tailscale szyfruje transport między urządzeniami; zwykły LAN HTTP sam tego nie robi. Dostęp publiczny i TLS nie są konfigurowane w tym pakiecie. Pliki cookie Secure są ustawiane tylko dla natywnych żądań TLS. Nie ujawniaj go bezpośrednio przez publiczny protokół HTTP.
- Nigdy nie przesyłaj bazy danych uwierzytelniających, sesji ani haseł. Zainicjuj nowe konta podczas migracji. Uprawnienia stdio MCP, lokalne LM Studio i pliki systemu operacyjnego stanowią zewnętrzne uwierzytelnianie witryny internetowej.

## Walidacja

Uruchom `node tests/studio_auth.mjs` z tymczasową bazą danych kont i bez prawdziwego models. Obejmuje nieuwierzytelnione blokowanie API/media, ograniczenia pochodzenia początkowej konfiguracji, role, tryby haseł hashing/file, ochronę ostatniego administratora, odwoływanie sesji, trwałość, odrzucanie uszkodzonych plików i limity szybkości.

Testy local_chat, chat_background, image_studio i video_web logują się za pomocą izolowanych administratorów testów; nie ma obejścia uwierzytelniania produkcyjnego. Prawdziwe hasła wprowadzane są przez użytkownika i nie wolno ich zapisywać w testach ani w dokumentacji.
