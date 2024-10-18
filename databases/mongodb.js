const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();

const url = process.env.URL;
const client = new MongoClient(url);

async function connectMongo() {
    try {
        await client.connect();
        console.log("Connexion à MongoDB réussie !");
        return client.db(process.env.DATABASE_MONGO);
    } catch (error) {
        console.error("Erreur lors de la connexion à MongoDB : ", error);
        throw error;
    }
}

module.exports = {
    connectMongo
};