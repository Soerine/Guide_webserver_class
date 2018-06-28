const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'data', 'beskeder.js');
module.exports = {


    opret_en: (besked_id, besked_email, besked_emne, besked_indhold) => {
        // her benyttes readFile til at læse data fra filen
        return new Promise((resolve, reject) => {
            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    log_to_file.message(err);
                    reject(err);
                }
                if (data == '' || data == undefined) {
                    data = [];
                } else {
                    data = JSON.parse(data);
                    // hvis data er en tom streng, betyder det at filen er tom
                    // er data undefined, findes filen ikke.
                }
                // push den nye frugt til arrayet
                data.push({ "besked_id": besked_id, "besked_email": besked_email, "besked_emne": besked_emne, "besked_indhold": besked_indhold });

                // gem det ændrede array i filen, husk at Stringify
                // hvis data ikke "stringifies" gemmes [object Object] i stedet
                fs.writeFile(file, JSON.stringify(data), (err) => {
                    if (err) {
                        log_to_file.message(err);
                        reject(err);

                    } else {
                        resolve(data);
                    }
                });
            });

        });
    },




}; //Module.export SLUT