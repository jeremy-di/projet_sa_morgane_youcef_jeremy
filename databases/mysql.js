const mysql = require('mysql2/promise');
const dotenv = require('dotenv').config();

async function connectToSQL() {
    try {
        const connexion = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            database: process.env.DATABASE_SQL
        });
        console.log("Connexion à MySQL réussie !");
        return connexion;
    } catch (error) {
        console.error("Erreur lors de la connexion à MySQL : ", error);
        throw error;
    }
}

module.exports = {
    connectToSQL
};