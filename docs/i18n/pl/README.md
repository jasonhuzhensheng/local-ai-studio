[Polski](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumenty te są tłumaczeniami maszynowymi tekstów projektów publicznych i nie wszystkie zostały sprawdzone przez rodzimych użytkowników języka. W przypadku niejasności technicznych należy zapoznać się ze źródłem angielskim lub chińskim. Żadne prywatne dane użytkownika nie są uwzględniane.

# MacBook Pro Studio

Lokalne studio obrazów, czatów i eksperymentalnych wideo dla komputerów Mac Apple Silicon.

## Język interfejsu

Użyj menu języka w prawym górnym rogu, aby wybrać język 33. Przeglądarka pamięta Twój wybór. Pakiety językowe są dostarczane lokalnie; zmiana języka nie powoduje przesłania treści do usługi tłumaczeń online. Podpowiedzi użytkownika, rozmowy i zapisana treść zachowują swój oryginalny język.

## Podgląd interfejsu

W tych podglądach używane są udostępnione style strony. Wszystkie podpowiedzi, identyfikatory zadań, znaczniki czasu, ilustracje i rozmowy to fikcyjna zawartość demonstracyjna stworzona na potrzeby tego pliku README. Nie zawierają prawdziwych kont, zdjęć użytkowników ani zapisów czatów. Ilustracje są rysowane programowo, a nie wzorcami modeli ani deklaracjami jakości.

### Studio graficzne

Wybierz model, wprowadź monit i przeglądaj zadania oraz wyniki obrazkowe.

![Studio graficzne z fikcyjnymi zadaniami i programowo rysowanymi ilustracjami krajobrazów](../../images/image-studio-demo.en.png)

### Czat lokalny

Czatuj w tym samym studiu i wybierz tryb i długość odpowiedzi.

![Lokalny czat z fikcyjną, ręcznie napisaną rozmową dotyczącą planowania ilustracji](../../images/chat-studio-demo.en.png)

## Skonfiguruj nowego Maca

1. Sklonuj to repozytorium.
2. Przeczytaj [przewodnik wdrażania](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Przekaż [podpowiedź instalacyjną](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt))] asystentowi kodowania na docelowym komputerze Mac, aby zainstalował zależności i pobrał models odpowiedni dla tego sprzętu.

Strony: `/edit` dla obrazów, `/chat` dla czatu, `/video` dla wideo. Domyślny port internetowy to `1235`.

To repozytorium jest sprawdzoną kopią wydania i migracji. Może pozostawać w tyle za lokalnym rozwojem lub produkcją. Nie obejmuje wag modeli, środowisk wirtualnych, zadań użytkowników, zapisów czatów, obrazów referencyjnych i konfiguracji konta. Kompletna instalacja na nowej maszynie nie została sprawdzona. To nie jest aplikacja działająca jednym kliknięciem.

## Zawartość repozytorium

- `src/`: frontend, backend, manifesty modeli, narzędzia instalacyjne i sprawdzające.
- `tests/`: testy; niektóre wymagają zainstalowanego models lub uruchomionych usług.
- `requirements/`: przypięte zależności.
- `vendor/`: natywne źródło silnika, z zachowaniem licencji na starsze źródła.
- `patches/`: wersje przypięte i adaptacje Apple.

Modele i źródła zewnętrzne zachowują swoje licencje nadrzędne. H3/ClipProj Wsparcie Apple ma charakter eksperymentalny. Pomyślna krótka próbka nie zapewnia wsparcia dla każdego rozwiązania i czasu trwania.

## Logowanie i konta

Na komputerze Mac z uruchomioną usługą otwórz `http://127.0.0.1:1235/setup`, aby utworzyć pierwszego administratora, a następnie zaloguj się z innych urządzeń. Administratorzy mogą tworzyć, wyłączać i usuwać konta oraz resetować hasła. Zobacz [dokumentację konta](accounts.md) ([中文](../../accounts.md)). Nie ma domyślnego hasła. Pliki konta pozostają w katalogu danych runtime i nie wolno ich przesyłać. Zadania pozostają udostępnionymi danymi studia.

## Viggle v0.3

Dostępne są oddzielne sześcio- i dziewięcioetapowe tryby szczegółowe, przy czym poprzednie ustawienia domyślne zostają zachowane. Zobacz [instalacja i walidacja](viggle-v03.md) ([中文](../../viggle-v03.md)). Pobierz osobno wagi modeli na docelowy komputer Mac.
