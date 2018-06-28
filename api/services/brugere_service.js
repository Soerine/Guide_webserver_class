const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');
const path = require('path');
const fs = require('fs');
const gm = require('gm').subClass({
    imageMagick: true
});

module.exports = {

    hent_alle: () => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`SELECT 
        bruger_id
        , bruger_navn
        , bruger_email
        , bruger_rolle_niveau
     FROM brugere`, [], (err, rows) => { //Her connecter vi vores foreignkey med med vores poster database. 

                    if (err) {
                        console.log(err); //Skrives ud hvis der er fejl
                        reject(err);
                    } else {
                        resolve(rows); //Skrives ud, hvis der ikke er nogen fejl
                    }
                });
            db.end(); //databasen "slukkes"
        });
    },

    hent_en: (bruger_id) => {
        return new Promise((resolve, reject) => {
            if (isNaN(bruger_id)) {
                res.sendStatus(400);
            } else {
                let db = mysql.connect();
                db.execute(`SELECT 
            bruger_id
            , bruger_navn
            , bruger_email
            , bruger_rolle_niveau
         FROM brugere`, [bruger_id], (err, rows) => {
                        if (err) {
                            console.log(err); //Skrives ud hvis der er fejl
                            reject(err);
                        } else {
                            resolve(rows); //Skrives ud, hvis der ikke er nogen fejl
                        }
                    });
                db.end(); //databasen "slukkes"
            }
        })

    },

    opret_en: (bruger_navn, bruger_email, bruger_rolle_niveau, bruger_kodeord) => {
        // her benyttes readFile til at læse data fra filen
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`INSERT INTO 
            brugere SET 
            bruger_navn=?,
            bruger_email=?,
            bruger_kodeord=?,
            bruger_rolle_niveau=?
            `, [bruger_navn, bruger_email, bruger_kodeord, bruger_rolle_niveau], (err, rows) => {
                    if (err) {
                        console.log(err); //Skrives ud hvis der er fejl
                        reject(err);
                    } else {
                        resolve(rows); //Skrives ud, hvis der ikke er nogen fejl
                    }
                });
            db.end(); //databasen "slukkes"

        });
    },

    ret_en: (bruger_navn, bruger_email, bruger_rolle_niveau, bruger_kodeord, bruger_id) => {

        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(sql_query, sql_params, (err, rows) => {
                if (err) {
                    console.log(err.message); //Skrives ud hvis der er fejl
                    reject(err);
                } else {
                    resolve(rows); //Sender tilbage hvis der ikke er nogen fejl
                }
            });
            db.end(); //databasen "slukkes"
        });
    },

    slet_en: (bruger_id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`DELETE FROM
           brugere WHERE
             bruger_id = ?`, [bruger_id], (err, rows) => {
                    if (err) {
                        console.log(err.message); //Skrives ud hvis der er fejl
                        reject(err);
                    } else {
                        resolve(rows); //Skrives ud, hvis der ikke er nogen fejl
                    }
                });
            db.end(); //databasen "slukkes"
        });

    },


}; //Module.export SLUT