const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');
const path = require('path');
const fs = require('fs');
const kategorier_service = require(path.join(__dirname, '..', 'services', 'kategorier_service.js'));

const gm = require('gm').subClass({
    imageMagick: true
});

module.exports = (app) => {

    //Hent alle kategorier
    app.get('/api/kategorier', (req, res) => {
        kategorier_service.hent_alle().then(rows => {
            res.json(rows)
        }).catch(err => {
            res.status(500).json(err)
        })
    });

    //Hent en kategori
    app.get('/api/kategori/:id', (req, res) => {
        kategorier_service.hent_en(req.params.id).then(rows => {
            res.json(rows)
        }).catch(err => {
            res.status(500).json(err)
        })
    });

    //Opret en kategori
    app.post('/api/kategori', (req, res) => {
        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            let fejl_besked = [];

            let kategori_navn = req.body.kategori_navn;
            if (kategori_navn == undefined) {
                fejl_besked.push('Kategori mangler');
            }

            if (fejl_besked.length > 0) {
                res.json(400, fejl_besked);
            } else {
                kategorier_service.opret_en(kategori_navn).then(rows => {
                    res.json(rows)
                }).catch(err => {
                    res.status(500).json(err)
                })
            }
        }

    });//Opret en kategori !!SLUT!!

    //Rediger en kategori
    app.put('/api/kategori/:kategori_id', (req, res) => {
        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            // her placeres resten af route-koden

            if (isNaN(req.params.kategori_id)) {
                res.sendStatus(400);
            } else {
                let fejl_besked = [];

                let kategori_navn = req.body.kategori_navn;
                if (kategori_navn == undefined) {
                    fejl_besked.push('Kategorifelt skal udfyldes');
                } // If name is undefined, set it to "" else set it to req.body.uname's value

                if (fejl_besked.length > 0) {
                    res.json(400, fejl_besked);

                } else {
                    kategorier_service.ret_en(kategori_navn, req.params.kategori_id).then(rows => {
                        res.json(rows)
                    }).catch(err => {
                        res.status(500).json(err)
                    })
                }
            }
        }

    });//Ret en kategori !!SLUT!!

    //Slet en kategori
    app.delete('/api/kategori/:kategori_id', (req, res) => {
        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            // her placeres resten af route-koden
            if (isNaN(req.params.kategori_id)) {
                res.sendStatus(400);
            } else {
                kategorier_service.slet_en(req.params.kategori_id).then(rows => {
                    res.json(rows)
                }).catch(err => {
                    res.status(500).json(err)
                })
            }

        }
    })//Slet en kategori !!SLUT!!

    //hent alle varer i en bestemt kategori
    app.get('/api/varer/kategorier/:kategori_id', (req, res) => {
        kategorier_service.hent_alle_i_samme(req.params.kategori_id).then(rows => {
            res.json(rows)
        }).catch(err => {
            res.status(500).json(err)
        })
    });

}//MODULE.EXPORTS SLUT!!