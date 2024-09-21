import { Footer } from "./core/footer.js";
import { Header } from "./core/header.js";
import {filters, ToDo } from "./core/todoComponent.js";
import fw from "./appConfig.js";

const App = (attrs = {}, children = []) =>
    fw.dom.createVirtualNode("section", {
        attrs: {
            ...attrs, // Fusionne les attributs passés en paramètre
        },
        children, // Ajoute les enfants passés en paramètre
    });

// Configure l'application avec les composants importés
const myApp = App({ id: "app", class: "todoapp" }, [Header, ToDo, Footer]);

// Monte l'application dans le DOM
fw.dom.mount(document.getElementById("app"), myApp);
