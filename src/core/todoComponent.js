import { All } from "./todolist.js";
import fw from "../appConfig.js";
import { Li, Ul } from "./todolist.js"; // Importer les composants Li et Ul

// Composant pour la section principale ToDos
const ToDos = (attrs = {}, children = []) =>
    fw.dom.createVirtualNode("section", {
        attrs: {
            ...attrs,
        },
        children,
    });

// Composant Input pour marquer toutes les tâches comme complétées
const Input = () => {
    const handleClick = (e) => {
        let { items } = fw.state.getState(); // Récupérer les éléments de l'état
        const checked = e.target.checked; // Vérifier si le bouton est coché

        items.map((item) => {
            item.completed = checked; // Marquer tous les éléments comme complétés ou non
        });

        // Mettre à jour toutes les cases à cocher dans le DOM
        let domCheckboxes = document.getElementsByClassName("toggle");
        for (let checkbox of domCheckboxes) {
            checkbox.checked = checked;
        }
        
        // Mettre à jour l'état et notifier les abonnés
        fw.state.setState({ items });
        fw.events.notify("stateChange");
    };

    let { items } = fw.state.getState();
    let allChecked = items.every(obj => obj.completed);

    return fw.dom.createVirtualNode("input", {
        attrs: { id: "toggle-all", class: "toggle-all", type: "checkbox", ...(allChecked && { checked: "true" }) },
        children: [],
        listeners: {
            click: handleClick
        }
    });
};

// Composant pour le Label
const Label = (attrs = {}, children = []) =>
    fw.dom.createVirtualNode("label", {
        attrs: {
            ...attrs,
        },
        children,
    });

// Créer le noeud pour la liste des ToDos avec les contrôles
export const ToDo = ToDos(
    { class: "main" },
    [Input(),
    Label({ for: "toggle-all" }, ["Mark all as complete"]),
        All]
);

// Composant A pour les liens de filtre
const A = (attrs = {}, children = [], listeners = {}) =>
    fw.dom.createVirtualNode("a", {
        attrs: {
            ...attrs,
        },
        children,
        listeners,
    });

// Récupérer les routes définies dans le routeur
const routes = fw.router.routes;

// Fonction pour gérer la sélection du lien de filtre
const handleSelect = (e) => {
    const links = document.querySelectorAll(".filters a"); // Sélectionner tous les liens
    links.forEach((link) => link.classList.remove("selected")); // Retirer 'selected' des autres
    e.target.classList.add("selected"); // Ajouter 'selected' au lien cliqué
};

// Création des liens pour "All", "Active" et "Completed"
const allLink = Li({}, [
    A({ href: "#" + routes[0].path }, [routes[0].component], {
        click: (e) => handleSelect(e),
    }),
]);

const activeLink = Li({}, [
    A({ href: "#" + routes[1].path }, [routes[1].component], {
        click: (e) => handleSelect(e),
    }),
]);

const completedLink = Li({}, [
    A({ href: "#" + routes[2].path }, [routes[2].component], {
        click: (e) => handleSelect(e),
    }),
]);

// Créer une liste non ordonnée (ul) contenant les liens de filtre
export const filters = Ul({ class: "filters" }, [
    allLink,
    activeLink,
    completedLink,
]);
