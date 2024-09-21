import fw from "../appConfig.js"; // Importer l'instance du framework
import Input from "./input.js"; // Importer le composant d'entrée (champ de saisie)

// Fonction pour créer un élément <h1> virtuel
const H1 = (attrs = {}, children = []) =>
    fw.dom.createVirtualNode("h1", {
        attrs: {
            ...attrs,
        },
        children,
    });

// Fonction pour créer un élément <header> virtuel
const MyHeader = (attrs = {}, children = []) =>
    fw.dom.createVirtualNode("header", {
        attrs: {
            ...attrs,
        },
        children,
    });

// Exporter le composant Header avec les valeurs définies
// Le Header contient un élément <h1> avec le texte "todos" et le composant d'entrée
export const Header = MyHeader({ class: "header" }, [H1({}, ["todos"]), Input]);
