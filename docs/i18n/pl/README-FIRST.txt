Polski | ../README.md
Dokumenty te są tłumaczeniami maszynowymi tekstów projektów publicznych i nie wszystkie zostały sprawdzone przez rodzimych użytkowników języka. W przypadku niejasności technicznych należy zapoznać się ze źródłem angielskim lub chińskim. Żadne prywatne dane użytkownika nie są uwzględniane.

Local AI Studio: pakiet źródłowy migracji dla nowego komputera Mac Apple Silicon

To sprawdzone wydanie zawiera źródło frontend/backend, testy, manifesty pobierania modelu, przypięte zależności, źródło natywnego silnika i eksperymentalne poprawki wideo Apple. Może pozostawać w tyle za lokalnym rozwojem lub produkcją.
Nie obejmuje wag, środowisk wirtualnych, poprzednich zadań, obrazów referencyjnych, zapisów czatów, konfiguracji konta i sekretów. To nie jest app uruchamiany jednym kliknięciem.

Przekaż cały ten folder asystentowi kodowania na docelowym komputerze Mac wraz z INSTALL-PROMPT.en.txt.
Oryginalną maszyną walidacyjną był M2 Max z pamięcią 96GB. Najpierw sprawdź model docelowy, pamięć i system operacyjny. Nie używaj ponownie ustawień wideo na ślepo na komputerach Mac z mniejszą ilością pamięci.

Zawartość:
 src/ Frontend, backend, narzędzia download/validation, manifesty modeli
 Testy tests/; niektóre wymagają zainstalowanego models/services. Nie uruchamiaj wszystkich bezkrytycznie
 requirements/viggle-pinned.txt Środowisko przypiętego obrazu
 src/h3_requirements.lock Oddzielne, przypięte środowisko wideo
 vendor/ Natywne źródło bez skompilowanych plików binarnych; zachować licencje na wydobycie
 patches/ ComfyUI/ClipProj zatwierdza i wdraża zmiany Python
 SHA256SUMS.txt Sumy kontrolne dla poszczególnych plików

Punkty wejścia modelu: image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (podstawowy model/adapters), wai_model.json, upscale_model.json i h3_apple_models.json (wideo), pod src/. Sprawdź każdy manifest i jego instalator przed pobraniem.
Model tekstowy: huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, plik Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Ten pakiet nie zawiera kompletnego przypinanego revision/hash dla tego modelu. Najpierw uzyskaj i zapisz zaufane metadane nadrzędne; nie żądaj równoważności bajt po bajcie z oryginalną maszyną.

Instalacja na nowej maszynie nie została sprawdzona. Przejrzyj ścieżki oryginalnej maszyny, aliasy modeli i ścieżki narzędzi systemowych dla użytkownika docelowego. Nie stosuj ponownie poprawek historycznych do już zmodyfikowanego źródła dostawcy. Pomyślne pobranie nie jest dowodem pomyślnego wnioskowania ani akceptowalnej jakości.

Użyj menu języka w prawym górnym rogu, aby wybrać język 33. Przeglądarka pamięta Twój wybór. Pakiety językowe są dostarczane lokalnie; zmiana języka nie powoduje przesłania treści do usługi tłumaczeń online. Podpowiedzi użytkownika, rozmowy i zapisana treść zachowują swój oryginalny język.
