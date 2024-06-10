# API Black Market
Author : Maxime Seignovert 

API Version : 2.7.0

## Spécification système
L'API Black Market fournit un ensemble de fonctionnalités pour gérer des produits, utilisateurs, catégories et commandes au sein d'un marché noir fictif.

Elle a été créer pour fonctionner avec le jeu tour of heroes, qui est un projet angular réalisé dans le contexte du module `R5.Real.05 Programmation avancée`.

Le jeu Tour of heroes exploite cette api afin d'enregistrer ou d'extraire des informations.
On pourra retrouver plusieurs logiques internes tel que :
- Gestion des utilisateurs
- Gestion monétaire
- Gestion de produits
- Gestion de commandes

Toutes les possibilités de l'API n'ont cependant pas été exploitées dans le jeu, de plus l'API est en version 2.7.0 et pourrait subir des ajout avec par exemple un système de note ou bien d'avis.

![](./Diagram.png "Diagramme métier de la spécification").

## Se connecter au serveur
L'API a été déployé ! Elle est donc disponible à l'adresse : http://seignovm.fr:3000

La documentation swagger est aussi disponible à l'adresse : http://seignovm.fr:3000/api-docs
ou bien directement dans le fichier `Black_market_v2.7.0/specification.yaml` fourni.

Si vous souhaiter tester l'API avec un client, une version de tour of heroes est disponible à l'adresse : http://www-etu-info.iut2.upmf-grenoble.fr/~seignovm/info7/

## Installation local
Installer les packages du projet
```bash
npm install
```

Se connecter à l'url http://localhost:3000

## Jeu de données

Le jeu de données utilisé est disponible à la racine de l'API : http://seignovm.fr:3000/

Une version local (non mis à jour) est également disponible dans le fichier `Black_market_v2.7.0/database.json`

## Méthodologie suivie

### Version 1.0 de l'API :

Dans un premier temps, j'ai créé la spécification en mermaid pour obtenir un diagramme de classe visualisable. En parallèle, j'ai entamé la rédaction de ma documentation Swagger tout en développant mon API Node.js. La version 1.0 a été utilisée pour le rendu du client Angular Tour of Heroes, mais elle n'était pas totalement complète. Pour simplifier son utilisation dans le client, je l'ai déployée sur un VPS à l'aide de PM2 (gestionnaire de processus) et Nginx (proxy inverse).

### Version 2.0 de l'API :

Afin de mieux correspondre aux besoins du client développé, j'ai dû revoir la structure de l'API et, par conséquent, les spécifications. Ensuite, j'ai élaboré la documentation Swagger à l'aide de l'éditeur web en local. J'ai ensuite complété les requêtes Express dans l'application Node.js en veillant à ne pas induire de régressions pour le client existant. Ensuite, j'ai fusionné la documentation YAML avec le serveur (/api-docs). Enfin, j'ai enrichi le client pour inclure quelques cas d'utilisation supplémentaires.