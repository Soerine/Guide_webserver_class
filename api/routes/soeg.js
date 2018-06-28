
const mysql = require('../config/mysql.js');

module.exports = (app) => {
    app.get('/api/soeg/:soeg', (req, res) => { //:search er et parameter vi opfinder, : gør det til et parameter. Dvs. det kan være "hvad som helst", så her refereres til hvad brugeren har skrevet på siden.
        if (req.params.soeg != '') {
            //opret en variabel med søgeordet hvor der er klistret et % på i begge ender
            //det er denne variabel, der sendes med til SQL udførslen. 
            let fritekst = '%' + req.params.soeg + '%';

            let db = mysql.connect(); //i første sætning SELECT udskrives de navne, som skal bruges til at udskrive blogindlæggende i html'en
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
            WHERE vare_navn LIKE ? || vare_beskrivelse LIKE ?|| producent_navn LIKE ?|| kategori_navn LIKE ?`, [fritekst, fritekst, fritekst, fritekst], (err, rows) => {
                    if (err) {
                        console.log(err.message);
                    }
                    res.json(rows);
                });
            db.end();
        } else {
            // hvis req.params.search er tom, skal der ikke søges, men istedet skal der retuneres en fejlkode 400.
            res.sendStatus(400);
        }
    });

};