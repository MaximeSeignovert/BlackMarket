const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs'); // Module pour lire/écrire des fichiers

const app = express();

const swaggerUi = require('swagger-ui-express');
YAML = require('yamljs');
const swaggerDocument = YAML.load('./specification.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));



var port = 3000;

var database = {}
// Charger les produits depuis le fichier JSON
try{
    const data = fs.readFileSync('./database.json','utf-8');
    database = JSON.parse(data);
}catch(e){

}

app.get('/', (req, res) => {
    res.json(database);
});

app.get('/test', (req, res) => {
    res.json({
        message: 'Test route works!',
    });
});

//#region products
app.get('/products', (req, res) => {
  res.json(database.products);
});

app.post('/products', (req, res) => {
    const newProduct = req.body;
    database.products.push(newProduct);

    saveDataToFile("database.json", database);
    res.status(201).json(newProduct);
});

app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    // Recherche le produit dans la liste des produits
    const product = database.products.find((p) => p.id === productId);

    if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.json(product);
});

app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;

    // Recherche l'index du produit dans la liste des produits
    const productIndex = database.products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Met à jour les propriétés du produit avec les nouvelles valeurs
    database.products[productIndex] = { ...database.products[productIndex], ...updatedProduct };

    // Enregistre les modifications dans le fichier JSON
    saveDataToFile("database.json", database);

    res.json({ message: 'Produit mis à jour avec succès', updatedProduct });
});

app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);

    // Recherche l'index du produit dans la liste des produits
    const productIndex = database.products.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Produit non trouvé' });
    }

    // Supprime le produit de la liste
    const deletedProduct = database.products.splice(productIndex, 1)[0];

    // Enregistre les modifications dans le fichier JSON
    saveDataToFile("database.json", database);

    res.json({ message: 'Produit supprimé avec succès', deletedProduct });
});
//#endregion products

//#region Users
app.get('/users', (req, res) => {
    res.json(database.users);
  });

app.post('/users', (req, res) => {
    const newUser = req.body;
    database.users.push(newUser);

    saveDataToFile("database.json", database);
    res.status(201).json(newUser);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    // Recherchez le produit dans la liste des produits
    const user = database.users.find((p) => p.id === userId);

    if (!user) {
    return res.status(404).json({ error: 'User non trouvé' });
    }

    res.json(user);
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUserData = req.body;

    // Recherchez l'utilisateur dans la liste des utilisateurs
    const userIndex = database.users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Mettez à jour les informations de l'utilisateur avec les nouvelles données du corps de la requête
    database.users[userIndex] = { ...database.users[userIndex], ...updatedUserData};

    // Sauvegardez les modifications dans le fichier
    saveDataToFile("database.json", database);

    res.json({ message: 'Utilisateur mis à jour avec succès', updatedUserData });
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);

    // Recherche l'index de l'utilisateur dans la liste des utilisateurs
    const userIndex = database.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Supprime l'utilisateur de la liste
    const deletedUser = database.users.splice(userIndex, 1)[0];

    // Enregistre les modifications dans le fichier JSON
    saveDataToFile("database.json", database);

    res.json({ message: 'Utilisateur supprimé avec succès', deletedUser });
});

app.get('/users/:id/orders', (req, res) => {
    const userId = parseInt(req.params.id);

    // Recherchez les commandes dans la liste des commandes matchant avec l'userId
    const orders = database.orders.filter((ord) => ord.userId === userId);

    if (!orders) {
        return res.status(404).json({ error: 'Aucune commande trouvé' });
    }

    res.json(orders);
});

app.post('/users/:id/orders', (req, res) => {
    const newOrder = req.body;
    newOrder.userId = parseInt(req.params.id);
    
    database.orders.push(newOrder);

    saveDataToFile("database.json", database);
    res.status(201).json(newOrder);
});

app.get('/users/:id/orders/:idOrder', (req, res) => {
    const userId = parseInt(req.params.id);
    const orderId = parseInt(req.params.idOrder);

    // Recherchez la commande dans la liste des commandes matchant avec l'userId
    const order = database.orders.find((ord) => ord.userId === userId && ord.id === orderId);

    if (!order) {
        return res.status(404).json({ error: 'Aucune commande trouvé' });
    }

    res.json(order);
});

app.put('/users/:id/orders/:idOrder', (req, res) => {
    const userId = parseInt(req.params.id);
    const orderId = parseInt(req.params.idOrder);
    const updatedOrderData = req.body;

    const orderIndex = database.orders.findIndex((ord) => ord.userId === userId && ord.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Mettez à jour les informations de la commande avec les nouvelles données du corps de la requête
    database.orders[orderIndex] = { ...database.orders[orderIndex], ...updatedOrderData};

    // Sauvegardez les modifications dans le fichier
    saveDataToFile("database.json", database);

    res.json({ message: 'Commande mise à jour avec succès', updatedOrderData });
});

app.delete('/users/:id/orders/:idOrder', (req, res) => {
    const userId = parseInt(req.params.id);
    const orderId = parseInt(req.params.idOrder);

    const orderIndex = database.orders.findIndex((ord) => ord.userId === userId && ord.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Mettez à jour les informations de la commande avec les nouvelles données du corps de la requête
    const deletedOrder = database.orders.splice(orderIndex, 1)[0];

    // Sauvegardez les modifications dans le fichier
    saveDataToFile("database.json", database);

    res.json({ message: 'Commande supprimée avec succès', deletedOrder });
});
//#endregion

//#region categories
app.get('/categories', (req, res) => {
    res.json(database.categories);
  });

app.post('/categories', (req, res) => {
    const newCategories = req.body;
    database.users.push(newCategories);

    saveDataToFile("database.json", database);
    res.status(201).json(newCategories);
});

app.get('/categories/:id', (req, res) => {
    const categorieId = parseInt(req.params.id);

    // Recherchez le produit dans la liste des produits
    const categorie = database.categories.find((p) => p.id === categorieId);

    if (!categorie) {
    return res.status(404).json({ error: 'Catégorie non trouvé' });
    }

    res.json(categorie);
});


app.put('/categories/:id', (req, res) => {
    const categorieId = parseInt(req.params.id);
    const updatedCategorie = req.body;

    // Recherchez la catégorie dans la liste des catégories
    const categorieIndex = database.categories.findIndex((cat) => cat.id === categorieId);

    if (categorieIndex === -1) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    // Mettez à jour les informations de la catégorie avec les nouvelles données du corps de la requête
    database.categories[categorieIndex] = { ...database.categories[categorieIndex], ...updatedCategorie};

    // Sauvegardez les modifications dans le fichier
    saveDataToFile("database.json", database);

    res.json({ message: 'Catégorie mise à jour avec succès', updatedCategorie });
});

app.delete('/categories/:id', (req, res) => {
    const categorieId = parseInt(req.params.id);

    // Recherche l'index de la catégorie dans la liste des catégories
    const categorieIndex = database.categories.findIndex((cat) => cat.id === categorieId);

    if (categorieIndex === -1) {
        return res.status(404).json({ error: 'Catégorie non trouvée' });
    }

    // Supprime la catégorie de la liste
    const deletedCategorie = database.categories.splice(categorieIndex, 1)[0];

    // Enregistre les modifications dans le fichier JSON
    saveDataToFile("database.json", database);

    res.json({ message: 'Catégorie supprimée avec succès',deletedCategorie });
});

app.get('/categories/:id/products', (req, res) => {
    const categorieId = parseInt(req.params.id);

    // Recherchez le produit dans la liste des produits
    const products = database.products.filter((p) => p.categoryId === categorieId);

    if (!products) {
    return res.status(404).json({ error: 'Aucun produits trouvé' });
    }

    res.json(products);
});

app.post('/categories/:id/products', (req, res) => {
    const newProduct = req.body;
    newProduct.categoryId = parseInt(req.params.id);
    
    database.products.push(newProduct);

    saveDataToFile("database.json", database);
    res.status(201).json(newProduct);
});

app.get('/categories/:id/products/:idProduct', (req, res) => {
    const categorieId = parseInt(req.params.id);
    const productId = parseInt(req.params.idProduct);

    // Recherchez le produit dans la liste des produits de la catégorie
    const product = database.products.find((p) => p.categoryId === categorieId && p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Aucun produit trouvé' });
    }

    res.json(product);
});

app.put('/categories/:id/products/:idProduct', (req, res) => {
    const categorieId = parseInt(req.params.id);
    const productId = parseInt(req.params.idProduct);
    const updatedProductData = req.body;

    const productIndex = database.products.findIndex((p) => p.categoryId === categorieId && p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Produit non trouvée' });
    }

    // Mettez à jour les informations du produit avec les nouvelles données du corps de la requête
    database.products[productIndex] = { ...database.products[productIndex], ...updatedProductData};

    // Sauvegardez les modifications dans le fichier
    saveDataToFile("database.json", database);

    res.json({ message: 'Produits mis à jour avec succès', updatedProductData });
});

app.delete('/categories/:id/products/:idProduct', (req, res) => {
    const categorieId = parseInt(req.params.id);
    const productId = parseInt(req.params.idProduct);

    const productIndex = database.products.findIndex((p) => p.categoryId === categorieId && p.id === productId);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Produit non trouvée' });
    }

    const deletedProduct = database.products.splice(productIndex, 1)[0];

    // Sauvegardez les modifications dans le fichier
    saveDataToFile("database.json", database);

    res.json({ message: 'Produit supprimée avec succès', deletedProduct });
});
//#endregion categories

//#region orders
app.get('/orders', (req, res) => {
    res.json(database.orders);
  });

app.post('/orders', (req, res) => {
    const newOrder = req.body;
    database.orders.push(newOrder);

    saveDataToFile("database.json", database);
    res.status(201).json(newOrder);
});

app.get('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);

    // Recherchez le produit dans la liste des produits
    const order = database.orders.find((p) => p.id === orderId);

    if (!order) {
    return res.status(404).json({ error: 'Order non trouvé' });
    }

    res.json(order);
});

app.put('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const updatedOrder = req.body;

    // Recherchez la commande dans la liste des commandes
    const orderIndex = database.orders.findIndex((ord) => ord.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Mettez à jour les informations de la commande avec les nouvelles données du corps de la requête
    database.orders[orderIndex] = { ...database.orders[orderIndex], ...updatedOrder};

    // Sauvegardez les modifications dans le fichier
    saveDataToFile("database.json", database);

    res.json({ message: 'Commande mise à jour avec succès', updatedOrder });
});

app.delete('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);

    // Recherche l'index de la commande dans la liste des commandes
    const orderIndex = database.orders.findIndex((ord) => ord.id === orderId);

    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Supprime la commande de la liste
    const deletedOrder = database.orders.splice(orderIndex, 1)[0];

    // Enregistre les modifications dans le fichier JSON
    saveDataToFile("database.json", database);

    res.json({ message: 'Commande supprimée avec succès', deletedOrder });
});
//#endregion

//#region reviews
app.get('/reviews', (req, res) => {
    res.json(database.reviews);
  });

app.post('/reviews', (req, res) => {
    const newReview = req.body;
    database.orders.push(newReview);

    saveDataToFile("database.json", database);
    res.status(201).json(newReview);
});

app.get('/reviews/:id', (req, res) => {
    const reviewId = parseInt(req.params.id);

    // Recherchez le produit dans la liste des produits
    const review = database.reviews.find((p) => p.id === reviewId);

    if (!review) {
    return res.status(404).json({ error: 'Review non trouvé' });
    }

    res.json(review);
    });
//#endregion

app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
  });
  
// Fonction utilitaire pour enregistrer des données dans un fichier JSON
function saveDataToFile(filename, data) {
    try {
        fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("Error writing to ${filename}:", err.message);
    }
}
