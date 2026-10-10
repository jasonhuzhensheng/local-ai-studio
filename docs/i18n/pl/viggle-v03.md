[Polski](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Dokumenty te są tłumaczeniami maszynowymi tekstów projektów publicznych i nie wszystkie zostały sprawdzone przez rodzimych użytkowników języka. W przypadku niejasności technicznych należy zapoznać się ze źródłem angielskim lub chińskim. Żadne prywatne dane użytkownika nie są uwzględniane.

# Instalacja i tryby Viggle v0.3

Oficjalne źródło: https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Przypięta wersja, rozmiary i skróty: `src/viggle_turbo_v03_model.json`. Instalator: `src/install_viggle_turbo_v03.py`. Używa oddzielnego katalogu `models/viggle-qwen-turbo-v03` podczas współdzielenia zainstalowanego modelu podstawowego i istniejącego środowiska Python. Nie aktualizuje zależności ani nie nadpisuje v0.1/v0.2.1.

Menu modelu obrazu oferuje:

- **Viggle v0.3 · Kroki 6, czystsze obrazy**: oficjalny harmonogram sigma sześciu node, CFG1.
- **Viggle v0.3 · Kroki 9, ulepszone szczegóły**: siedem kroków Turbo, następnie wyłącz LoRA, przełącz następny buforowany przebieg KV na ekstrakcję i użyj modelu podstawowego w dwóch ostatnich krokach. LoRA i zachowanie do przodu zostaną później przywrócone. Samo ustawienie zwykłej liczby kroków na dziewięć nie jest równoważne.

Wersja 0.3 obsługuje do trzech odniesień, brak negatywnego monitu i domyślny kwadrat 1024px, jeśli jest wybrany. Poprzednie domyślne wymiary v0.2.1 i iPhone'a pozostają; oryginalny model nadal obsługuje dziesięć odniesień. Natywne duże rozmiary, kafelkowanie VAE i istniejące przetwarzanie końcowe 8K pozostają do wyboru, ale nie każda kombinacja została przetestowana.

LoRA nie jest połączony z obciążnikami BF16; siła to 1. Harmonogram `shift_terminal` musi być null. v0.3 może być mniej ziarnisty, ale nieco bardziej miękki; nie ma gwarancji, że w każdym przypadku będzie działać lepiej niż starsze wersje. Oficjalne dziewięciostopniowe współczynniki czasowe nie są lokalnymi punktami odniesienia.

## Walidacja

`tests/viggle_model.mjs` wykorzystuje izolowane, rzadkie uchwyty modelu do weryfikacji liczby kroków, limitów odniesienia, trasowania o dużych rozmiarach i znaczników gotowości. `tests/viggle_schedule.py` sprawdza wyłączenie LoRA po kroku siódmym, po jednym ponownym wyodrębnieniu i przywróceniu KV.

Sześcioetapowa próbka 512×512, nasiona-42 z niebieskim kubkiem, ukończona w 52.98, łącznie z ładowaniem process/model. Sprawdzono wymiary i rzeczywisty obraz. Pierwsza dziewięcioetapowa próba została zatrzymana, gdy nowe połączenie tekstowe uruchomiło ochronę zasobów; nie był to błąd wnioskowania.

Dziewięcioetapowa ponowna próba zakończona w 65.42 o 512×512, ziarno 42. Po kroku siódmym przeszedł na model podstawowy, wykonał dziewięć kroków i uzyskał prawidłowe wymiary. Kontrola wzrokowa nie wykazała hałasu green/magenta. Jedna próbka na tryb nie stanowi stabilnego punktu odniesienia wydajności. Liczne referencje, duże obrazy i przetwarzanie końcowe 8K nie zostały zweryfikowane w tych seriach.
