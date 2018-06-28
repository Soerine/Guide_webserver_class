const mysql = require('../config/mysql.js');
const jwt = require('../config/jwt.js');
const path = require('path');
const fs = require('fs');
const gm = require('gm').subClass({
    imageMagick: true
});

module.exports = {

    login: (bruger_email, bruger_kodeord) => {
        return new Promise((resolve, reject) => {
            //Hvis både brugernavn og password er sendt med, udføres følgende SQL
            let db = mysql.connect();
            db.execute(`SELECT 
            bruger_id,
            bruger_rolle_niveau
            FROM brugere
            WHERE bruger_email=?
            AND bruger_kodeord=?`, [bruger_email, bruger_kodeord], (err, rows) => { //Jeg henter dataen fra min phpmyadmin, i dette tilfælde fra min brugere API
                    if (err) {
                        console.log(err.message);
                        reject(err, { "message": err.message }); //internal server error
                        console.log(err.message)
                    } else {
                        resolve(rows);
                    }
                });
            db.end();
        });

    },

}
