import fw from "../appConfig.js"; // Importer l'instance du framework
import { uuidv4 } from "../utils.js"; // Importer la fonction pour générer des UUID

// Fonction pour créer un élément <input> virtuel
const Input = (attrs = {}, children = [], listeners = {}) =>
    fw.dom.createVirtualNode("input", {
        attrs: {
            ...attrs, // Attributs de l'élément <input>
        },
        children,
        listeners, // Écouteurs d'événements pour l'élément <input>
    });

// Exporter le nœud virtuel <input> avec des valeurs définies et un gestionnaire d'événements
export default Input(
    {
        id: "todo-input", // ID de l'élément
        class: "new-todo", // Classe CSS de l'élément
        placeholder: "what needs to be done?", // Texte d'espace réservé
        style: "background: none", // Style en ligne pour l'élément
    },
    [""], // Valeur initiale de l'élément
    {
        keydown: (e) => {
            // Gestionnaire d'événement pour la touche "keydown"
            var inputValue = document.getElementById("todo-input").value.trim(); // Obtenir la valeur du champ de saisie

            if ((e.code === "Enter" || e.code === "NumpadEnter") && inputValue.length >= 2) {
                // Vérifier si la touche pressée est "Enter" ou "NumpadEnter" et si la valeur n'est pas vide et a au moins 2 caractères
                let item = {
                    id: uuidv4(), // Générer un nouvel UUID pour l'élément
                    title: inputValue, // Titre de l'élément basé sur la valeur du champ de saisie
                    completed: false, // Marquer l'élément comme non complété
                };

                document.getElementById("todo-input").value = ""; // Réinitialiser le champ de saisie

                let { items } = fw.state.getState(); // Obtenir l'état actuel des éléments

                items.push(item); // Ajouter le nouvel élément à la liste des éléments

                fw.state.setState({ items }); // Mettre à jour l'état avec les nouveaux éléments

                fw.events.notify("stateChange"); // Notifier les abonnés que l'état a changé
            }
        },
    }
);
