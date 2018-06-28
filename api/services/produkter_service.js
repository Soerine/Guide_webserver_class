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
            INNER JOIN producenter ON producent_id = varer.fk_producent_id`, [], (err, rows) => { //Her connecter vi vores foreignkey med med vores poster database. 

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
                WHERE vare_id = ?`, [id], (err, rows) => {
                        if (err) {
                            console.log(err); //Skrives ud hvis der er fejl
                            reject(err);
                        } else {
                            resolve(rows[0]); //Skrives ud, hvis der ikke er nogen fejl
                        }
                    });
            }
        })
    },

    hent_tre: () => {
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
        INNER JOIN producenter ON producent_id = varer.fk_producent_id ORDER BY rand() limit 3`, [], (err, rows) => { //Her connecter vi vores foreignkey med med vores poster database. 

                    if (err) {
                        console.log(err); //Skrives ud hvis der er fejl
                        reject(err);
                    } else {
                        resolve(rows); //Skrives ud, hvis der ikke er nogen fejl
                    }
                });
            db.end(); //databasen "slukkes"
        })
    },

    opret_en: (kategori_id, producent_id, vare_navn, vare_beskrivelse, vare_pris, vare_billede) => {

        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute('INSERT INTO varer SET vare_navn = ?, fk_kategori_id = ?, fk_producent_id = ?, vare_beskrivelse = ?, vare_pris = ?, vare_billede = ?'
                , [vare_navn, kategori_id, producent_id, vare_beskrivelse, vare_pris, vare_billede.name], (err, rows) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    } else {
                        resolve(rows)
                        console.log(rows)
                    }

                });
            db.end();
        });
    },

    ret_en: (kategori_id, producent_id, vare_navn, vare_beskrivelse, vare_pris, nyt_vare_billede, vare_id) => {

        return new Promise((resolve, reject) => {

            let sql_query = `UPDATE varer SET vare_navn = ?, fk_producent_id = ?, fk_kategori_id = ?, vare_beskrivelse = ?, vare_pris = ?`
            let sql_params = [vare_navn, producent_id, kategori_id, vare_beskrivelse, vare_pris]

            if (nyt_vare_billede != '') {
                sql_query += ', vare_billede = ?';
                sql_params.push(nyt_vare_billede);
            }

            sql_query += ' WHERE vare_id = ?';
            sql_params.push(vare_id)

            let db = mysql.connect();
            db.execute(sql_query, sql_params, (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {

                    resolve(rows)

                }

            });
            db.end();
        });
    },

    slet_en: (vare_id) => {
        return new Promise((resolve, reject) => {
            let db = mysql.connect();
            db.execute('SELECT vare_billede from varer WHERE vare_id = ?', [vare_id], (err, rows) => {
                if (err) {
                    console.log(err);
                    reject(err)
                } else {
                    let vare_billede = rows[0].vare_billede;

                    if (vare_billede != "no-image.jpg") {
                        let file = path.join(__dirname, '..', 'billeder', vare_billede);

                        fs.unlink(file, (err) => {
                            if (err) {
                                console.log(err);
                            } else {
                                let resized = path.join(__dirname, '..', 'billeder', 'resized', vare_billede)
                                fs.unlink(resized, (err) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                })
                            }
                        })
                    }
                    let db = mysql.connect();
                    db.execute("DELETE from varer WHERE vare_id = ?", [vare_id], (err, rows) => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                    });
                    db.end();
                }
            })
        })
    },




}; //Module.export SLUTs