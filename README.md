# MiniShop E-commerce

Créer un site web e-commerce moderne, dynamique et responsive ("MiniShop") en consommant l'API externe Platzi Fake Store API : https://api.escuelajs.co/api/v1/products 1. Design & UI/UX : - Style épuré, moderne et professionnel avec Tailwind CSS (thème clair avec possibilité de mode sombre). - Utiliser Lucide Icons pour les icônes (panier, recherche, filtres, cœur pour les favoris). - Header fixe comprenant : Le logo/nom du site, une barre de recherche en temps réel, un sélecteur de catégorie et l'icône du Panier avec un badge indiquant le nombre d'articles. 2. Fonctionnalités Clés : - Catalogue Produit (Page d'accueil) : * Récupérer les produits depuis : https://api.escuelajs.co/api/v1/products * Afficher les produits sous forme de grille responsive (cartes produits avec image, titre, catégorie, prix et bouton "Ajouter au panier"). * Filtrage dynamique par catégorie (en appelant https://api.escuelajs.co/api/v1/categories ou en filtrant les produits). * Recherche textuelle instantanée par nom de produit. * Tri des produits par prix (croissant / décroissant). * Pagination ou défilement fluide pour gérer l'affichage de la centaine de produits. - Modal / Fiche Détail Produit : * Au clic sur une carte, ouvrir une fenêtre modale (ou vue dédiée) montrant toutes les images du produit, la description complète, le prix et le bouton d'ajout au panier. - Gestion du Panier (Drawer / Slide-over latéral) : * Ajouter / Retirer des produits du panier. * Modifier la quantité de chaque article. * Calcul automatique du sous-total, des taxes fictives et du total global. * Sauvegarder le contenu du panier dans le LocalStorage pour conserver les articles après rafraîchissement. - Page de Checkout (Simulation) : * Un formulaire de commande étape par étape (Adresse de livraison, Mode de paiement fictif). * Un bouton "Valider la commande" qui vide le panier et affiche un message de confirmation de commande réussi avec un numéro de suivi aléatoire. 3. Gestion des états et erreurs : - Afficher un skeleton loader (effet de chargement gris animé) pendant la récupération des données de l'API. - Gérer proprement les erreurs réseau avec un message d'alerte élégant et un bouton "Réessayer". - Pour les images cassées provenant de l'API, prévoir un fallback automatique vers une image générique/placeholder.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/44ef7150-c881-44cc-8457-987f59c01605).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
