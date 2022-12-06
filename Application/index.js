function sendEmail() {
  Email.send({
    SecureToken : "07111beb-29b3-44f9-9a7f-bb7d5d519df3",
    To : 'yot.test@yopmail.com',
    From : "d.yotam@gmail.com",
    Subject : "This is the subject",
    Body : "And this is the body"
}).then(
  message => alert(message)
);
    }