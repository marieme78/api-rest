// server.js

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/api-rest')
    .then(() => {
        console.log("Connecté à la base de données MongoDB");
        // Démarrer le serveur Express une fois connecté à la base de données
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => console.error("Erreur de connexion à la base de données MongoDB", err));

// Définition de la route racine
app.get("/", (req, res) => {
    res.send("Welcome to my API Updates");
});

// Définition du schéma utilisateur avec Mongoose
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});
const User = mongoose.model('User', userSchema);

// Route pour renvoyer tous les utilisateurs
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour la création d'un nouvel utilisateur
app.post("/users", async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route pour modifier un utilisateur par son identifiant
app.put("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route pour supprimer un utilisateur par son identifiant
app.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
