export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      // Génère une valeur aléatoire pour chaque occurrence de 0, 1 ou 8 dans le modèle
      (
          c ^ // Opération XOR avec le caractère correspondant
          crypto.getRandomValues(new Uint8Array(1))[0] & 15 // Prend une valeur aléatoire entre 0 et 255 et effectue un ET bit à bit avec 15
          >> c / 4 // Décale la valeur vers la droite en fonction de la position du caractère
      ).toString(16) // Convertit le résultat en une chaîne hexadécimale
  );
}
