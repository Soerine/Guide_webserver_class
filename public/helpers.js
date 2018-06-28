const api_adress = 'http://localhost:3000/api/';

const adress = 'http://localhost:3000/';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function truncateText(text, maxLength) {


    if (text.length > maxLength) {
        text = text.substr(0, maxLength) + '...';
    }
    return text;
}

