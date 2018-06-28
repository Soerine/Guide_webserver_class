const express = require('express');
const app = express();

const logger = require('morgan');
app.use(logger('dev')); //Sender besked tilbage til terminalen, hvis nogen benytter min localhost. Den giver også besked om fejl, hvis der bliver skrevet forkert i browseren.


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// dette modul kan benyttes til at håndtere filuploads
const fileupload = require('express-fileupload');
// det er muligt at bestemme hvor store filer der må uploades
app.use(fileupload({
    limits: {
        fileSize: 10 * 1024 * 1024
    } // 10mb
}));


require('./routes/produkter.js')(app);
require('./routes/soeg.js')(app);
require('./routes/beskeder_kopi.js')(app);
require('./routes/billeder.js')(app);
require('./routes/brugere.js')(app);
require('./routes/login.js')(app);
require('./routes/kategorier.js')(app);
require('./routes/producenter.js')(app);



app.use(express.static('public'));//Mappe der serverer statiske filer = Public

const port = 3000;
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('App is listening on http://localhost:3000');
});
