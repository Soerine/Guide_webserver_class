# Guide_webserver_class
En guide til enten digital ocean

## En Guide til Digital Ocean

## Digital Ocean
* Åben siden digitalocean.com
* Opret en bruger på denne
* Tryk på den grønne knap: 'Create' - 'Droplets'
* Vælg CentOS, og i vores tilfælde vælger vi den nederste på denne liste: 6.9x32.
* Vælg en størrelse, i vores tilfælde bliver det 1gb, da det er den billigste. 
* Vælg et datacenter nær dig, i vores tilfælde bliver det Frankfurt.
* Vælg og skriv et fornuftigt hostnavn
* Tryk create

## PuTTY
* I vores tilfælde benytter vi programmet puTTY
* Download denne fra: http://www.putty.org/

## Droplet til puTTY
* Tryk ind på din nye droplet
* Kopier IP adressen fra højre hjørne, når du holder musen henover, skulle der meget gerne komme en lille, blå skrift frem, hvor der står "copy" - klik på den
* Åben puTTY på din computer
* Indsæt IP adressen i det øverste felt, som skal udfyldes
* Connectiontype: SSH
* Skriv navnet du ønsker i det næste teksfelt og tryk på knappen 'save'
* Luk puTTY og åben denne igen, for at sikre dig, at den er gemt
* Klik herefter på navnet, som du har givet din session og tryk derefter 'open'

## Login
* Åben din mail og åben mailen fra Digital Ocean
* Kopier det password, som er blevet sendt dig
* Skriv brugernavnet: root i poTTY
* Højreklik inde i poTTY og tryk enter, når det er godkendt, så gentag handlingen.
* Angiv nyt password, som du kan huske

## Installation
### Nano
* For at installerer Nano - som er en linux tekst editor, skal du skrive: || yum install nano || Når den bede om et nej eller et ja, skriv || y|| og tryk enter.
### MySQL
* Herefter starter vi MySQL installationen:
* Skriv ||yum install mysql-server|| Når den bede om et nej eller et ja, skriv || y|| og tryk enter.
* For at starte, stoppe eller restarte, kan du skrive: ||service mysqld start|| service mysqld stop || service mysqld restart ||
* For at konfigurerer MySQL skriver du: || sudo /usr/bin/mysql_secure_installation ||
* Tryk enter, når den spørg om password
* Hvis du ønsker at lave et password, så tryk ||y|| og skriv det ønskede password efterfulgt af enter, gentag denne endnu engang.
* Remove anonymous users? tryk ||y||
* Disallow root login remotely? tryk ||n||
* Remove test database and access to it? tryk ||n||
* Reload privilege tables now? tryk ||y||
### Node.js
* For at installere node, skriv først ||yum install epel-release|| tryk ||y||
* Skriv ||yum install nodejs||
* Skriv ||yum install npm|| tryk ||y|| tryk ||y||
* Skriv ||sudo npm config set strict -ssl false||
* Skriv ||yum install -g n||
* Skriv ||n lts||
* Skriv ||n||
* Gå herefter ind på digital ocean igen, og ind på din droplet, tryk herefter på den grønne 'on' knap, for at slukke den. Når den er slukket, så tænd den igen. Altså genstarter du den. 
* Luk din puTTy og åben den igen
### PM2
* Når du har åbnet puTTy og startet den med mysql, skal du skrive: ||npm install -g pm2||
* Skriv ||pm2 startup||
### GIT
* Skriv ||yum install git|| skriv ||y||
* Skriv herefter ||git config --global user.name "Dit navn"
* Skriv så ||git config --global user.email "din@email.dk"
* For at tjekke konfigurationen, skriv ||nano ~/ .gitconfig||
* Tryk shift og x nede for at forlade konfigurationen
* Nu skal vi åbne den offentlige nøgle, skriv: ||nano ~/.ssh/id_rsa.pub|| Kopier indholdet af den offentlige nøgle til GitHub -> Settings -> SSH and GPG keys -> New SSH key
* 






