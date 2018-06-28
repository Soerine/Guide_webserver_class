
document.querySelector('.login').addEventListener('click', (event) => {
    //gem adressen i en variabel, det gør det nemmere at vedligeholde siden, når den er lagt på en server
    // document.getElementById('error').textContent = 'Forkert email eller password..';

    //Her hentes værdier fra inputfelterne
    let email = document.getElementById('admin_email').value;
    let password = document.getElementById('admin_password').value;

    //Her sendes der til severen, hvis altså der er data i begge felter, ellers udskrives en besked
    if (email != "" && password != "") { // Checking if uname or pword is empty
        let fetchSettings = { // Creating variable for POST
            method: 'POST', // Setting method POST
            headers: new Headers({
                'Content-Type': 'application/json' // Setting header type as application/json
            }),
            body: JSON.stringify({ // Using json format
                "bruger_email": email, // Set uname as uname
                "bruger_kodeord": password // Set pword as pword
            })
        };
        fetch(api_adress + "login", fetchSettings) // Fetch api/login with the settings from above
            .then((response) => {
                if (response.status !== 200) { // If status code !== 200
                    throw new Error("Error"); // Throw new error
                } else {
                    return response.json(); // Respond in json format
                }
            })
            .then((json) => {
                sessionStorage['token'] = json.token; // Set sessionStorage['token']
                window.location.replace("http://localhost:3000/admin/panel_forside.html"); // Redirecting user to blog.html
            });
    } else {
        alert("Missing input"); // Alerting user
    }
});




