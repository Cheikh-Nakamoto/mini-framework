import fw from "../appConfig.js"; // Importer l'instance du framework

// Fonction pour gérer le clic sur le bouton "Clear completed"
const handleClearCompletedClick = () => {
  let { items } = fw.state.getState(); // Récupérer les éléments de l'état

  // Filtrer les éléments pour ne garder que ceux qui ne sont pas complétés
  items = items.filter((item) => !item.completed);

  // Mettre à jour l'état du framework avec les éléments filtrés
  fw.state.setState({ items });

  // Notifier les abonnés de la modification de l'état
  fw.events.notify("stateChange");
};

// Créer un noeud virtuel pour le bouton "Clear completed"
const ClearCompleteButton = fw.dom.createVirtualNode("button", {
  attrs: { class: "clear-completed" }, // Attributs du bouton
  children: ["Clear completed"], // Texte affiché sur le bouton
  listeners: {
    click: handleClearCompletedClick, // Gestionnaire d'événement pour le clic
  },
});

// Fonction pour gérer le clic sur le bouton de suppression
const DeleteButton = (itemId) => {
  // Fonction de gestion du clic sur le bouton
  const handleDeleteClick = (e) => {
    itemId = e.target.dataset.id; // Récupérer l'ID de l'élément à supprimer depuis les données de l'événement
    let { items } = fw.state.getState(); // Récupérer la liste des éléments de l'état

    // Filtrer les éléments pour supprimer celui qui a l'ID correspondant
    items = items.filter((obj) => obj.id !== itemId);

    // Mettre à jour l'état avec la liste d'éléments modifiée
    fw.state.setState({ items });

    // Notifier les abonnés que l'état a changé
    fw.events.notify("stateChange");
  };

  // Créer un noeud virtuel pour le bouton de suppression
  return fw.dom.createVirtualNode("button", {
    attrs: { class: "destroy", "data-id": itemId }, // Attributs du bouton : classe CSS et ID de l'élément à supprimer
    children: [], // Pas de texte ou de contenu à l'intérieur du bouton
    listeners: {
      click: handleDeleteClick, // Gestionnaire d'événement pour le clic, qui appelle la fonction handleDeleteClick
    },
  });
};


// Créer un composant fonctionnel pour la case à cocher
const LiCheckbox = (itemId) => {
  // Fonction gestionnaire d'événement pour le clic sur la case à cocher
  const handleClick = (e) => {
      const clickedId = e.target.dataset.id; // ID de l'élément cliqué
      const checked = e.target.checked; // État de la case (cochée ou non)

      // Obtenir la liste des éléments depuis l'état
      let { items } = fw.state.getState();

      // Mettre à jour l'état de l'élément correspondant
      items.map((item) => {
          if (item.id == clickedId) {
              item.completed = checked; // Mettre à jour l'état de complétion
          }
      });

      // Mettre à jour l'état global avec les nouveaux éléments
      fw.state.setState({ items });

      // Notifier les abonnés que l'état a changé
      fw.events.notify("stateChange");
  };

  // Obtenir les éléments depuis l'état
  let { items } = fw.state.getState();

  // Trouver l'élément correspondant à l'ID fourni
  let result = items.filter((obj) => {
      return obj.id === itemId;
  });

  let item = result[0]; // L'élément trouvé

  // Définir la case à cocher comme un nœud virtuel
  const liCheckbox = fw.dom.createVirtualNode("input", {
      attrs: {
          class: "toggle", // Classe CSS pour la case à cocher
          "data-id": itemId, // ID de l'élément (stocké dans un attribut de données)
          type: "checkbox", // Type d'entrée
          ...(item.completed && { checked: "true" }), // Marquer comme cochée si l'élément est complété
      },
      children: [""], // Aucun enfant pour la case à cocher
      listeners: {
          click: handleClick, // Écouteur d'événement pour le clic
      },
  });

  return liCheckbox; // Retourner le nœud virtuel
};


// Exporter les deux boutons depuis un seul fichier
export { ClearCompleteButton, DeleteButton, LiCheckbox  };
