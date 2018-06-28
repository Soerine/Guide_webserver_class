

function hent_alle_produkter() {

    let kategori_id = getParameterByName('kategori_id');
    let producent_id = getParameterByName('producent_id');
    let vare_id = getParameterByName('vare_id');
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

            let content = document.querySelector('#post_list tbody');
            while (content.hasChildNodes()) {
                content.removeChild(content.firstChild);
            }

            json.forEach(liste => {
                let tr = document.createElement('tr');

                let id = document.createElement('td');
                id.textContent = liste.vare_id;
                id.setAttribute('class', 'id_forside');
                tr.appendChild(id)

                let navn = document.createElement('td');
                navn.textContent = liste.vare_navn;
                tr.appendChild(navn)

                let kategori = document.createElement('td');
                kategori.textContent = liste.kategori_navn;
                tr.appendChild(kategori)

                let producent = document.createElement('td');
                producent.textContent = liste.producent_navn;
                tr.appendChild(producent)

                //RET KNAP
                let ret_td = document.createElement('td');
                let ret_link = document.createElement('a');
                let ret_ikon = document.createElement('i');
                ret_link.setAttribute('class', 'button edit');
                ret_link.setAttribute('href', '?vare_id=' + liste.vare_id)
                ret_ikon.setAttribute('class', 'glyphicon glyphicon-pencil');
                ret_td.setAttribute('class', 'knap ret_knap');


                //SLET KNAP
                let slet = document.createElement('button');
                let slet_td = document.createElement('td');
                let slet_ikon = document.createElement('i');
                slet_ikon.setAttribute('class', 'glyphicon glyphicon-trash');
                slet.setAttribute('class', 'knap slet_knap');
                slet.addEventListener('click', () => {
                    if (confirm('Er du sikker på, at du vil slette denne vare?')) {
                        let submitSettings = {
                            method: 'DELETE',
                            headers: new Headers({
                                'Content-Type': 'application/json',
                                'token': sessionStorage['token']
                            }),
                        }
                        fetch(api_adress + 'vare/' + liste.vare_id, submitSettings)
                            .then(response => {
                                return response.json();
                            })
                            .then(json => {
                                console.log(json);
                                hent_alle_produkter();
                            })
                            .catch(error => {
                                if (error) {
                                    console.log(error);
                                }
                                hent_alle_produkter();
                            })
                    }

                });
                //RET
                tr.appendChild(ret_td);
                ret_td.appendChild(ret_link);
                ret_link.appendChild(ret_ikon);

                //SLET
                slet_td.appendChild(slet);
                slet.appendChild(slet_ikon);
                tr.appendChild(slet_td);

                content.appendChild(tr);

            })


        })
        .catch(function (error) {
            console.log(error);
        });
} hent_alle_produkter()

document.addEventListener('DOMContentLoaded', () => {


    //Dropdown i post: producenter

    fetch(api_adress + 'producenter')
        .then(response => {
            return response.json();
        })
        .then(json => {
            console.log(json)

            let select = document.querySelector('#producent_id');

            while (select.hasChildNodes()) {
                select.removeChild(select.childNodes[0])
            }

            let option = document.createElement('option');

            option.textContent = 'Vælg en producent';
            option.setAttribute('value', 0);
            select.appendChild(option)

            json.forEach(producent => {

                let option = document.createElement('option');
                option.setAttribute('value', producent.producent_id);
                option.textContent = producent.producent_navn;
                select.appendChild(option)
            })
            fetch(api_adress + 'kategorier')
                .then(response => {
                    return response.json();
                })
                .then(json => {
                    console.log(json)

                    let select = document.querySelector('#kategori_id');

                    //Her tømmer vi for data.
                    while (select.hasChildNodes()) {
                        select.removeChild(select.childNodes[0])
                    }

                    let option = document.createElement('option');
                    option.setAttribute('value', 0);
                    option.textContent = 'Vælg en kategori';
                    select.appendChild(option)

                    json.forEach(kategori => {

                        let option = document.createElement('option');
                        option.setAttribute('value', kategori.kategori_id);
                        option.textContent = kategori.kategori_navn;
                        select.appendChild(option)
                    })

                    let vare_id = getParameterByName('vare_id');

                    if (vare_id != undefined) {
                        fetch(api_adress + 'varer/' + vare_id)
                            .then(response => {
                                return response.json()
                            })
                            .then(json => {
                                let produkt_form = document.getElementById('produkt_form');

                                produkt_form.vare_navn.value = json.vare_navn;
                                produkt_form.kategori_id.value = json.kategori_id;
                                produkt_form.producent_id.value = json.producent_id;
                                produkt_form.vare_beskrivelse.value = json.vare_beskrivelse;
                                produkt_form.vare_pris.value = json.vare_pris;
                                produkt_form.gammelt_gemt_billede = json.vare_billede;

                                document.getElementById('gammelt_billede').setAttribute('src', api_adress + 'billeder/resized/' + json.vare_billede)
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    }

                })
        })

    hent_alle_produkter();
});

//Gem knappen
document.getElementById('gem').addEventListener('click', (event) => {
    let form = document.getElementById('produkt_form');

    let vare_navn = form.vare_navn.value;
    let kategori_id = form.kategori_id.value;
    let producent_id = form.producent_id.value;
    let vare_beskrivelse = form.vare_beskrivelse.value;
    let vare_pris = form.vare_pris.value;

    if (vare_navn == '' || kategori_id == 0 || producent_id == 0 || vare_beskrivelse == '' || vare_pris == '') {

        document.getElementById('fejlbesked').textContent = 'Udfyld alle felter'; //tekst sendes til span og vises på siden, hvis felt(erne) ikke er udfyldt.

    } else {
        let data = new FormData(form);
        let vare_id = getParameterByName('vare_id');

        let submitSettings = {
            'method': (vare_id != undefined ? 'put' : 'post'),
            'headers': new Headers({
                'token': sessionStorage['token']
            }),
            'body': data,
            'cache': "no-cache"
        }
        let url = api_adress + 'vare';
        if (vare_id != undefined) {
            url = api_adress + 'vare/' + vare_id
        }
        fetch(url, submitSettings)
            // her kommer resten af fetch.then.catch funktionerne, som vi plejer
            .then(response => {
                //console.log(response);
                hent_alle_produkter(); //når alle kriterier er opfyldte, og posten sendes, skal sidens data reloade, så posten kan ses med det samme.

            })

        form.vare_navn.value = '';
        form.kategori_id.value = 0;
        form.producent_id.value = 0;
        form.vare_beskrivelse.value = '';
        form.vare_pris.value = '';
    }

});

//dropdown kategori knap. 
fetch(api_adress + 'kategorier')
    .then(response => {
        //console.log(response);
        return response.json();
    }).then((json) => {

        let navigation = document.getElementById('kategori'); //kalder navtagget med id'et navigation
        let kategori = getParameterByName('kategori_id'); //her kalder vi id parametrerne 

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

document.querySelector('#logout').addEventListener('click', () => {
    delete (sessionStorage['token']);
    window.location.replace(adress + 'index.html')
})
//LISTE OVER PRODUKTER





