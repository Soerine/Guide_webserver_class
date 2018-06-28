function enkelt_produkt() {

    let vare_id = getParameterByName('vare_id');

    fetch(api_adress + 'varer/' + vare_id)
        .then(response => {
            if (response.status == 200) {
                return response.json()
            } else {
                throw new Error("response not 200")
            }
        })

        .then((json) => {

            let produkt_indhold = document.getElementById('produkt_content');
            while (produkt_indhold.hasChildNodes()) {
                produkt_indhold.removeChild(produkt_indhold.childNodes[0])
            }

            let li = document.createElement('li');

            let img = document.createElement('img');
            img.setAttribute('src', '/api/billede/' + json[0].vare_billede)
            img.setAttribute('class', 'col-md-6 col-sm-12 img_produkt');
            li.appendChild(img);

            let a2 = document.createElement('h2');
            a2.textContent = json[0].producent_navn;
            a2.setAttribute('class', 'producent_navn');
            li.appendChild(a2);

            let a = document.createElement('h1');
            a.textContent = json[0].vare_navn;
            a.setAttribute('class', 'vare_navn');
            li.appendChild(a);

            let a3 = document.createElement('h2');
            a3.textContent = json[0].kategori_navn;
            a3.setAttribute('class', 'kategori_navn');
            li.appendChild(a3);

            let p = document.createElement('p');
            p.textContent = json[0].vare_beskrivelse;
            p.setAttribute('class', 'vare_beskrivelse');
            li.appendChild(p);

            let pris = document.createElement('h3');
            pris.textContent = json[0].vare_pris + ',-/stk';
            pris.setAttribute('class', 'pris');
            li.appendChild(pris);


            produkt_indhold.appendChild(li);
        })

        .catch(function (error) {
            console.log(error);
        });
}
enkelt_produkt()










