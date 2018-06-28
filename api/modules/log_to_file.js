// referer til NodeJS FileSystem
const fs = require('fs');

// smart lille funktion til dato formattering 
function formatDate(date) {
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

// smart lille funktion til formattering af klokken
function formatTime(date) {
    let hours = ('0' + (date.getHours())).slice(-2);
    let minutes = ('0' + (date.getMinutes())).slice(-2);
    let seconds = ('0' + (date.getSeconds())).slice(-2);
    return `${hours}:${minutes}:${seconds}`;
}

module.exports = {
    // dette er funktionen der kan kaldes udefra via: log-to-file.message('teksten');
    message: (message) => {
        console.log(message);
        // opret et dato objekt til dato og klokkeslet
        let date = new Date();
        // konstruer filnavnet, ud fra stien hvor loggen skal placeres + dagens dato + log.txt
        let file = `api/logs/${formatDate(date)}-log.txt`;
        // åben logfilen, hvis den ikke findes oprettes filen
        fs.open(file, 'a', (err, fd) => {
            // tilføj beskeden til i filen, samt en dato og et klokkeslet.
            fs.writeFile(fd, `${formatDate(date)} ${formatTime(date)} - ${message}\r\n`, (err) => {
                if (err) console.log(err); // denne fejl bliver ikke logget
            })
        })
    }
}; 