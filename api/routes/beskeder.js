const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');
const path = require('path');
const log_to_file = require(path.join(__dirname, '..', 'modules', 'log_to_file.js'));
const besked_service = require(path.join(__dirname, '..', 'services', 'beskeder.js'));

function validateEmail(bruger_email) {
    var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    return re.test(bruger_email);
    //Denne funktion valdierer emailen. For at sikre, at denne hverken er skrevet forkert, indeholder tegn den ikke må indeholde eller er falsk.
}

module.exports = (app) => {
    app.post('/api/beskeder', (req, res) => {

        let fejl_besked = [];

        let email = req.body.email;
        if (email == undefined) {
            fejl_besked.push('Email mangler...');
        }
        if (!validateEmail(bruger_email)) {
            fejl_besked.push("Email er ikke valid")
        }

        let emne = req.body.emne;
        if (emne == undefined) {
            fejl_besked.push('Emne mangler...');
        }

        let indhold = req.body.indhold;
        if (indhold == undefined) {
            fejl_besked.push('Besked mangler...');
        }

        if (fejl_besked.length > 0) {
            res.status(400).json(fejl_besked);
        } else {
            besked_service.opret_en(id, email, emne, indhold) //opret_en(id, navn, farve) er en funktion vi henter fra services mappen, fra frugter_service.js
                .then(beskeder => {
                    res.json(beskeder);
                }).catch(error => {
                    res.json(error);
                })
        }
    });
}