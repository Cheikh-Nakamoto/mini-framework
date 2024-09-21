import { zip } from "../state/utils.js";


// Initialisation de l'abstraction du DOM,
// mise en place d'un DOM virtuel.
export default class DOMAbstraction {
    constructor(eventManager) {
        this.virtualTree = null;
        this.eventManager = eventManager;
    }

    /**
     * Crée un noeud virtuel. Le passage des attributs, des enfants ou des écouteurs est facultatif.
     *
     * @param {string} tagName type de noeud
     * @param {object} attrs - attributs du noeud
     * @param {array} children - enfants du noeud
     * @param {object} listeners - écouteurs d'événements du noeud
     * @returns {object} virtualNode
     * @memberof DOMAbstraction
     */
    createVirtualNode(
        tagName,
        { attrs = {}, children = [], listeners = {} } = {}
    ) {
        return {
            tagName,
            attrs,
            children,
            listeners,
            domElement: null, // Référence à l'élément DOM réel
        };
    }

    /**
     * Attache un écouteur d'événement à un noeud virtuel.
     *
     * @param {object} virtualNode
     * @param {string} eventType
     * @param {function} callback
     * @memberof DOMAbstraction
     */
    attachEventListener(virtualNode, eventType, callback) {
        virtualNode.listeners[eventType] = callback;
        this.eventManager.subscribe(eventType, (event) => {
            // Supposons que la propriété domElement contienne
            // l'élément DOM réel correspondant
            if (event.target === virtualNode.domElement) {
                callback(event);
            }
        });
    }

    /**
     * Rendre un élément à partir d'un noeud virtuel.
     *
     * @param {object} virtualNode
     * @returns {object} domElement
     * @memberof DOMAbstraction
     */
    renderElement(virtualNode) {
        let domElement = virtualNode.domElement;
        if (!domElement) {
            domElement = document.createElement(virtualNode.tagName);
            virtualNode.domElement = domElement;
        }
        // Définir les attributs du noeud virtuel sur l'élément DOM réel
        for (let attrName in virtualNode.attrs) {
            domElement.setAttribute(attrName, virtualNode.attrs[attrName]);
        }
        // Rendre et ajouter les enfants à l'élément DOM réel
        for (let child of virtualNode.children) {
            domElement.appendChild(this.render(child));
        }
        // Attacher les écouteurs d'événements
        for (let eventType in virtualNode.listeners) {
            this.attachEventListener(
                virtualNode,
                eventType,
                virtualNode.listeners[eventType]
            );
        }
        return domElement;
    }

    /**
     * Rendre un noeud virtuel. Lorsqu'il est appelé avec une chaîne, il retourne un noeud de texte.
     *
     * @param {object} virtualNode
     * @returns {object} domElement
     * @memberof DOMAbstraction
     */
    render(virtualNode) {
        if (typeof virtualNode === "string") {
            return document.createTextNode(virtualNode);
        }

        return this.renderElement(virtualNode);
    }

    /**
     * Crée une fonction de patch pour mettre à jour les attributs.
     *
     * @param {object} oldAttrs
     * @param {object} newAttrs
     * @returns {function} patch
     * @memberof DOMAbstraction
     */
    diffAttrs(oldAttrs, newAttrs) {
        const patches = [];

        // Définir de nouveaux attributs
        for (const [k, v] of Object.entries(newAttrs)) {
            patches.push(($node) => {
                $node.setAttribute(k, v);
                return $node;
            });
        }

        // Supprimer les anciens attributs
        for (const k in oldAttrs) {
            if (!(k in newAttrs)) {
                patches.push(($node) => {
                    $node.removeAttribute(k);
                    return $node;
                });
            }
        }

        return ($node) => {
            for (const patch of patches) {
                patch($node);
            }
        };
    }

    /**
     * Crée une fonction de patch pour mettre à jour les enfants.
     *
     * @param {array} oldVChildren
     * @param {array} newVChildren
     * @returns {function} patch
     * @memberof DOMAbstraction
     */
    diffChildren(oldVChildren, newVChildren) {
        const childPatches = [];
        for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren)) {
            childPatches.push(this.diff(oldVChild, newVChild));
        }

        const additionalPatches = [];
        // Ajouter les nouveaux enfants
        for (const additionalVChild of newVChildren.slice(
            oldVChildren.length
        )) {
            additionalPatches.push(($node) => {
                $node.appendChild(this.render(additionalVChild));
                return $node;
            });
        }

        return ($parent) => {
            const childNodes = Array.from($parent.childNodes);

            // Appliquer les patches aux enfants existants
            for (const [patch, child] of zip(childPatches, childNodes)) {
                patch(child);
            }

            // Supprimer les enfants supplémentaires
            for (const child of childNodes.slice(childPatches.length)) {
                child.remove();
            }

            // Ajouter les nouveaux enfants
            for (const patch of additionalPatches) {
                patch($parent);
            }

            return $parent;
        };
    }

    /**
     * Crée une fonction de patch pour mettre à jour le noeud.
     *
     * @param {object} vOldNode
     * @param {object} vNewNode
     * @returns {function} patch
     * @memberof DOMAbstraction
     */
    diff(vOldNode, vNewNode) {
        if (vNewNode === undefined) {
            return ($node) => {
                $node.remove();
                return undefined;
            };
        }

        if (typeof vOldNode === "string" || typeof vNewNode === "string") {
            if (vOldNode !== vNewNode) {
                return ($node) => {
                    const $newNode = this.render(vNewNode);
                    $node.replaceWith($newNode);
                    return $newNode;
                };
            } else {
                return ($node) => undefined;
            }
        }

        if (vOldNode.tagName !== vNewNode.tagName) {
            return ($node) => {
                const $newNode = this.render(vNewNode);
                $node.replaceWith($newNode);
                return $newNode;
            };
        }

        const patchAttrs = this.diffAttrs(vOldNode.attrs, vNewNode.attrs);
        const patchChildren = this.diffChildren(
            vOldNode.children,
            vNewNode.children
        );
        const patchListeners = this.diffAttrs(
            vOldNode.listeners,
            vNewNode.listeners
        );

        return ($node) => {
            patchAttrs($node);
            patchChildren($node);
            patchListeners($node);
            return $node;
        };
    }

    /**
     * Monte un noeud virtuel (arbre) sur un noeud DOM.
     *
     * @param {object} $node
     * @param {object} virtualTree
     * @returns {object} $node
     * @memberof DOMAbstraction
     */
    mount($node, virtualTree) {
        this.virtualTree = virtualTree;
        $node.replaceWith(this.render(this.virtualTree));
        return $node;
    }
}
