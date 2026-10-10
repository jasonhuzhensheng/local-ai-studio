[Français](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ces documents sont des traductions automatiques de textes publics de projets et n'ont pas tous été révisés par des locuteurs natifs. Consultez la source anglaise ou chinoise en cas d'ambiguïté technique. Aucune donnée utilisateur privée n'est incluse.

# MacBook Pro Studio

Un studio local d'image, de chat et de vidéo expérimentale pour les Mac Apple Silicon.

## Langue de l'interface

Utilisez le menu de langue en haut à droite pour choisir parmi les langues 33. Le navigateur mémorise votre sélection. Les modules linguistiques sont servis localement ; changer de langue n’envoie pas de contenu à un service de traduction en ligne. Les invites utilisateur, les conversations et le contenu enregistré conservent leur langue d'origine.

## Aperçus de l'interface

Ces aperçus utilisent les styles de page publiés. Toutes les invites, identifiants de tâches, horodatages, illustrations et conversations sont du contenu de démonstration fictif créé pour ce README. Ils ne contiennent aucun compte réel, image d’utilisateur ou enregistrement de discussion. Les illustrations sont dessinées par programme, et non par des modèles de référence ou des allégations de qualité.

### Studio d'images

Choisissez un modèle, entrez une invite et parcourez les tâches et les résultats d'image.

![Studio d'images avec tâches fictives et illustrations de paysages dessinées par programme](../../images/image-studio-demo.en.png)

### Chat local

Discutez dans le même studio et sélectionnez un mode et une durée de réponse.

![Chat local avec une conversation fictive de planification d'illustration écrite manuellement](../../images/chat-studio-demo.en.png)

## Configurer un nouveau Mac

1. Clonez ce référentiel.
2. Lisez le [guide de déploiement](README-FIRST.txt) ([中文](../../../README-先读我.txt)).
3. Donnez l'[invite d'installation ](INSTALL-PROMPT.txt) ([中文](../../../INSTALL-PROMPT.txt)) à un assistant de codage sur le Mac cible pour installer les dépendances et télécharger models approprié pour ce matériel.

Pages : `/edit` pour les images, `/chat` pour le chat, `/video` pour la vidéo. Le port Web par défaut est `1235`.

Ce référentiel est une version révisée et une copie de migration. Il se peut qu’elle soit à la traîne du développement ou de la production locale. Il exclut les poids des modèles, les environnements virtuels, les tâches utilisateur, les enregistrements de discussion, les images de référence et la configuration du compte. Une installation complète sur une nouvelle machine n'a pas été validée. Ce n'est pas une application en un clic.

## Contenu du référentiel

- `src/` : frontend, backend, modèles de manifestes, outils d'installation et de validation.
- `tests/` : essais ; certains nécessitent l'installation de models ou des services en cours d'exécution.
- `requirements/` : dépendances épinglées.
- `vendor/` : source moteur native, avec licences amont conservées.
- `patches/` : versions épinglées et adaptations Apple.

Les modèles et les sources tierces conservent leurs licences en amont. H3/ClipProj Le support Apple est expérimental. Un court échantillon réussi n’établit pas de support pour chaque résolution ou durée.

## Connexion et comptes

Sur le Mac exécutant le service, ouvrez `http://127.0.0.1:1235/setup` pour créer le premier administrateur, puis connectez-vous depuis d'autres appareils. Les administrateurs peuvent créer, désactiver et supprimer des comptes et réinitialiser les mots de passe. Voir [documentation du compte ](accounts.md) ([中文](../../accounts.md)). Il n'y a pas de mot de passe par défaut. Les fichiers de compte restent dans le répertoire de données runtime et ne doivent pas être téléchargés. Les tâches restent des données de studio partagées.

## Viggle v0.3

Des modes de détail distincts en six et neuf étapes sont disponibles, la valeur par défaut précédente étant conservée. Voir [installation et validation](viggle-v03.md) ([中文](../../viggle-v03.md)). Téléchargez les poids des modèles séparément sur le Mac cible.
