const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');


module.exports = (app) => {
    //Hent alle producenter 
    app.get('/api/producenter', (req, res) => {
        let db = mysql.connect();
        db.execute("SELECT * FROM  producenter", [], (err, rows) => { //Her connecter vi vores foreignkey med med vores poster database. 
            if (err) {
                console.log(err); //Skrives ud hvis der er fejl
                res.sendStatus(500);
            } else {
                res.json(rows); //Skrives ud, hvis der ikke er nogen fejl
            }
        });
        db.end(); //databasen "slukkes"
    }); //Hent alle producenter !!SLUT!!

    //Hent en producent
    app.get('/api/producent/:id', (req, res) => {
        if (isNaN(req.params.id)) {
            res.sendStatus(400);
        } else {

            let db = mysql.connect();
            db.execute("SELECT * FROM producenter WHERE producent_id = ?", [req.params.id], (err, rows) => {
                if (err) {
                    console.log(err.message); //Skrives ud hvis der er fejl
                    res.sendStatus(500);
                } else {
                    res.json(rows); //Skrives ud, hvis der ikke er nogen fejl
                }
            });
            db.end(); //databasen "slukkes"
        }
    });

    //Opret en producent
    app.post('/api/producent', (req, res) => {
        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            let fejl_besked = [];

            let producent_navn = req.body.producent_navn;
            if (producent_navn == undefined) {
                fejl_besked.push('Producent mangler');
            }

            if (fejl_besked.length > 0) {
                res.json(400, fejl_besked);
            } else {
                // her klares database kaldet 

                let db = mysql.connect();
                db.execute("INSERT INTO producenter SET producent_navn=?", [producent_navn], (err, rows) => {
                    if (err) {
                        console.log(err); //Skrives ud hvis der er fejl
                        res.sendStatus(500);
                    } else {
                        res.json(rows); //Skrives ud, hvis der ikke er nogen fejl
                    }
                });
                db.end(); //databasen "slukkes"
            }

        }
    });//Opret en kategori !!SLUT!!

    //Rediger en producent
    app.put('/api/producent/:producent_id', (req, res) => {

        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            if (isNaN(req.params.producent_id)) {
                res.sendStatus(400);
            } else {
                let fejl_besked = [];

                let producent_navn = req.body.producent_navn;
                if (producent_navn == undefined) {
                    fejl_besked.push('Producent felt skal udfyldes');
                } // If name is undefined, set it to "" else set it to req.body.uname's value

                if (fejl_besked.length > 0) {
                    res.json(400, fejl_besked);

                } else {
                    // her klares database kaldet 
                    let db = mysql.connect();
                    db.execute("UPDATE producenter SET producent_navn = ? WHERE producent_id = ?", [producent_navn, req.params.producent_id], (err, rows) => {
                        if (err) {
                            console.log(err.message); //Skrives ud hvis der er fejl
                            res.sendStatus(500);
                        } else {
                            res.json(rows); //Sender tilbage hvis der ikke er nogen fejl
                        }
                    });
                    db.end(); //databasen "slukkes"
                }
            }
        }

    });//Ret en producent !!SLUT!!

    //Slet en producent
    app.delete('/api/producent/:producent_id', (req, res) => {
        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {

            // her placeres resten af route-koden

            if (isNaN(req.params.producent_id)) {
                res.sendStatus(400);
            } else {

                let db = mysql.connect();
                db.execute("DELETE FROM producenter WHERE producent_id = ?", [req.params.producent_id], (err, rows) => {
                    if (err) {
                        console.log(err.message); //Skrives ud hvis der er fejl
                        res.sendStatus(500);
                    } else {
                        res.json(rows); //Skrives ud, hvis der ikke er nogen fejl
                    }
                });
                db.end(); //databasen "slukkes"
            }
        }
    })//Slet en producent !!SLUT!!

    //Hent alle produkter fra en bestemt producent
    app.get('/api/varer/producenter/:producent_id', (req, res) => {
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
        WHERE producent_id=?`, [req.params.producent_id], (err, rows) => {
                if (err) {
                    console.log(err.message); //Skrives ud hvis der er fejl
                    res.sendStatus(500);
                } else {
                    res.json(rows); //Skrives ud, hvis der ikke er nogen fejl
                }
            });
        db.end(); //databasen "slukkes"
    });

}//MODULE.EXPORTS SLUT!!
