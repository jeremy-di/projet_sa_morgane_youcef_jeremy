const { MongoClient } = require('mongodb');
const fs = require('fs');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function injectToMongo() {
    try {
        await client.connect();
        const bddMongo = client.db('projet_lsa_mongo');

        const liveticketCollection = bddMongo.collection('liveticket');
        const truegisterCollection = bddMongo.collection('truegister');
        const disisfineCollection = bddMongo.collection('disisfine');

        const liveticketJson = JSON.parse(fs.readFileSync('./data_json/liveticket.json', 'utf-8'));
        const truegisterJson = JSON.parse(fs.readFileSync('./data_json/truegister.json', 'utf-8'));
        const disisfineJson = JSON.parse(fs.readFileSync('./data_json/disisfine.json', 'utf-8'));

        await liveticketCollection.insertMany(liveticketJson);
        await truegisterCollection.insertMany(truegisterJson);
        await disisfineCollection.insertMany(disisfineJson);
    console.log('Bravo !');
    } catch (error) {
        console.error('Dommage !', error)
    } finally {
        await client.close();
    }
}

injectToMongo().catch(console.dir);


