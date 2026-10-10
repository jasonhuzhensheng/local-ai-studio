[Français](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ces documents sont des traductions automatiques de textes publics de projets et n'ont pas tous été révisés par des locuteurs natifs. Consultez la source anglaise ou chinoise en cas d'ambiguïté technique. Aucune donnée utilisateur privée n'est incluse.

# Installation et modes Viggle v0.3

Source officielle : https://huggingface.co/Viggle/Qwen-Image-2.1-viggle-turbo

Révision épinglée, tailles et hachages : `src/viggle_turbo_v03_model.json`. Installateur : `src/install_viggle_turbo_v03.py`. Utilise un répertoire `models/viggle-qwen-turbo-v03` distinct tout en partageant le modèle de base installé et l'environnement Python existant. Il ne met pas à niveau les dépendances et n'écrase pas v0.1/v0.2.1.

Le menu image-modèle propose :

- **Viggle v0.3 · Étapes 6, images plus propres** : calendrier sigma officiel six-node, CFG1.
- **Viggle v0.3 · Étapes 9, détails améliorés** : sept étapes Turbo, puis désactivez le LoRA, passez la prochaine passe KV mise en cache à l'extraction et utilisez le modèle de base pour les deux dernières étapes. LoRA et le comportement avant sont restaurés par la suite. Le simple fait de définir un nombre de pas régulier à neuf n’est pas équivalent.

v0.3 prend en charge jusqu'à trois références, aucune invite négative et un carré 1024px par défaut lorsqu'il est sélectionné. Les dimensions par défaut et iPhone de la v0.2.1 précédente restent ; le modèle original prend toujours en charge dix références. Les grandes tailles natives, le carrelage VAE et le post-traitement 8K existant restent sélectionnables, mais toutes les combinaisons n'ont pas été testées.

Le LoRA n'est pas fusionné dans les poids BF16 ; la force est 1. Le planificateur `shift_terminal` doit être null. v0.3 peut être moins granuleux mais légèrement plus doux ; il n'est pas garanti qu'il surpassera les anciennes versions dans tous les cas. Les ratios de synchronisation officiels en neuf étapes ne constituent pas des références locales.

## Validation

`tests/viggle_model.mjs` utilise des appareils de modèle clairsemés isolés pour vérifier le nombre de pas, les limites de référence, le routage de grande taille et les marqueurs de préparation. `tests/viggle_schedule.py` vérifie la désactivation du LoRA après la septième étape, une réextraction et une restauration d'un KV.

Un échantillon de tasse bleue 512×512 en six étapes, graine-42, complété dans les 52.98, y compris le chargement de process/model. Les dimensions et l'image réelle ont été vérifiées. La première tentative en neuf étapes s'est arrêtée lorsqu'une nouvelle connexion texte a déclenché la protection des ressources ; ce n’était pas une erreur d’inférence.

Nouvelle tentative en neuf étapes terminée dans les 65.42 à 512×512, graine 42. Il est passé au modèle de base après la septième étape, a complété neuf étapes et a produit les dimensions correctes. L'inspection visuelle n'a révélé aucun bruit green/magenta. Un échantillon par mode ne constitue pas une référence de performances stable. Les références multiples, les images volumineuses et le post-traitement 8K n'ont pas été validés par ces analyses.
