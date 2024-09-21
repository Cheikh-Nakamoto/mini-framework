export const zip = (array1, array2) => {
    const zipped = []; // Initialise un tableau pour stocker les paires
    // Itère jusqu'à la longueur du tableau le plus court
    for (let i = 0; i < Math.min(array1.length, array2.length); i++) {
        zipped.push([array1[i], array2[i]]); // Crée une paire et l'ajoute au tableau zippé
    }
    return zipped; // Retourne le tableau zippé
}