# Swifty Companion

## Description du projet

Swifty Companion est une application mobile développée en **React Native** dans le cadre du projet scolaire *Mobile Initiation*.
L’objectif est de créer une application permettant de rechercher et consulter les informations des étudiants de l’école **42**, en utilisant l’API officielle de l’intra (OAuth2).

L’application met en avant :

* La découverte du développement mobile.
* L’intégration et la consommation d’une API REST (42 API).
* La gestion d’erreurs et de cas limites (login introuvable, erreur réseau, etc.).
* Une interface moderne et responsive adaptée à différents écrans.

---
## Fonctionnalités principales
### Partie obligatoire

* Rechercher un utilisateur par son login 42.
* Affichage des infos principales (profil, email, niveau, wallet, campus, photo).
* Liste des compétences et des projets réalisés (réussis ou échoués)..
* Gérer les erreurs (mauvais login, problème de connexion, etc.).
* Naviguer entre plusieurs vues (recherche ↔ profil).

### Partie Bonus (si la partie obligatoire validé)
* Rafraîchissement automatique du **token** à expiration.

---

## Stack technique

* **Langage** : JavaScript / TypeScript 
* **Framework** : React Native avec expo
* **API** : 42 API (OAuth2)

---

## Installation & lancement

```bash
# Cloner le dépôt
git clone https://github.com/mon-compte/swifty-companion.git

# Installer les dépendances
npm install
# ou
yarn install

# Lancer l’application
npm start
```

---

## Roadmap

* [x] Initialisation du projet React Native
* [ ] Comprendre l'authentification OAuth2
* [ ] Lire la docuemnatation et tester **42 API**
* [ ] Mise en place de l’authentification OAuth2 (42 API)
* [ ] Création de la vue de recherche (login étudiant)
* [ ] Création de la vue profil (informations principales + photo)
* [ ] Affichage des compétences et niveaux
* [ ] Affichage des projets réalisés (succès/échec)
* [ ] Gestion avancée des erreurs (réseau, login invalide, etc.)
* [ ] Amélioration de l’UI/UX (responsive, animations, thèmes)
* [ ] Rafraîchissement automatique du token (bonus)
* [ ] Tests et optimisation
# swifty-companion
