[Français](README.md) · [🌐 Languages](../README.md) · [English](../../../README.md) · [简体中文](../../../README.zh-CN.md)

> Ces documents sont des traductions automatiques de textes publics de projets et n'ont pas tous été révisés par des locuteurs natifs. Consultez la source anglaise ou chinoise en cas d'ambiguïté technique. Aucune donnée utilisateur privée n'est incluse.

# Comptes de sites Web

## Utilisation

Sur le Mac exécutant le service, ouvrez `http://127.0.0.1:1235/setup` pour créer le premier administrateur. Les noms d’utilisateur contiennent des lettres, des chiffres, des traits de soulignement ou des traits d’union 3 – 32 et sont normalisés en minuscules. Les mots de passe contiennent des caractères 12 à 128. Il n'y a pas d'informations d'identification par défaut. Les appareils distants ne peuvent pas revendiquer le compte administrateur initial.

Après la configuration, les appareils non authentifiés voient la page de connexion. Ouvrez **Compte / Déconnexion** (`/account`) pour modifier votre mot de passe ou vous déconnecter. Les administrateurs peuvent créer users/administrators, réinitialiser les mots de passe, les comptes disable/enable, modifier les rôles et supprimer des comptes. La suppression et les modifications d'autorisation nécessitent une confirmation. Le serveur empêche la suppression, la désactivation ou la rétrogradation du dernier administrateur activé. La suppression d'un compte ne supprime pas les tâches partagées.

Utilisez le menu de langue en haut à droite pour choisir parmi les langues 33. Le navigateur mémorise votre sélection. Les modules linguistiques sont servis localement ; changer de langue n’envoie pas de contenu à un service de traduction en ligne. Les invites utilisateur, les conversations et le contenu enregistré conservent leur langue d'origine.

Il s'agit d'un studio partagé. Les utilisateurs connectés partagent l'accès aux images, aux vidéos et aux tâches de discussion côté serveur. L'historique des discussions du navigateur reste dans localStorage. Il n'y a pas d'isolation multi-locataires, de stockage de tâches par utilisateur ou de facturation. La restriction existante relative aux vidéos locales uniquement demeure.

## Stockage et protection

- `src/studio_auth.mjs` s'exécute avant les routes commerciales, y compris les API et les fichiers image/reference/video. Les pages non authentifiées sont redirigées avec 303 ; Les API et les médias renvoient 401. Les actifs du compte, les actifs linguistiques et le statut non secret setup/sign-in sont publics.
-Fichier de compte : `LOCAL_IMAGE_DATA_DIR/auth/users.json`, `app/.local/auth/users.json` par défaut ; le déploiement dédié utilise `runtime/auth/users.json`. Mode répertoire : 0700 ; mode fichier : 0600. Les mots de passe utilisent scrypt N32768/r8/p1, des sels aléatoires et une comparaison de hachage à temps constant. Les écritures sont atomiques et les modifications de compte sérialisées. Une base de données existante corrompue empêche le démarrage plutôt que de rouvrir l'enregistrement.
- Les sessions utilisent des octets aléatoires 32 ; le serveur stocke uniquement le résumé. Les cookies sont HttpOnly, SameSite=Strict, valables pendant les heures 12. Le redémarrage nécessite de se reconnecter. Password/role modifie, réinitialise, désactive et supprime les sessions concernées. La déconnexion ne supprime ni ne réexécute les tâches déjà démarrées.
- Les écritures nécessitent des Origin et JSON de même origine. X-Forwarded-For n’est pas fiable. Chaque adresse IP source obtient un maximum de tentatives 15 sign-in/setup/self-password-change par minute 15. Limites : dérivations de mots de passe simultanées 4 et comptes 100. Le redémarrage efface les limites de tentatives.
- Le déploiement existant utilise HTTP sur Tailscale privé. Tailscale chiffre le transport d'appareil à appareil ; Le HTTP LAN ordinaire lui-même ne le fait pas. L'accès public et TLS ne sont pas configurés par ce package. Les cookies Secure sont définis uniquement pour les requêtes TLS natives. Ne l'exposez pas directement via HTTP public.
- Ne téléchargez jamais la base de données d'authentification, les sessions ou les mots de passe. Initialisez les nouveaux comptes lors de la migration. Les autorisations stdio MCP, LM Studio locales et les fichiers du système d'exploitation sont en dehors de l'authentification du site Web.

## Validation

Exécutez `node tests/studio_auth.mjs` avec sa base de données de comptes temporaire et pas de véritable models. Il couvre le blocage API/media non authentifié, les restrictions d'origine de la configuration initiale, les rôles, les modes de mot de passe hashing/file, la protection du dernier administrateur, la révocation de session, la persistance, le rejet des fichiers corrompus et les limites de débit.

Les tests local_chat, chat_background, image_studio et video_web se connectent avec des administrateurs de tests isolés ; il n’y a pas de contournement d’authentification de production. Les vrais mots de passe sont saisis par l'utilisateur et ne doivent pas être enregistrés dans les tests ou la documentation.
