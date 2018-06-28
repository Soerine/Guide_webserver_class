let producent_id = getParameterByName('producent_id');
let vare_id = getParameterByName('vare_id');
let fetch_url = api_adress + 'varer';
let soeg = getParameterByName('soeg');


if (producent_id != undefined) {
    fetch_url = api_adress + "varer/producenter/" + producent_id; //Her siger vi, at hvis brugerens ID IKKE er undefined, så er det alle poster fra brugeren med det id, som skal vises.
}

if (soeg != undefined) {
    fetch_url = api_adress + "soeg/" + soeg; //Her siger vi, at hvis brugerens ID IKKE er undefined, så er det alle poster fra brugeren med det id, som skal vises.
}

//Her hentes alle posts og vises på den offentlige side igennem html'en
function hent_alle_producenter() {
    fetch(api_adress + 'producenter')
        .then(response => {
            //console.log(response);
            return response.json();
        }).then((json) => {

            let content = document.querySelector('#admin_producent_content tbody');
            while (content.hasChildNodes()) {
                content.removeChild(content.firstChild);

            }

            json.forEach(liste => {
                let tr = document.createElement('tr');

                let id = document.createElement('td');
                id.textContent = liste.producent_id;
                id.setAttribute('class', 'id_forside');
                tr.appendChild(id)

                let td = document.createElement('td');
                td.textContent = liste.producent_navn;
                td.setAttribute('class', 'producent_navn');
                tr.appendChild(td)

                //RET KNAP
                let ret_td = document.createElement('td');
                let ret_link = document.createElement('a');
                let ret_ikon = document.createElement('i');
                ret_link.setAttribute('class', 'button edit');
                ret_link.setAttribute('href', '?producent_id=' + liste.producent_id)
                ret_ikon.setAttribute('class', 'glyphicon glyphicon-pencil');
                ret_td.setAttribute('class', 'knap ret_knap');

                //SLET KNAP
                let slet = document.createElement('button');
                let slet_td = document.createElement('td');
                let slet_ikon = document.createElement('i');
                slet_ikon.setAttribute('class', 'glyphicon glyphicon-trash');
                slet.setAttribute('class', 'knap slet_knap');
                slet.addEventListener('click', () => {
                    if (confirm('Er du sikker på, at du vil slette denne producent?')) {
                        let submitSettings = {
                            method: 'DELETE',
                            headers: new Headers({
                                'Content-Type': 'application/json',
                                'token': sessionStorage['token']
                            }),
                        }
                        fetch(api_adress + 'producenter/' + liste.producent_id, submitSettings)
                            .then(response => {
                                return response.json();
                            })
                            .then(json => {
                                console.log(json);
                                hent_alle_producenter();
                            })
                            .catch(error => {
                                if (error) {
                                    console.log(error);
                                }
                                hent_alle_producenter();
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
}

hent_alle_producenter()


document.addEventListener('DOMContentLoaded', () => {
    ''
    let producent_id = getParameterByName('producent_id');
    if (producent_id != undefined) {
        fetch(api_adress + 'producent/' + producent_id)
            .then(response => {
                return response.json()
            })
            .then(json => {
                let form = document.getElementById('producent_form');
                form.producent_navn.value = json[0].producent_navn;
            })
            .catch(error => {
                console.log(error);
            })
    }
});

// Her indsættes en klik funktion på send knappen, så der kan postes nye posts direkte fra den offentlige side.

document.querySelector('button.submit').addEventListener('click', (event) => {
    document.getElementById('fejlbesked').textContent = '';
    let form = document.querySelector('#producent_form');

    let producent = form.producent_navn.value;
    if (producent == '') {

        document.getElementById('fejlbesked').textContent = 'Angiv venligst navnet på producenten...'; //tekst sendes til span og vises på siden, hvis felt(erne) ikke er udfyldt.

    } else {
        let data = new FormData(form);
        let producent_id = getParameterByName('producent_id');

        let submitSettings = {
            'method': (producent_id != undefined ? 'put' : 'post'),
            'headers': new Headers({
                'token': sessionStorage['token']
            }),
            'body': data,
            'cache': "no-cache"
        }
        let url = api_adress + 'producent';
        if (producent_id != undefined) {
            url = api_adress + 'producent/' + producent_id
        }

        fetch(url, submitSettings)
            // her kommer resten af fetch.then.catch funktionerne, som vi plejer
            .then(response => {
                //console.log(response);
                hent_alle_producenter(); //når alle kriterier er opfyldte, og posten sendes, skal sidens data reloade, så posten kan ses med det samme.

            })

        form.producent_navn.value = '';
    }
})


//LOGOUT KNAP
document.querySelector('#logout').addEventListener('click', () => {
    delete (sessionStorage['token']);
    window.location.replace(adress + 'index.html')
})