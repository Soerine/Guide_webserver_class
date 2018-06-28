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


//Her hentes alle posts og vises på den offentlige side igennem html'en
function hent_alle_kategorier() {
    fetch(api_adress + 'kategorier')
        .then(response => {
            //console.log(response);
            return response.json();
        }).then((json) => {



            let content = document.querySelector('#admin_kategori_content tbody');
            while (content.hasChildNodes()) {
                content.removeChild(content.firstChild);
            }

            json.forEach(liste => {
                let tr = document.createElement('tr');

                let id = document.createElement('td');
                id.textContent = liste.kategori_id;
                id.setAttribute('class', 'id_forside');
                tr.appendChild(id)

                let td = document.createElement('td');
                td.textContent = liste.kategori_navn;
                td.setAttribute('class', 'kategori_navn');
                tr.appendChild(td)

                //RET KNAP
                let ret_td = document.createElement('td');
                let ret_link = document.createElement('a');
                let ret_ikon = document.createElement('i');
                ret_link.setAttribute('class', 'button edit');
                ret_link.setAttribute('href', '?kategori_id=' + liste.kategori_id)
                ret_ikon.setAttribute('class', 'glyphicon glyphicon-pencil');
                ret_td.setAttribute('class', 'knap ret_knap');

                //SLET KNAP
                let slet = document.createElement('button');
                let slet_td = document.createElement('td');
                let slet_ikon = document.createElement('i');
                slet_ikon.setAttribute('class', 'glyphicon glyphicon-trash');
                slet.setAttribute('class', 'knap slet_knap');
                slet.addEventListener('click', () => {
                    if (confirm('Er du sikker på, at du vil slette denne kategori?')) {
                        let submitSettings = {
                            method: 'DELETE',
                            headers: new Headers({
                                'Content-Type': 'application/json',
                                'token': sessionStorage['token']
                            }),
                        }
                        fetch(api_adress + 'kategori/' + liste.kategori_id, submitSettings)
                            .then(response => {
                                return response.json();
                            })
                            .then(json => {
                                console.log(json);
                                hent_alle_kategorier();
                            })
                            .catch(error => {
                                if (error) {
                                    console.log(error);
                                }
                                hent_alle_kategorier();
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
} hent_alle_kategorier()

document.addEventListener('DOMContentLoaded', () => {

    let kategori_id = getParameterByName('kategori_id');
    if (kategori_id != undefined) {
        fetch(api_adress + 'kategori/' + kategori_id)
            .then(response => {
                return response.json()
            })
            .then(json => {
                let form = document.getElementById('kategori_form');
                form.kategori_navn.value = json[0].kategori_navn;
            })
            .catch(error => {
                console.log(error);
            })
    }
});

// Her indsættes en klik funktion på send knappen, så der kan postes nye posts direkte fra den offentlige side.

document.querySelector('button.submit').addEventListener('click', (event) => {
    document.getElementById('fejlbesked').textContent = '';
    let form = document.querySelector('#kategori_form');

    let category = form.kategori_navn.value;
    if (category == '') {

        document.getElementById('fejlbesked').textContent = 'Angiv venligst navnet på kategorien...'; //tekst sendes til span og vises på siden, hvis felt(erne) ikke er udfyldt.

    } else {
        let data = new FormData(form);
        let kategori_id = getParameterByName('kategori_id');

        let submitSettings = {
            'method': (kategori_id != undefined ? 'put' : 'post'),
            'headers': new Headers({
                'token': sessionStorage['token']
            }),
            'body': data,
            'cache': "no-cache"
        }
        let url = api_adress + 'kategori';
        if (kategori_id != undefined) {
            url = api_adress + 'kategori/' + kategori_id
        }

        fetch(url, submitSettings)
            // her kommer resten af fetch.then.catch funktionerne, som vi plejer
            .then(response => {
                //console.log(response);
                hent_alle_kategorier(); //når alle kriterier er opfyldte, og posten sendes, skal sidens data reloade, så posten kan ses med det samme.

            })

        form.kategori_navn.value = '';
    }
})

//LOGUT KNAP

document.querySelector('#logout').addEventListener('click', () => {
    delete (sessionStorage['token']);
    window.location.replace(adress + 'index.html')
})