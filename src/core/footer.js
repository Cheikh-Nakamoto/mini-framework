import fw from "../appConfig.js"; // Importer l'instance du framework
import { filters, ToDo } from "./todoComponent.js"; // Importer le composant de filtres
import { ClearCompleteButton, DeleteButton, LiCheckbox } from "./todoAction.js"; // Importer le bouton pour effacer les éléments complétés

// Récupérer les éléments de l'état actuel
let { items } = fw.state.getState();
let newItemsDone = items.filter((el) => !el.completed); // Filtrer les éléments non complétés

// Fonction pour créer un élément <footer> virtuel
const MyFooter = (attrs = {}, children = []) =>
  fw.dom.createVirtualNode("footer", {
    attrs: {
      ...attrs,
    },
    children,
  });

// Fonction pour créer un élément <span> virtuel
const Span = (attrs = {}, children = [], listeners) =>
  fw.dom.createVirtualNode("span", {
    attrs: {
      ...attrs,
    },
    children,
    listeners,
  });

// Créer un élément <span> pour afficher le nombre d'éléments restants
const itemsToDo = Span({ id: "todo-count", class: "todo-count" }, [
  `Items left: ${newItemsDone.length}`,
]);

// Fonction pour mettre à jour le pied de page lorsque l'état change
function handleStateUpdate() {
  // Souscrire aux changements d'état
  let newState = fw.state.getState();
  let newItems = newState.items;

  // Filtrer les éléments non complétés
  let newItemsDone = newItems.filter((el) => !el.completed);

  // Créer un nouvel élément <span> avec le nombre mis à jour d'éléments restants
  const newItemsToDo = Span({ id: "todo-count", class: "todo-count" }, [
    `Items left: ${newItemsDone.length}`,
  ]);

  // Calculer les différences entre l'ancien et le nouveau contenu
  const patch = fw.dom.diff(itemsToDo, newItemsToDo);

  // Appliquer les différences pour mettre à jour le DOM réel
  const actualDOMNode = document.getElementById("todo-count");
  patch(actualDOMNode);

  // Mettre à jour la variable items et le contenu de l'élément <span> dans le virtual DOM
  items = newItems;
  itemsToDo.children = newItemsToDo.children;

  // Afficher ou cacher le pied de page en fonction du nombre d'éléments
  const footer = document.querySelector(".footer");
  if (newItems.length >= 1) {
    footer.style.display = "block";
  } else {
    footer.style.display = "none";
  }
}

// Souscrire à l'événement "stateChange" pour appeler handleStateUpdate
fw.events.subscribe("stateChange", handleStateUpdate);

// Créer le pied de page avec les éléments suivants : le nombre d'éléments restants, les filtres, et le bouton pour effacer les éléments complétés
export const Footer = (items.length >= 1)
  ? MyFooter({ class: "footer", style: "display: block;" }, [
      itemsToDo,
      filters,
      ClearCompleteButton,
    ])
  : MyFooter({ class: "footer", style: "display: none;" }, [
      itemsToDo,
      filters,
      ClearCompleteButton,
    ]);

    