import fw from "../appConfig.js"; // Importer l'instance du framework
import { ClearCompleteButton, DeleteButton, LiCheckbox } from "./todoAction.js"; // Importer le bouton de suppression

// Récupérer les éléments de l'état du framework
let { items } = fw.state.getState();

// Fonction pour créer un élément <ul> virtuel
export const Ul = (attrs = {}, children = []) =>
  fw.dom.createVirtualNode("ul", {
    attrs: {
      ...attrs,
    },
    children,
  });

// Fonction pour créer un élément <div> virtuel
const LiDiv = (attrs = {}, children = []) =>
  fw.dom.createVirtualNode("div", {
    attrs: {
      ...attrs,
    },
    children,
  });

// Fonction pour créer un élément <li> virtuel
export const Li = (attrs = {}, children = []) =>
  fw.dom.createVirtualNode("li", {
    attrs: {
      ...attrs,
    },
    children,
  });

// Fonction pour gérer le double-clic sur le label
const handleDoubleClick = (e) => {
  const label = e.target; // Le label cliqué
  label.style.display = "none"; // Cacher le label

  const input = document.createElement("input"); // Créer un nouvel élément input
  input.value = label.textContent; // Remplir l'input avec le texte du label
  input.classList.add("edit"); // Ajouter une classe à l'input

  const liElement = label.closest("li"); // Trouver l'élément <li> contenant le label
  liElement.classList.add("editing"); // Ajouter une classe à l'élément <li>

  liElement.appendChild(input); // Ajouter l'input à l'élément <li>

  input.focus(); // Mettre le focus sur l'input

  let inputReplaced = false;
  let originalText = label.textContent;

  const itemId = label.id;

  const updateItem = (newTitle) => {
    if (newTitle.trim().length >= 2) {
      label.textContent = newTitle;
      items = items.map((item) => {
        if (item.id === itemId) {
          return { ...item, title: newTitle };
        }
        return item;
      });
      fw.state.setState({ items });
    } else {
      label.textContent = originalText;
    }
    label.style.display = "";
    input.remove();
    liElement.classList.remove("editing");
  };

  // Gestion des événements sur l'input
  input.onkeydown = function (event) {
    if (event.key === "Enter" && !inputReplaced) {
      const newTitle = this.value;
      updateItem(newTitle);
      inputReplaced = true;
    }
  };

  input.onblur = function () {
    const newTitle = this.value;
    if (!inputReplaced) {
      updateItem(newTitle);
    }
  };
};

// Fonction pour créer un élément <label> virtuel
const Label = (attrs = {}, children = [], listeners = {}) =>
  fw.dom.createVirtualNode("label", {
    attrs: {
      ...attrs,
    },
    children,
    listeners,
  });

// Fonction pour créer le modèle de liste
const ListTemplate = (arr) =>
  Ul(
    { id: "items", class: "todo-list" },
    arr.map((item) => {
      return Li(
        { id: item.id, class: item.completed ? "completed" : item.class },
        [
          LiDiv({ class: "view" }, [
            LiCheckbox(item.id), // Ajouter la case à cocher
            Label({ id: item.id }, [item.title], {
              dblclick: handleDoubleClick, // Ajouter un gestionnaire d'événement pour le double-clic
            }),
            DeleteButton(item.id), // Ajouter le bouton de suppression
          ]),
        ]
      );
    })
  );

// Fonction pour appliquer les différences au DOM
const DiffApply = (arr) => {
  const newList = ListTemplate(arr);

  // Calculer les différences
  const patch = fw.dom.diff(All, newList);

  // Appliquer les différences pour mettre à jour le DOM réel
  const actualDOMNode = document.getElementById("items");
  patch(actualDOMNode);

  // Mettre à jour les cases à cocher car elles ne sont pas patchées
  let domCheckboxes = document.getElementsByClassName("toggle");
  for (let checkbox of domCheckboxes) {
    let itemId = checkbox.dataset.id;
    let result = arr.filter((obj) => {
      return obj.id === itemId;
    });
    if (result.length === 0) {
      // Ignorer si l'élément n'est pas trouvé (filtré)
      continue;
    }
    let item = result[0];
    checkbox.checked = item.completed;
  }

  // Mettre à jour le noeud virtuel avec les nouvelles valeurs
  All.children = newList.children;
};

// S'abonner aux changements d'état pour mettre à jour la liste
fw.events.subscribe("stateChange", () => {
  let { items: newItems } = fw.state.getState();

  DiffApply(filteredItems(newItems));

  items = newItems;
});

// S'abonner aux changements de route pour mettre à jour la liste
fw.events.subscribe("routeChange", () => {
  let { items } = fw.state.getState();
  
  DiffApply(filteredItems(items));
});

// Fonction pour filtrer les éléments en fonction de la route actuelle
const filteredItems = (items) => {
  let { currentRoute } = fw.state.getState();
  switch (currentRoute.component) {
    case "Active":
      return items.filter((item) => !item.completed);
    case "Completed":
      return items.filter((item) => item.completed);
    default:
      return items;
  }
}

// Créer le modèle de liste initial avec les éléments
export const All = ListTemplate(filteredItems(items));
