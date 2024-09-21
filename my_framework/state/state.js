export default class StateManager {
    constructor(initialState) {
        this.state = initialState || {}; // Initialiser l'état avec l'état initial fourni ou un objet vide

        // Autres configurations pour la gestion de l'état, comme la configuration
        // des écouteurs pour les changements d'état
    }

    /**
     * Mettre à jour l'état.
     * 
     * @param {object} newState - Le nouvel état à fusionner avec l'état actuel
     * @memberof StateManager
     */
    setState(newState) {
        // Fusionne le nouvel état avec l'état actuel
        this.state = { ...this.state, ...newState };

        // Sauvegarde chaque clé du nouvel état dans le localStorage
        for (const key in newState) {
            localStorage.setItem(key, JSON.stringify(newState[key]));
        }

        // Logique pour mettre à jour l'état, en s'assurant que cela se fait
        // de manière organisée et traçable
    }

    /**
     * Récupérer l'état actuel.
     * 
     * @returns {object} state - L'état actuel
     * @memberof StateManager
     */
    getState() {
        // Logique pour récupérer l'état actuel
        return this.state;
    }
}
