const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');
const path = require('path');
const fs = require('fs');
const login_service = require(path.join(__dirname, '..', 'services', 'login_service.js'));

const gm = require('gm').subClass({
    imageMagick: true
});

module.exports = (app) => {

    app.post('/api/login', (req, res) => {

        //res.sendStatus(204);

        //Array til fejlbeskeder! Som også opstår hvis der mangler input! 
        let fejl_besked = [];

        let bruger_email = req.body.bruger_email;
        if (bruger_email == undefined) {
            fejl_besked.push('Email mangler');

            // } if (!validateEmail(bruger_email)) {
            //     fejl_besked.push("Email er ikke valid")
        }

        let bruger_kodeord = req.body.bruger_kodeord;
        if (bruger_kodeord == undefined) {
            fejl_besked.push('Password mangler');
            // If password is undefined, set it to "" else set it to req.body.pword's value
        }

        if (fejl_besked.length > 0) {
            res.json(400, fejl_besked);

        } else {
            login_service.login(bruger_email, bruger_kodeord).then(rows => {
                if (rows.length == 1) {
                    //I token gemmer vi brugerens id og rolleniveau. 
                    let token = jwt.create({
                        "bruger_id": rows[0].bruger_id,
                        "bruger_rolle_niveau": rows[0].bruger_rolle_niveau
                    });
                    res.json({
                        "token": token
                    });
                } else {
                    res.sendStatus(401);
                }
            }).catch(err => {
                res.status(500).json(err)
                console.log(err)

            })
        }
    });
}