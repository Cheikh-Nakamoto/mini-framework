import MiniFramework from "../my_framework/mini-framework.js";

// Définir la configuration pour l'application
let items = [];
let currentRoute = {};

// Récupérer les éléments stockés dans le localStorage
let storedItems = JSON.parse(localStorage.getItem("items"));

if (storedItems != null && storedItems instanceof Array) {
  items = storedItems; // Si des éléments sont stockés et qu'il s'agit d'un tableau, les utiliser comme éléments initiaux
}

const config = {
  initialState: {
    // État initial pour l'application
    items,
    currentRoute,
  },
  routes: [
    // Informations de routage
    {
      path: "/", // Chemin racine
      component: "All", // Composant à rendre pour ce chemin
    },
    {
      path: "/active", // Chemin pour les éléments actifs
      component: "Active", // Composant à rendre pour les éléments actifs
    },
    {
      path: "/completed", // Chemin pour les éléments complétés
      component: "Completed", // Composant à rendre pour les éléments complétés
    },
  ],
};

// Créer une instance du MiniFramework avec la configuration définie
const fw = new MiniFramework(config);

export default fw; // Exporter l'instance du framework pour l'utiliser ailleurs dans l'application
