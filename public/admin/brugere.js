

function hent_alle_brugere() {

    let kategori_id = getParameterByName('kategori_id');
    let producent_id = getParameterByName('producent_id');
    let bruger_id = getParameterByName('bruger_id');
    let vare_id = getParameterByName('vare_id');
    let fetch_url = api_adress + 'brugere';
    let soeg = getParameterByName('soeg');

    if (bruger_id != undefined) {
        fetch_url = api_adress + "brugere/" + bruger_id;
    }

    fetch(fetch_url)
        .then(response => {
            //console.log(response);
            return response.json();
        }).then((json) => {

            let content = document.querySelector('#bruger_liste tbody');
            while (content.hasChildNodes()) {
                content.removeChild(content.firstChild);
            }

            json.forEach(liste => {
                let tr = document.createElement('tr');

                let id = document.createElement('td');
                id.textContent = liste.bruger_id;
                id.setAttribute('class', 'id_forside');
                tr.appendChild(id)

                let navn = document.createElement('td');
                navn.textContent = liste.bruger_navn;
                tr.appendChild(navn)

                let email = document.createElement('td');
                email.textContent = liste.bruger_email;
                tr.appendChild(email)

                let rolle = document.createElement('td');
                rolle.textContent = liste.bruger_rolle_niveau;
                tr.appendChild(rolle)

                let kodeord = document.createElement('td');
                kodeord.textContent = liste.bruger_kodeord;
                tr.appendChild(kodeord)

                //RET KNAP
                let ret_td = document.createElement('td');
                let ret_link = document.createElement('a');
                let ret_ikon = document.createElement('i');
                ret_link.setAttribute('class', 'button edit');
                ret_link.setAttribute('href', '?bruger_id=' + liste.bruger_id)
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
                        fetch(api_adress + 'brugere/' + liste.bruger_id, submitSettings)
                            .then(response => {
                                return response.json();
                            })
                            .then(json => {
                                console.log(json);
                                hent_alle_brugere();
                            })
                            .catch(error => {
                                if (error) {
                                    console.log(error);
                                }
                                hent_alle_brugere();
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
} hent_alle_brugere()

document.addEventListener('DOMContentLoaded', () => {
    let bruger_id = getParameterByName('bruger_id');
    if (bruger_id != undefined) {
        fetch(api_adress + 'brugere/' + bruger_id)
            .then(response => {
                return response.json()
            })
            .then(json => {
                let form = document.getElementById('bruger_form');
                form.bruger_navn.value = json[0].bruger_navn;
                form.bruger_email.value = json[0].bruger_email;
                form.bruger_kodeord.value = json[0].bruger_kodeord;
                form.bruger_rolle_niveau.value = json[0].bruger_rolle_niveau;
            })
            .catch(error => {
                console.log(error);
            })
    }
});

//Gem knappen
document.getElementById('gem').addEventListener('click', (event) => {
    let form = document.getElementById('bruger_form');

    let bruger_navn = form.bruger_navn.value;
    let bruger_email = form.bruger_email.value;
    let bruger_kodeord = form.bruger_kodeord.value;
    let bruger_rolle_niveau = form.bruger_rolle_niveau.value;

    if (bruger_navn == '' || bruger_email == '' || bruger_kodeord == '' || bruger_rolle_niveau == '') {

        document.getElementById('fejlbesked').textContent = 'Udfyld alle felter'; //tekst sendes til span og vises på siden, hvis felt(erne) ikke er udfyldt.

    } else {
        let data = new FormData(form);
        let bruger_id = getParameterByName('bruger_id');

        let submitSettings = {
            'method': (bruger_id != undefined ? 'put' : 'post'),
            'headers': new Headers({
                'token': sessionStorage['token']
            }),
            'body': data,
            'cache': "no-cache"
        }
        let url = api_adress + 'brugere';
        if (bruger_id != undefined) {
            url = api_adress + 'brugere/' + bruger_id
        }
        fetch(url, submitSettings)
            // her kommer resten af fetch.then.catch funktionerne, som vi plejer
            .then(response => {
                //console.log(response);
                hent_alle_brugere(); //når alle kriterier er opfyldte, og posten sendes, skal sidens data reloade, så posten kan ses med det samme.

            })

        form.bruger_navn.value = '';
        form.bruger_email.value = '';
        form.bruger_kodeord.value = '';
        form.bruger_rolle_niveau.value = '';

    }

});

document.querySelector('#logout').addEventListener('click', () => {
    delete (sessionStorage['token']);
    window.location.replace(adress + 'index.html')
})
//LISTE OVER PRODUKTER





