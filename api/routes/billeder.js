const mysql = require('../config/mysql.js');
const path = require('path');
const jwt = require('../config/jwt.js');
const fs = require('fs');
const gm = require('gm').subClass({
    imageMagick: true
});


module.exports = (app) => {
    app.get('/api/billede/:navn', (req, res) => {

        if (path.extname(req.params.name) == '.jpg' || path.extname(req.params.name) == '.png') {

            // forsøg at læs billede filen fra images mappen...
            let file = path.join(__dirname, '..', 'billeder', req.params.navn);
            fs.readFile(file, function (err, file) {
                if (err) {
                    // den ønskede fil blev ikke fundet, vi sender standard "no-image.png" i stedet
                    // dette kunne også have været en res.sendStatus(404)  
                    let no_image = path.join(__dirname, '..', 'billeder', 'no-image.png');
                    fs.readFile(no_image, (err2, default_file) => {
                        res.writeHead(200);
                        res.write(default_file);
                        res.end();
                    });
                } else {
                    // her kunne der skaleres "on-the-fly" ... det tager vi en anden dag
                    res.writeHead(200);
                    res.write(file);
                    res.end();
                }
            });

        } else {
            // sendes no-image som standard eller res.sendStatus(404)
            res.sendStatus(400);
        }
    });


    app.get('/api/billeder/resized/:name', (req, res) => {


        if (path.extname(req.params.name) == '.jpg' || path.extname(req.params.name) == '.png') {

            // forsøg at læs billede filen fra images mappen...
            let file = path.join(__dirname, '..', 'billeder', 'resized', req.params.name);
            fs.readFile(file, function (err, file) {
                if (err) {
                    // den ønskede fil blev ikke fundet, vi sender standard "no-image.png" i stedet
                    // dette kunne også have været en res.sendStatus(404)  
                    let no_image = path.join(__dirname, '..', 'billeder', 'resized', 'no-image.png');
                    fs.readFile(no_image, (err2, default_file) => {
                        res.writeHead(200);
                        res.write(default_file);
                        res.end();
                    });
                } else {
                    // her kunne der skaleres "on-the-fly" ... det tager vi en anden dag
                    res.writeHead(200);
                    res.write(file);
                    res.end();
                }
            });
            // forsøg at læs billede filen fra images mappen...
            // hvis den ønskede fil ikke er en .jpg eller .png, 
            // sendes no-image som standard eller res.sendStatus(404)

        } else {
            res.sendStatus(400);

        }
    });

}//End of module.export
