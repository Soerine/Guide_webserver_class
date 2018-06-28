const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');
const path = require('path');
const fs = require('fs');
const produkter_service = require(path.join(__dirname, '..', 'services', 'produkter_service.js'));

const gm = require('gm').subClass({
    imageMagick: true
});
module.exports = (app) => {
    //Henter alle varer
    app.get('/api/varer', (req, res) => {
        produkter_service.hent_alle().then(rows => {
            res.json(rows)
        }).catch(err => {
            res.status(500).json(err)
        })

    }); //Hent alle varer, !!SLUT!!

    //Henter en enkelt vare
    app.get('/api/varer/:id', (req, res) => {

        produkter_service.hent_en(req.params.id).then(rows => {
            res.json(rows)
        }).catch(err => {
            res.status(500).json(err)
        })
    });//Hent en enkelt vare, !!SLUT!!

    //Hent de tre nyeste produkter til forsiden
    app.get('/api/varer_forside', (req, res) => {
        produkter_service.hent_tre().then(rows => {
            res.json(rows)
        }).catch(err => {
            res.status(500).json(err)
        })
    }); //Hent varer til forsiden, !!SLUT!!

    //Opret en vare
    app.post('/api/vare', (req, res) => {
        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            let fejl_besked = [];

            let vare_navn = req.body.vare_navn;
            if (vare_navn == undefined) {
                fejl_besked.push('Navn mangler');
            } // If name is undefined, set it to "" else set it to req.body.uname's value

            let kategori_id = req.body.kategori_id;
            if (kategori_id == undefined) {
                fejl_besked.push('Kategori mangler');
            }

            let producent_id = req.body.producent_id;
            if (producent_id == undefined) {
                fejl_besked.push('Producent mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }

            let vare_beskrivelse = req.body.vare_beskrivelse;
            if (vare_beskrivelse == undefined) {
                fejl_besked.push('Beskrivelsen mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }

            let vare_pris = req.body.vare_pris;
            if (vare_pris == undefined) {
                fejl_besked.push('Prisen mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            } if (isNaN(vare_pris)) {
                fejl_besked.push('Prisen er ikke et tal');
            }
            if (fejl_besked.length > 0) {
                res.status(400).json(fejl_besked);
                console.log(fejl_besked)
            } else {

                let vare_billede = req.files.vare_billede; {
                    console.log(vare_billede)
                    if (vare_billede == undefined) {
                        res.sendStatus(400)
                    }
                }
                if ((path.extname(vare_billede.name).toLowerCase() == '.jpg' || path.extname(vare_billede.name).toLowerCase() == '.png')) {

                    let upload_lokation = path.join(__dirname, '..', 'billeder', vare_billede.name);

                    vare_billede.mv(upload_lokation, (err) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            // indsættes INDE i billede.mv() funktionen, istedet for den "normale" resize()
                            let cropped = path.join(__dirname, '..', 'billeder', 'resized', vare_billede.name);
                            gm(upload_lokation).size(function (err, value) {

                                let cropWidth = 400;
                                let cropHeight = 400;
                                // compare width and height, to get orientation
                                if (value.width > value.height) {
                                    // landscape, concentrate on height of image
                                    gm(upload_lokation).resize(null, cropHeight).compose("Copy").gravity("Center").extent(cropWidth, cropHeight).quality(100).write(cropped, function (err) {
                                        if (err) {
                                            throw (err);
                                        }
                                    });
                                } else {
                                    // portrait, only need to resize to width
                                    gm(upload_lokation).resize(cropWidth).compose("Copy").gravity("Center").extent(cropWidth, cropHeight).quality(100).write(cropped, function (err) {
                                        if (err) {
                                            throw (err);
                                        }
                                    });
                                }
                            })
                            produkter_service.opret_en(kategori_id, producent_id, vare_navn, vare_beskrivelse, vare_pris, vare_billede).then(rows => {
                                res.json(rows)
                            }).catch(err => {
                                res.status(500).json(err)
                            })
                        }
                    })
                }
            }

        }
    });//Opret en vare !!SLUT!!

    app.put('/api/varer/:vare_id', (req, res) => {
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403);
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {
            //

            let fejl_besked = [];

            let vare_navn = req.body.vare_navn;
            if (vare_navn == undefined) {
                fejl_besked.push('Navn mangler');
            } // If name is undefined, set it to "" else set it to req.body.uname's value

            let kategori_id = req.body.kategori_id;
            if (kategori_id == undefined) {
                fejl_besked.push('Kategori mangler');
            }

            let producent_id = req.body.producent_id;
            if (producent_id == undefined) {
                fejl_besked.push('Producent mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }

            let vare_beskrivelse = req.body.vare_beskrivelse;
            if (vare_beskrivelse == undefined) {
                fejl_besked.push('Beskrivelsen mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }

            let vare_pris = req.body.vare_pris;
            if (vare_pris == undefined) {
                fejl_besked.push('Pris mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }
            if (isNaN(vare_pris)) {
                fejl_besked.push('Prisen er ikke et tal');
            }
            if (fejl_besked.length > 0) {
                res.status(400).json(fejl_besked);
                console.log(fejl_besked)
            } else {
                produkter_services.ret_en(produkt_navn, producent_id, kategori_id, produkt_beskrivelse, produkt_pris, gammelt_billede, nyt_produkt_billede, req.params.vare_id).then(rows => {
                    res.json(rows);
                }).catch(err => {
                    res.status(500).json(err);
                    console.log(err)
                })

            }

        }


    })
    //Ret en vare
    app.put('/api/vare/:vare_id', (req, res) => {

        // token vil være 'false' hvis der ikke er en token
        let token = jwt.open(req.headers.token);
        if (token === false) {
            res.sendStatus(403); // forbidden
        } else if (token.bruger_rolle_niveau < 100) {
            res.sendStatus(401);
        } else {

            let fejl_besked = [];

            let vare_navn = req.body.vare_navn;
            if (vare_navn == undefined) {
                fejl_besked.push('Navn mangler');
            } // If name is undefined, set it to "" else set it to req.body.uname's value

            let kategori_id = req.body.kategori_id;
            if (kategori_id == undefined) {
                fejl_besked.push('Kategori mangler');
            }

            let producent_id = req.body.producent_id;
            if (producent_id == undefined) {
                fejl_besked.push('Producent mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }

            let vare_beskrivelse = req.body.vare_beskrivelse;
            if (vare_beskrivelse == undefined) {
                fejl_besked.push('Beskrivelsen mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }

            let vare_pris = req.body.vare_pris;
            if (vare_pris == undefined) {
                fejl_besked.push('Pris mangler');
                // If password is undefined, set it to "" else set it to req.body.pword's value
            }
            if (isNaN(vare_pris)) {
                fejl_besked.push('Prisen er ikke et tal');
            }
            if (fejl_besked.length > 0) {
                res.status(400).json(fejl_besked);
                console.log(fejl_besked)
            } else {

                let gammelt_billede = req.body.gammelt_gemt_billede;

                let sql_query = `UPDATE varer SET vare_navn = ?, fk_producent_id = ?, fk_kategori_id = ?, vare_beskrivelse = ?, vare_pris = ?`
                let sql_params = [vare_navn, producent_id, kategori_id, vare_beskrivelse, vare_pris]

                let nyt_vare_billede = req.files.vare_billede;
                let vare_billede = '';
                if (nyt_vare_billede != undefined) {
                    if ((path.extname(nyt_vare_billede.name).toLowerCase() == '.jpg' || path.extname(nyt_vare_billede.name).toLowerCase() == '.png')) {

                        vare_billede = nyt_vare_billede.name;

                        // Her håndteres billederne
                        console.log(gammelt_billede)
                        if (gammelt_billede != ('no_image.png') && (path.extname(gammelt_billede).toLowerCase() == '.jpg' || path.extname(gammelt_billede).toLowerCase() == '.png')) {

                            let file = path.join(__dirname, '..', 'billeder', gammelt_billede);

                            fs.unlink(file, (err) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    let resized = path.join(__dirname, '..', 'billeder', 'resized', gammelt_billede)
                                    fs.unlink(resized, (err) => {
                                        if (err) {
                                            console.log(err)
                                        }
                                    })
                                }
                            })
                        }

                        let upload_location = path.join(__dirname, '..', 'billeder', nyt_vare_billede.name);

                        nyt_vare_billede.mv(upload_location, (err) => {
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                            } else {
                                // indsættes INDE i billede.mv() funktionen, istedet for den "normale" resize() 
                                let cropped = path.join(__dirname, '..', 'billeder', 'resized', nyt_vare_billede.name);
                                gm(upload_location).size(function (err, value) {

                                    let cropWidth = 242;
                                    let cropHeight = 173;
                                    // compare width and height, to get orientation
                                    if (value.width > value.height) {
                                        // landscape, concentrate on height of image
                                        gm(upload_location).resize(null, cropHeight).compose("Copy").gravity("Center").extent(cropWidth, cropHeight).quality(100).write(cropped, function (err) {
                                            if (err) {
                                                throw (err);
                                            }
                                        });
                                    } else {
                                        // portrait, only need to resize to width
                                        gm(upload_location).resize(cropWidth).compose("Copy").gravity("Center").extent(cropWidth, cropHeight).quality(100).write(cropped, function (err) {
                                            if (err) {
                                                throw (err);
                                            }
                                        });
                                    }
                                })
                            }
                        })

                    }

                }
                produkter_service.ret_en(kategori_id, producent_id, vare_navn, vare_beskrivelse, vare_pris, vare_billede, req.params.vare_id).then(rows => {
                    res.json(rows)

                }).catch(err => {
                    res.status(500).json(err)
                    console.log(err)
                })

            }


        }




    })//Ret en vare !!SLUT!!

}//MODULE.EXPORTS SLUT!!