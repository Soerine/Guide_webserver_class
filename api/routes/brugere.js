const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');
const path = require('path');
const fs = require('fs');
const brugere_service = require(path.join(__dirname, '..', 'services', 'brugere_service.js'));

const gm = require('gm').subClass({
    imageMagick: true
});

function validateEmail(bruger_email) {
    var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return re.test(bruger_email);
    //Denne funktion valdierer emailen. For at sikre, at denne hverken er skrevet forkert, indeholder tegn den ikke må indeholde eller er falsk.
}


module.exports = (app) => {


    //Henter alle brugere
    app.get('/api/brugere', (req, res) => {
        brugere_service.hent_alle().then(rows => {
            res.json(rows)
        }).catch(err => {
            res.status(500).json(err)
        })
    }); //Hent alle brugere, !!SLUT!!

    //Henter én bruger
    app.get('/api/brugere/:bruger_id', (req, res) => {
        brugere_service.hent_en(req.params.bruger_id).then(rows => {
            res.json(rows)
        }).catch(err => {
            res.status(500).json(err)
        })
    }); //Hent én brugere, !!SLUT!!

    //Slet andres brugere, hvis du har bruger rolle niveau over 100.
    app.delete('/api/brugere/:bruger_id', (req, res) => {

        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            // her placeres resten af route-koden
            if (isNaN(req.params.bruger_id)) {
                res.sendStatus(400);
            } else {
                brugere_service.slet_en(bruger_id).then(rows => {
                    res.json(rows)
                }).catch(err => {
                    res.status(500).json(err)
                })
            }
        }

    });//Slet andres bruger !!SLUT!!

    //Rediger en anden brugers profil, hvis du har bruger rolle niveau over 100.
    app.put('/api/brugere/:bruger_id', (req, res) => {
        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            // her placeres resten af route-koden, her henter vi id'et via params,(kolon i appen)
            if (isNaN(req.params.bruger_id)) {
                res.sendStatus(400);
            } else {

                let fejl_besked = [];
                //Start med at validere på din serverside:
                let bruger_navn = req.body.bruger_navn;
                if (bruger_navn == undefined) {
                    fejl_besked.push('Brugernavn mangler');
                } // If name is undefined, set it to "" else set it to req.body.uname's value

                let bruger_email = req.body.bruger_email;
                if (bruger_email == undefined) {
                    fejl_besked.push('Email mangler');

                } if (!validateEmail(bruger_email)) {
                    fejl_besked.push("Email er ikke valid")
                }

                let bruger_kodeord = req.body.bruger_kodeord;
                if (bruger_kodeord == undefined) {
                    bruger_kodeord = '';
                    // If password is undefined, set it to "" else set it to req.body.pword's value
                }
                let bruger_rolle_niveau = req.body.bruger_rolle_niveau;
                if (bruger_rolle_niveau == undefined) {
                    fejl_besked.push('Bruger rolle niveau mangler');
                } // If name is undefined, set it to "" else set it to req.body.uname's value

                if (fejl_besked.length > 0) {
                    res.json(400, fejl_besked);
                } else {
                    let sql_query = `UPDATE 
                brugere SET
                bruger_navn=?,
                bruger_email=?,
                bruger_rolle_niveau=?
                WHERE bruger_id=?`;
                    let sql_params = [bruger_navn, bruger_email, bruger_rolle_niveau, req.params.bruger_id];

                    // her klares database kaldet 
                    if (bruger_kodeord != ''); {
                        sql_query = `UPDATE 
                    brugere SET
                    bruger_navn=?,
                    bruger_email=?,
                    bruger_kodeord=?,
                    bruger_rolle_niveau=?
                    WHERE bruger_id=?`;
                        sql_params = [bruger_navn, bruger_email, bruger_kodeord, bruger_rolle_niveau, req.params.bruger_id];

                    }

                    brugere_service.ret_en(bruger_navn, bruger_email, bruger_rolle_niveau, bruger_kodeord, bruger_id).then(rows => {
                        res.json(rows)
                    }).catch(err => {
                        res.status(500).json(err)
                    })
                }
            }
        }
    }); //Rediger én bruger, !!SLUT!!

    //Opret en bruger med et bestemt bruger rolle niveau.

    app.post('/api/bruger', (req, res) => {

        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            // her placeres resten af route-koden

            // her placeres resten af route-koden
            //Start med at validere på din serverside:
            let fejl_besked = [];

            let bruger_navn = req.body.bruger_navn;
            if (bruger_navn == undefined) {
                fejl_besked.push('Brugernavn mangler');
            } // If name is undefined, set it to "" else set it to req.body.uname's value

            let bruger_email = req.body.bruger_email;
            if (bruger_email == undefined) {
                fejl_besked.push('Email mangler');

            } if (!validateEmail(bruger_email)) {
                fejl_besked.push("Email er ikke valid")
            }

            let bruger_kodeord = req.body.bruger_kodeord;
            if (bruger_kodeord == undefined) {
                fejl_besked.push('Password mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }

            let bruger_rolle_niveau = req.body.bruger_rolle_niveau;
            if (bruger_rolle_niveau == undefined) {
                fejl_besked.push('Bruger rolle niveau mangler');
            } // If name is undefined, set it to "" else set it to req.body.uname's value


            if (fejl_besked.length > 0) {
                res.json(400, fejl_besked);
            } else {
                // her klares database kaldet 

                brugere_service.opret_en(bruger_navn, bruger_email, bruger_rolle_niveau, bruger_kodeord).then(rows => {
                    res.json(rows)
                }).catch(err => {
                    res.status(500).json(err)
                })
            }
        }
    }); //Opret en bruger, !!SLUT!!



}//!!End of Module.Export!!


