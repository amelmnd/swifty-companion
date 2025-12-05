# Swifty Companion

Swifty Companion est une application mobile permettant de rechercher les profils des étudiants de l'école 42 via l’API officielle. L’application affiche les informations essentielles d’un utilisateur : login, email, niveau, compétences, projets et coalition.

---

## Description

L’application comporte :

- Une authentification OAuth2 via l’API 42.
- Un écran de recherche permettant d’entrer un login.
- Un écran de profil affichant toutes les informations de l’utilisateur.
- Une gestion complète des erreurs (login introuvable, réseau, token expiré…).
- Une interface responsive compatible avec différents formats d’écran.

---

## Stack technique

* **Framework mobile** : React Native (`react-native` 0.81.4)
* **Environnement de développement** : Expo (`expo` 54.0.13)
* **Auth & API** : API officielle 42 (OAuth2)
* **Backend proxy** : Node.js + Express (gestion OAuth2 et communication avec l’API 42)
* **Styling** : StyleSheet React Native

---

## Structure du projet

```
swifty-companion/
├── app/                         # Écrans et navigation de l'application (Expo / React Native)
│   ├── index.tsx                # Point d'entrée de l'application
│   ├── _layout.tsx              # Layout global Expo Router
│   └── screens/                 # Écrans principaux
│       ├── LoadingScreen.tsx    # Écran de chargement
│       ├── LoginScreen.tsx      # Écran de connexion / OAuth2
│       ├── ProfileScreen.tsx    # Profil détaillé de l'utilisateur
│       └── SearchScreen.tsx     # Recherche par login
│
├── assets/                      # Ressources statiques
│
├── components/                  # Composants UI réutilisables
│   ├── ProfileHeader.tsx
│   ├── ProjectsTabs.tsx
│   ├── ResponsiveLayout.tsx
│   ├── ScrollableSection.tsx
│   └── SkillList.tsx
│
├── lib/                         # Fonctions utilitaires et appels API
│   ├── auth.ts                  # Gestion OAuth2 (front)
│   ├── getCoalition.ts          # Récupération des coalitions utilisateur
│   ├── getUser.ts               # Récupération du profil utilisateur
│   └── profileUtils.ts          # Fonctions d'aide liées au profil utilisateur
│
├── server/                      # Backend Express (proxy sécurisé pour API 42)
│
├── default.env                  
├── package.json                 
└── tsconfig.json               
```

---

## Fonctionnalités

- Authentification OAuth2 via l’API 42.
- Recherche d’un utilisateur par login.
- Gestion des erreurs et des états de chargement.

### Backend (`server/`)
- Gestion complète du flux OAuth2.
- Proxy sécurisé vers l’API 42.
- Appels API centralisés (login, récupération des données utilisateur).
- Rafraîchissement automatique du token (bonus du sujet).

### Frontend (`app/`)
- Navigation entre les différents écrans.
- Composants UI réutilisables.
- Mise en page responsive adaptée à tous les types d’écrans.
- Affichage détaillé : login, email, mobile, niveau, progression, compétences, photo, coalition, projets.

---

## Installation

### 1. Cloner le projet
```bash
git clone git@github.com:amelmnd/swifty-companion.git
cd swifty-companion
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d’environnement
Ce projet utilise deux fichiers `.env` distincts :
- un fichier pour le front (Expo / React Native)
- un fichier pour le serveur backend (proxy sécurisé OAuth2)


**Front (.env)**
```javascript
EXPO_PUBLIC_BACKEND_URL= 
//URL locale du backend
```

**Backend (server/.env)**
```javascript
CLIENT_ID=client_id_intra_42
CLIENT_SECRET=client_secret_intra_42

//URL publique utilisée pour OAuth2
BACKEND_BASE_URL=url_backend
PORT=port_backend

//L’URL de redirection enregistrée sur l’intra
REDIRECT_URI=BACKEND_BASE_URL:PORT/callback

//exemple : http://192.168.1.43:3001/callback
```


### 4. Lancer l’application
```bash
npm start
```

## Aperçu du rendu

_rendu a venir_


---

## 📜 Licence

Projet réalisé dans le cadre du cursus 42.
