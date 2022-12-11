let userEmail = {email : ""};
let emailMessage = document.getElementById('emailstat');
const serverAddress = `http://localhost:5000`;//to change if sever address changes 

//handle click on Subscribe
const setEmail = (event) => {
    event.preventDefault();
    const email = document.getElementById('InputEmail')
    setUserEmail(email.value);
}

// Send inserted email adress to the server and get status
async function setUserEmail(emailAddress){
    await fetch(`${serverAddress}/getmail`, {  // env port
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: emailAddress}),
    })
    .then(response => response.json())
    .then(results => {
        console.log('Server sent back', results)
        emailMessage.innerHTML = results.status
    })
    .catch((error) => {
        console.error('Error:', error);
        emailMessage.innerHTML = `couldn't connect to the server, try again later... `
    });
}