
function hent_alle_data() {

    let fetch_url = api_adress + 'varer_forside';

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
                a.setAttribute('class', 'overskrift');
                a.textContent = liste.vare_navn + " ";
                li.appendChild(a);

                let beskrivelse = document.createElement('p');
                beskrivelse.textContent = truncateText(liste.vare_beskrivelse, 100);
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

document.querySelector('#kontakt_submit').addEventListener('click', (event) => {
    document.getElementById('fejlbesked').textContent = '';
    let form = document.querySelector('form');
    let Formdata = new FormData(form);

    let email = document.querySelector('#email').value;
    let emne = document.querySelector("#emne").value;
    let indhold = document.querySelector("#indhold").value;

    if (email == '' || emne == '' || indhold == '') {

        document.getElementById('fejlbesked').textContent = 'Udfyld alle felter'; //tekst sendes til span og vises på siden, hvis felt(erne) ikke er udfyldt.

    } else {
        form.email.value = '';
        form.emne.value = '';
        form.indhold.value = '';

        let fetchSettings = {
            method: 'POST',
            body: Formdata,
            cach: "no-cache",

        }

        fetch(api_adress + 'beskeder', fetchSettings)
            // her kommer resten af fetch.then.catch funktionerne, som vi plejer
            .then(response => {
                //console.log(response);
                hent_alle_data(); //når alle kriterier er opfyldte, og posten sendes, skal sidens data reloade, så posten kan ses med det samme.

            })
    }
})


document.querySelector('#kontakt_submit').addEventListener('click', (event) => {
    document.getElementById('fejlbesked').textContent = '';
    let form = document.querySelector('#kontakt');
    let data = new FormData(form);

    if (form.email.value == '' || form.indhold.value == '' || form.emne.value == '') {

        document.getElementById('fejlbesked').textContent = 'Udfyld alle felter'; //tekst sendes til span og vises på siden, hvis felt(erne) ikke er udfyldt.

    } else {
        form.email.value = '';
        form.emne.value = '';
        form.indhold.value = '';

        let fetchSettings = {
            method: 'POST',
            body: data

        }
        fetch(api_adress + 'beskeder', fetchSettings)
            .then(response => {
                return response.json()
            })
            .then(json => {
                console.log(json)
            })
            .catch(error => {
                console.log(error)
            })
    }
})
