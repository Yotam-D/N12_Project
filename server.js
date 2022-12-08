const modules = require('./modules.js');
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')
const cron = require('node-cron')
const nodemailer = require("nodemailer");
const googleapis = require('googleapis');
const { oauth2 } = require('googleapis/build/src/apis/oauth2')
dotenv.config()

//Ses initial message info
let message = {
	from: 'N12', // sender address
	to: process.env.USER_EMAIL, // list of receivers
	subject: "Hello ✔", // Subject line
	text: "default text..", // plain text body
	html: "<b>Hello world?</b>", // html body
  };
const newsSite = 'https://www.n12.co.il';

  //Gets Oauth2 and credential for sending emails.
  const oAuth2Client = new googleapis.Auth.OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
  oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

const getPostTitles = async () => {
	try {
		const { data } = await axios.get(newsSite);
        // console.log(data);
		const $ = cheerio.load(data);
		const postTitles = [];

		$('ul > li > p > strong > a').each((_idx, el) => {
            // console.log(el);
			const postTitle = {
							title : modules.editString($(el).text()), // gets the title text content
							href : newsSite + $(el).attr('href') // gets the full address
						}
			postTitles.push(postTitle)
		});
		// console.log(postTitles);
		return postTitles;
	} catch (error) {
		throw error;
	}
};

// async..await is not allowed in global scope, must use a wrapper
async function Send() {
	// Generate test SMTP service account from ethereal.email
	// Only needed if you don't have a real mail account for testing
	let testAccount = await nodemailer.createTestAccount();
	const accessToken = await oAuth2Client.getAccessToken()

	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type:'OAUTH2',
			user: process.env.USER_EMAIL,
			clientId:process.env.CLIENT_ID,
			clientSecret:process.env.CLIENT_SECRET,
			refreshToken:process.env.REFRESH_TOKEN,
			accessToken: accessToken
		},
	});

	// send mail with defined transport object
	let info = await transporter.sendMail(message)
		.then((result) => console.log('email Sent..', result))
		.catch(console.error);
	}
	
	getPostTitles()
    .then((postTitles) => message.html = modules.createMessage(postTitles)) // insert the titles to the message html section
	.then(console.log(message))
	.then(Send()) 
	.catch(console.error);

	

