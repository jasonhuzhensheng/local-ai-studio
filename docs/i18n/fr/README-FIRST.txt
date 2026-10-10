Français | ../README.md
Ces documents sont des traductions automatiques de textes publics de projets et n'ont pas tous été révisés par des locuteurs natifs. Consultez la source anglaise ou chinoise en cas d'ambiguïté technique. Aucune donnée utilisateur privée n'est incluse.

Local AI Studio : package source de migration pour un nouveau Mac Apple Silicon

Cette version révisée comprend la source frontend/backend, les tests, les manifestes de téléchargement de modèles, les dépendances épinglées, la source du moteur natif et les correctifs vidéo Apple expérimentaux. Il se peut qu’elle soit à la traîne du développement ou de la production locale.
Il exclut les poids, les environnements virtuels, les tâches précédentes, les images de référence, les enregistrements de discussion, la configuration du compte et les secrets. Ce n'est pas un app en un clic.

Donnez l'intégralité de ce dossier à un assistant de codage sur le Mac cible, avec INSTALL-PROMPT.en.txt.
La machine de validation d'origine était une M2 Max avec une mémoire 96GB. Vérifiez d'abord le modèle cible, la mémoire et le système d'exploitation. Ne réutilisez pas aveuglément les paramètres vidéo sur les Mac disposant de moins de mémoire.

Contenu :
 src/ Frontend, backend, outils download/validation, manifestes de modèles
 Essais tests/ ; certains nécessitent l'installation de models/services. Ne pas exécuter tous sans discernement
 requirements/viggle-pinned.txt Environnement d’image épinglée
 src/h3_requirements.lock Environnement vidéo épinglé séparé
 vendor/ Source native sans binaires compilés ; conserver les licences en amont
 patches/ ComfyUI/ClipProj valide et déploie les modifications de Python
 SHA256SUMS.txt Sommes de contrôle par fichier

Points d'entrée du modèle : image_models.json (Qwen GGUF), viggle_turbo_model.json / viggle_turbo_v021_model.json / viggle_turbo_v03_model.json (base model/adapters), wai_model.json, upscale_model.json et h3_apple_models.json (vidéo), sous src/. Vérifiez chaque manifeste et son programme d'installation avant de le télécharger.
Modèle de texte : huihui-ai/Huihui-Qwen3.8-27B-abliterated-GGUF, fichier Huihui-Qwen3.8-27B-abliterated-UD-Q4_K_XL.gguf. Ce package n'inclut pas de revision/hash épinglé complet pour ce modèle. Obtenez et enregistrez d'abord des métadonnées fiables en amont ; ne revendiquez pas l'équivalence octet par octet avec la machine d'origine.

Une installation sur une nouvelle machine n'a pas été validée. Examinez les chemins d’accès à la machine d’origine, les alias de modèle et les chemins d’outils système pour l’utilisateur cible. Ne réappliquez pas les correctifs historiques à la source du fournisseur déjà modifiée. Un téléchargement réussi ne constitue pas la preuve d’une inférence réussie ou d’une qualité acceptable.

Utilisez le menu de langue en haut à droite pour choisir parmi les langues 33. Le navigateur mémorise votre sélection. Les modules linguistiques sont servis localement ; changer de langue n’envoie pas de contenu à un service de traduction en ligne. Les invites utilisateur, les conversations et le contenu enregistré conservent leur langue d'origine.
