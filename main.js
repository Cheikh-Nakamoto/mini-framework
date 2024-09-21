const http = require('http'); // Module pour créer le serveur HTTP
const fs = require('fs'); // Module pour interagir avec le système de fichiers
const path = require('path'); // Module pour manipuler les chemins de fichiers

// Création du serveur HTTP
const server = http.createServer((req, res) => {
    // Détermine le chemin du fichier en fonction de l'URL de la requête
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath); // Obtient l'extension du fichier
    let contentType = 'text/html'; // Type de contenu par défaut

    // Détermine le type de contenu en fonction de l'extension du fichier
    switch (extname) {
        case '.js':
            contentType = 'text/javascript'; // Type de contenu pour les fichiers JavaScript
            break;
        case '.css':
            contentType = 'text/css'; // Type de contenu pour les fichiers CSS
            break;
    }

    // Lit le fichier demandé
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Fichier non trouvé
                res.writeHead(404); // Définit le code de statut HTTP à 404
                res.end('404 - Fichier Non Trouvé'); // Répond avec un message d'erreur 404
            } else {
                // Erreur serveur
                res.writeHead(500); // Définit le code de statut HTTP à 500
                res.end('500 - Erreur Interne du Serveur'); // Répond avec un message d'erreur 500
            }
        } else {
            // Fichier trouvé et lu avec succès
            res.writeHead(200, { 'Content-Type': contentType }); // Définit le code de statut HTTP à 200 et le type de contenu
            res.end(content, 'utf-8'); // Envoie le contenu du fichier en réponse
        }
    });
});

const port = 2708; // Port sur lequel le serveur écoute
server.listen(port, () => {
    console.log(`Serveur en cours d'exécution à http://localhost:${port}/`); // Affiche un message lorsque le serveur est en cours d'exécution
});
