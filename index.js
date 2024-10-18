const { MongoClient } = require('mongodb');
const fs = require('fs');
const { connectMongo } = require('./databases/mongodb');
const { connectToSQL } = require('./databases/mysql');
const readline = require('readline');

function poserQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    }));
}



async function normalizeMongoData(bddMongo) {
    try {
        const newData = [];

        const liveticketCollection = bddMongo.collection('liveticket');
        const truegisterCollection = bddMongo.collection('truegister');
        const disisfineCollection = bddMongo.collection('disisfine');

        const liveticket = await liveticketCollection.find({}).toArray();
        liveticket.forEach(evenement => {
            newData.push({
                e_name : evenement.event,
                // e_dateCreation : null,
                e_debut : evenement.start,
                e_end : evenement.end,
                e_maxPersonnes : evenement.max,
                e_lieu : evenement.where,
                e_attendees : evenement.attendees.map(attendee => ({
                    a_prenom : attendee.fn,
                    a_nom : attendee.ln,
                    a_inscription : attendee.when
                }))
            });
        });

        const truegister = await truegisterCollection.find({}).toArray();
        truegister.forEach(result =>{
            result.results.forEach(evenement => {
                newData.push({
                    e_name : evenement.event.event_name,
                    // e_dateCreation : null,
                    e_debut : evenement.event.event_begin,
                    e_end : evenement.event.event_finish,
                    e_maxPersonnes : null,
                    e_lieu : evenement.event.event_where,
                    e_attendees : evenement.attendees.map(attendee => ({
                        a_prenom : attendee.attendee_1,
                        a_nom : attendee.attendee_2,
                        a_inscription : null
                    }))
                })
            })
        });

        const disisfine = await disisfineCollection.find({}).toArray();
        disisfine.forEach(evenement => {
            const attendees = JSON.parse(evenement.attendees);
            newData.push({
                e_name : evenement.e_name,
                e_debut : evenement.e_start,
                e_end : evenement.e_finish,
                e_maxPersonnes : evenement.e_attendees_max,
                e_lieu : evenement.e_location,
                e_attendees : attendees.map(attendee => ({
                    a_prenom : attendee[0],
                    a_nom : attendee[1],
                    a_inscription : attendee[2]
                }))
            })
        })
        return newData     
    } catch (error) {
        console.error('Dommage !', error)
    }
}

// Fonction pour ajouter les évènements et les inscriptions de mongodb vers mySQL
async function injectToMySQL(connexion, data) {
    for ( evenement of data ) {
        try {
            // todo - Les autres procédures
            await connexion.execute(
                'CALL creation_evenement(?, ?, ?, ?, ?, ?)',
                [
                    evenement.e_name,
                    new Date(),
                    evenement.e_debut,
                    evenement.e_end,
                    evenement.e_maxPersonnes,
                    evenement.e_lieu
                ]
            );

            const [rows] = await connexion.execute('SELECT LAST_INSERT_ID() AS evenement_id');
            const evenement_id = rows[0].evenement_id;
            for ( const attendee of evenement.e_attendees ) {
                try {
                    await connexion.execute(
                        'CALL inscription(?, ?, ?, ?)',
                        [
                            evenement_id, 
                            attendee.a_prenom,
                            attendee.a_nom,
                            attendee.a_inscription
                        ]
                    )
                } catch (error) {
                    console.error('Problème lors de l\'inscription', error)
                }
            }
            // todo --------------------------
            console.log("Evènements ajoutés")
        } catch (error) {
            console.error('Erreur', error)
        }
    }
}

// Fonction pour supprimer une inscription

async function desinscription(connexion, prenom, nom) {
    try {
        await connexion.execute(
            'CALL desinscription(?, ?)',
            [
                prenom,
                nom
            ]
        )
        console.log(`${prenom} ${nom} est désinscrit`);
    } catch (error) {
        console.error('Erreur desinscription', error);
    }
}

// Fonction pour modifier la date de début et de fin d'un élément selectionné par son id
async function modifyEventDatesById(connexion, eventId, nouveau_debut, nouvelle_fin) {
    try {
        await connexion.execute(
            'CALL modif_dateEvenement(?, ?, ?)',
            [
                eventId,
                nouveau_debut,
                nouvelle_fin
            ]
        );

        console.log(`Les dates de l'événement avec l\'identifiant' ${eventId} ont été modifiées avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de la modification des dates pour l'événement ID ${eventId}:`, error);
    }
}

// Fonction pour supprimer un évènement
async function supprimerEvenement(connexion, evenementId) {
    try {
        await connexion.execute(
            'CALL supp_evenement(?)', 
            [
                evenementId
            ]
        );
        console.log(`L'évènement portant l'identifiant ${evenementId} à bien été supprimé`);
    } catch (error) {
        console.error('Erreur : Un problème est survenu lors de la supp d\'un évènement', error);
    }
}

async function injectSQL() {
    const bddMongo = await connectMongo();
    const connexion = await connectToSQL();
    const parserData = await normalizeMongoData(bddMongo)
    try {
        await injectToMySQL(connexion, parserData)
        console.log('Succès : Les données ont bien été injectées dans la base de données relationnelle.')
    } catch (error) {
        console.log("Erreur d'injection", error)
    } finally {
        process.exit(0);
    }
}

async function desinscrire() {
    const connexion = await connectToSQL();
    try {
        const prenom = await poserQuestion('Entrez le prénom : ');
        const nom = await poserQuestion('Entrez le nom : ');
        await desinscription(connexion, prenom, nom);
        console.log(`Succès : L\'inscription de ${prenom} ${nom} à bien été retirée. `);
    } catch (error) {
        console.error('Erreur : Un problème est survenu lors de la desinscription d\'une personne.', error);
    } finally {
        process.exit(0);
    }
}

async function updateEventDates() {
    const connexion = await connectToSQL();
    try {
        const eventId = await poserQuestion('Entrez l\'identifiant de l\'évènement : ');
        const nouveau_debut = await poserQuestion('Entrez la date de début : ');
        const nouvelle_fin = await poserQuestion('Entrez la date de fin : ');
        await modifyEventDatesById(connexion, eventId, nouveau_debut, nouvelle_fin);
        console.log('Succès : L\'evènement à bien été mis à jour');
    } catch (error) {
        console.error('Erreur : Un problème est survenu lors de la mise à jour d\'un évènement', error);
    } finally {
        process.exit(0);
    }
}

async function deleteEvent() {
    const connexion = await connectToSQL();
    try {
        const evenementId = await poserQuestion('Entrez l\'identifiant de l\'évènement : ');
        await supprimerEvenement(connexion, evenementId);
        console.log('Succès : L\'evènement à bien été retiré');
    } catch (error) {
        console.error('Erreur : Un problème est survenu lors de la suppression d\'un évènement', error);
    } finally {
        process.exit(0);
    }
}

async function selectOptions() {
    const reponse = await poserQuestion('Tapez 1 pour injecter les données mongo dans mySQL \n Tapez 2 pour supprimer une inscription\n Tapez 3 pour modifier les dates de début et fin d\'un évènement\n VOTRE CHOIX :> ');
    if ( reponse === '1' ) {
        injectSQL()
    } else if ( reponse === "2" ) {
        desinscrire()
    } else if ( reponse === "3" ) {
        updateEventDates()
    } else if ( reponse === "4" ) {
        deleteEvent()
    }else {
        console.log("Je ne comprends pas votre choix")
        selectOptions()
    }
}

selectOptions()




// const parserFichiers = () => {

    
//     const liveticket = JSON.parse(fs.readFileSync('./data_json/liveticket.json', 'utf-8'));
//     liveticket.forEach(evenement => {
//         newData.push({
//             e_name : evenement.event,
//             // e_dateCreation : null,
//             e_debut : evenement.start,
//             e_end : evenement.end,
//             e_maxPersonnes : evenement.max,
//             e_lieu : evenement.where,
//             e_attendees : evenement.attendees.map(attendee => ({
//                 a_prenom : attendee.fn,
//                 a_nom : attendee.ln,
//                 a_inscription : attendee.when
//             }))
            
//         });
//     });

//     const truegister = JSON.parse(fs.readFileSync('./data_json/truegister.json', 'utf-8'));
//     truegister.forEach(result =>{
//         result.results.forEach(evenement => {
//             newData.push({
//                 e_name : evenement.event.event_name,
//                 // e_dateCreation : null,
//                 e_debut : evenement.event.event_begin,
//                 e_end : evenement.event.event_finish,
//                 e_maxPersonnes : null,
//                 e_lieu : evenement.event.event_where,
//                 attendees : evenement.attendees.map(attendee => ({
//                     a_prenom : attendee.attendee_1,
//                     a_nom : attendee.attendee_2,
//                     a_inscription : null
//                 }))
//             })
//         })
//     });

//     const disisfine = JSON.parse(fs.readFileSync('./data_json/disisfine.json', 'utf-8'));
//     disisfine.forEach(evenement => {
//         const attendees = JSON.parse(evenement.attendees);
//         newData.push({
//             e_name : evenement.e_name,
//             e_debut : evenement.e_start,
//             e_end : evenement.e_finish,
//             e_maxPersonnes : evenement.e_attendees_max,
//             e_lieu : evenement.e_location,
//             e_attendees : attendees.map(attendee => ({
//                 a_prenom : attendee[0],
//                 a_nom : attendee[1],
//                 a_inscription : attendee[2]
//             }))
//         })
//     })

//     return newData;
// }

// //! 2
// // Générer un nouveau fichier json

// const genererFichierStandard = () => {
//     const file = parserFichiers();

//     fs.writeFileSync('./data_json/fichier_normalise.json', JSON.stringify(file, null, 2));
//     console.log('Fichier généré');
// }

// //! 3
// // Execution du script

// genererFichierStandard();