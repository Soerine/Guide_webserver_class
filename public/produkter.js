function hent_alle_data() {

    let kategori_id = getParameterByName('kategori_id');
    let producent_id = getParameterByName('producent_id');
    let fetch_url = api_adress + 'varer';
    let soeg = getParameterByName('soeg');


    if (kategori_id != undefined) {
        fetch_url = api_adress + "varer/kategorier/" + kategori_id; //Her siger vi, at hvis kategoriens ID IKKE er undefined, så er det alle poster fra kategorien med det id, som skal vises.
    }

    if (producent_id != undefined) {
        fetch_url = api_adress + "varer/producenter/" + producent_id; //Her siger vi, at hvis brugerens ID IKKE er undefined, så er det alle poster fra brugeren med det id, som skal vises.
    }

    if (soeg != undefined) {
        fetch_url = api_adress + "soeg/" + soeg; //Her siger vi, at hvis brugerens ID IKKE er undefined, så er det alle poster fra brugeren med det id, som skal vises.
    }

    fetch(fetch_url)
        .then(response => {
            //console.log(response);
            return response.json();
        }).then((json) => {

            let produkt_indhold = document.getElementById('produkt_indhold');
            while (produkt_indhold.hasChildNodes()) {
                produkt_indhold.removeChild(produkt_indhold.childNodes[0])
            }

            json.forEach(liste => {
                let li = document.createElement('li');

                let img = document.createElement('img');
                img.setAttribute('src', '/api/billede/' + liste.vare_billede)
                li.appendChild(img);


                let a = document.createElement('a');
                a.setAttribute("href", "produkt.html?vare_id=" + liste.vare_id);
                a.textContent = liste.vare_navn;
                a.setAttribute('class', 'overskrift');
                li.appendChild(a);


                let a2 = document.createElement('a');
                a2.setAttribute("href", "produkt.html?vare_id=" + liste.vare_id);
                a2.textContent = liste.producent_navn;
                a2.setAttribute('class', 'overskrift_to');
                li.appendChild(a2);

                let a3 = document.createElement('a');
                a3.setAttribute("href", "produkt.html?vare_id=" + liste.vare_id);
                a3.textContent = liste.kategori_navn;
                a3.setAttribute('class', 'overskrift_tre');
                li.appendChild(a3);

                let beskrivelse = document.createElement('p');
                beskrivelse.textContent = truncateText(liste.vare_beskrivelse, 60);
                li.appendChild(beskrivelse);

                let pris = document.createElement('h3');
                pris.textContent = liste.vare_pris + ',-/stk';
                li.appendChild(pris);


                produkt_indhold.appendChild(li);
            })


        })
        .catch(function (error) {
            console.log(error);
        });
}
hent_alle_data()

//dropdown kategori knap. 
fetch(api_adress + 'kategorier')
    .then(response => {
        //console.log(response);
        return response.json();
    }).then((json) => {
        let kategori_id = getParameterByName('kategori_id'); //her kalder vi id paramet
        let navigation = document.getElementById('kategori'); //kalder navtagget med id'et navigation

        json.forEach(kategori_nav => {
            let liste_kategori = document.createElement('li'); //variabel med li tag

            let a = document.createElement('a'); //variabel med a tag

            a.setAttribute('href', '?kategori_id=' + kategori_nav.kategori_id)
            a.textContent = kategori_nav.kategori_navn;
            if (kategori == kategori_nav.kategori_id) {

            }
            liste_kategori.appendChild(a);
            navigation.appendChild(liste_kategori)


        })

    });

//dropdown producent knap. 
fetch(api_adress + 'producenter')
    .then(response => {
        //console.log(response);
        return response.json();
    }).then((json) => {

        let navigation = document.getElementById('producent'); //kalder navtagget med id'et navigation
        let producent = getParameterByName('producnt_id'); //her kalder vi id parametrerne 

        json.forEach(producent_nav => {
            let liste_producent = document.createElement('li'); //variabel med li tag

            let a = document.createElement('a'); //variabel med a tag

            a.setAttribute('href', '?producent_id=' + producent_nav.producent_id)
            a.textContent = producent_nav.producent_navn;
            if (producent == producent_nav.producent_id) {

            }
            liste_producent.appendChild(a);
            navigation.appendChild(liste_producent)


        })

    });
hent_alle_data()

