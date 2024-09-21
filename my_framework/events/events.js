export default class EventManager {
    constructor() {
        this.observers = {}; // Stocke les observateurs pour chaque type d'événement
        this.assignEventHandlers(); // Assigne les gestionnaires d'événements
    }

    /**
     * Assigner les gestionnaires d'événements à l'objet document.
     * 
     * @memberof EventManager
     */
    assignEventHandlers() {
        // Gestion des événements sans utiliser addEventListener,
        // en utilisant des attributs d'événements en ligne
        this.assignEventHandler('click'); // Gérer les clics
        this.assignEventHandler('keydown', true, 10); // Gérer les pressions de touches avec un délai
        this.assignEventHandler('dblclick'); // Gérer les double-clics
        // ... autres événements DOM natifs
    }

    /**
     * Assigner un gestionnaire d'événements à l'objet document.
     * 
     * @param {string} eventType - Le type d'événement à gérer
     * @param {boolean} isThrottled - Indique si l'événement doit être limité par un délai
     * @param {number} delay - Le délai en millisecondes pour la limitation
     * @memberof EventManager
     */
    assignEventHandler(eventType, isThrottled = false, delay = 0) {
        let lastEventTime = 0; // Temps du dernier événement
        document[`on${eventType}`] = (event) => {
            if (isThrottled) {
                const now = new Date().getTime();
                if (now - lastEventTime >= delay) {
                    lastEventTime = now;
                    this.notify(eventType, event); // Notifie les abonnés
                }
            } else {
                this.notify(eventType, event); // Notifie les abonnés
            }
        };
    }

    /**
     * S'abonner à un événement.
     * 
     * @param {string} eventType - Le type d'événement à surveiller
     * @param {function} callback - La fonction à appeler lorsque l'événement se produit
     * @memberof EventManager
     */
    subscribe(eventType, callback) {
        // Gère les événements personnalisés au niveau de l'application
        if (!this.observers[eventType]) {
            this.observers[eventType] = []; // Initialise la liste des observateurs pour ce type d'événement
        }
        this.observers[eventType].push(callback); // Ajoute le callback à la liste des observateurs
    }

    /**
     * Se désabonner d'un événement.
     * 
     * @param {string} eventType - Le type d'événement
     * @param {function} callback - La fonction à retirer de la liste des abonnés
     * @memberof EventManager
     */
    unsubscribe(eventType, callback) {
        if (this.observers[eventType]) {
            this.observers[eventType] = this.observers[eventType].filter(cb => cb !== callback); // Retire le callback de la liste des observateurs
        }
    }

    /**
     * Notifier tous les abonnés d'un événement.
     * 
     * @param {string} eventType - Le type d'événement
     * @param {object} data - Les données de l'événement
     * @memberof EventManager
     */
    notify(eventType, data) {
        if (this.observers[eventType]) {
            this.observers[eventType].forEach(callback => callback(data)); // Appelle chaque callback avec les données de l'événement
        }
    }
}
