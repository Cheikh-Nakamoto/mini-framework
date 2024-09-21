import StateManager from './state/state.js';
import Router from './router/router.js';
import EventManager from './events/events.js';
import DOMAbstraction from './dome/dom.js';

export default class MiniFramework {
    /**
     * Crée une instance de MiniFramework.
     * 
     * @param {object} config - La configuration du framework
     * @param {object} config.initialState - L'état initial de l'application
     * @param {array} config.routes - Les routes de l'application
     * @memberof MiniFramework
     */
    constructor(config) {
        // Initialise le gestionnaire d'état avec l'état initial
        this.state = new StateManager(config.initialState);
        
        // Initialise le gestionnaire d'événements
        this.events = new EventManager();
        
        // Initialise le routeur avec les routes, l'état et les événements
        this.router = new Router(config.routes, this.state, this.events);
        
        // Initialise l'abstraction du DOM avec le gestionnaire d'événements
        this.dom = new DOMAbstraction(this.events);
    }
}
