export default class Router {
  constructor(routes, stateManager, eventsManager) {
    this.routes = routes; // Configuration des routes pré-définies
    this.stateManager = stateManager; // Référence au gestionnaire d'état
    this.eventsManager = eventsManager; // Référence au gestionnaire d'événements

    // Initialisation des routes et potentiellement configuration
    // des écouteurs pour les changements d'URL
    window.addEventListener("hashchange", this.handleHashChange.bind(this));
  }

  /**
   * Naviguer vers un chemin différent.
   *
   * @param {string} path - Le chemin vers lequel naviguer
   * @memberof Router
   */
  navigate(path) {
    // Logique pour naviguer vers un chemin différent,
    // en mettant à jour l'état et l'interface utilisateur si nécessaire
    window.location.hash = path; // Met à jour le hash de l'URL
  }

  /**
   * Gérer les changements de hash dans l'URL.
   *
   * @memberof Router
   */
  handleHashChange() {
    const path = window.location.hash.slice(1); // Supprime le symbole '#' du hash
    // Étape 3 : Résoudre la route
    const matchingRoute = this.routes.find((route) => route.path === path);

    if (matchingRoute) {
      // Étape 4 : Mettre à jour l'état
      this.stateManager.setState({ currentRoute: matchingRoute });
      // Étape 5 : Notifier les abonnés
      this.eventsManager.notify("routeChange");
    } else {
      // Donne une erreur 404
      window.location = "404";
    }
  }
}
