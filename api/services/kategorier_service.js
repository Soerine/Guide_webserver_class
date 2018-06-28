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
            db.execute("SELECT * FROM  kategorier", [], (err, rows) => { //Her connecter vi vores foreignkey med med vores poster database. 
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

    hent_en: (id) => {
        return new Promise((resolve, reject) => {
            if (isNaN(id)) {
                res.sendStatus(400);
            } else {

                let db = mysql.connect();
                db.execute("SELECT * FROM kategorier WHERE kategori_id = ?", [id], (err, rows) => {
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

    opret_en: (navn) => {
        // her benyttes readFile til at læse data fra filen
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute("INSERT INTO kategorier SET kategori_navn=?", [navn], (err, rows) => {
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

    ret_en: (navn, id) => {

        return new Promise((resolve, reject) => {
            // her klares database kaldet 
            let db = mysql.connect();
            db.execute("UPDATE kategorier SET kategori_navn = ? WHERE kategori_id = ?", [navn, id], (err, rows) => {
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

    slet_en: (id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute("DELETE FROM kategorier WHERE kategori_id = ?", [id], (err, rows) => {
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

    hent_alle_i_samme: (id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute(`SELECT 
            vare_id
            , vare_navn
            , vare_beskrivelse
            , vare_pris
            , vare_billede
            , producent_navn
            , kategori_navn
            , producent_id
            , kategori_id
            FROM varer
            INNER JOIN kategorier ON kategori_id = varer.fk_kategori_id 
            INNER JOIN producenter ON producent_id = varer.fk_producent_id
            WHERE kategori_id=?`, [id], (err, rows) => {
                    if (err) {
                        console.log(err.message); //Skrives ud hvis der er fejl
                        reject(err);
                    } else {
                        resolve(rows); //Skrives ud, hvis der ikke er nogen fejl
                    }
                });
            db.end(); //databasen "slukkes"
        })
    }


}; //Module.export SLUT