const express = require('express')
const modules = require('./modules.js')
const dotenv = require('dotenv')
const axios = require('axios')
const cheerio = require('cheerio')
const cron = require('node-cron')
const nodemailer = require("nodemailer")
const googleapis = require('googleapis')
const cors = require('cors')
const bodyParser = require('body-parser')
const { oauth2 } = require('googleapis/build/src/apis/oauth2')

dotenv.config()
const app = express()

//initiate mail list and set max num of titles to send
let mailList = [];
const maxTitles = 20;

//Set initial message info
let message = {
	from: 'N12Updater@dontReply.com', // sender address
	to: process.env.USER_EMAIL, // list of receivers
	subject: "Recent news from N12", // Subject line
	text: "the latest of today", // plain text body
	html: "<b>We'll be back soon</b>", // html body
  };

//Set news Site info for scraping
const newsSite = 'https://www.n12.co.il';
const titleRoot = 'ul > li > p > strong > a';

//Gets Oauth2 and credential for sending emails.
const oAuth2Client = new googleapis.Auth.OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

//server functions
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen (process.env.PORT, ()=>{
    console.log(`listening on port ${process.env.PORT}`);
})

// handling input email address from a user
app.post('/getmail', (req,res) =>{
	console.log('got post here', req.body);
	let userMail = req.body.email;
	if(mailList.includes(userMail)){ //true if email already in the mailing list
		res.send({status: 'this email address is already subscribed to N12 Update'});
	} else { // new user email
		mailList.push(userMail);
		getPostTitles()
			// insert the latest titles to message html section
			.then((postTitles) => {
				message.html = modules.createMessage(postTitles)
				message.to = mailList.join(', ')
			}) 
			// send email
			.then(Send()) 
			.catch(console.error);
		res.send({status: 'Thank For Subscribing!'});
	}
})

//scrape news site to an array of objects in the form - [{title:'<>', href:'<>'},...}
const getPostTitles = async () => {
	try {
		const { data } = await axios.get(newsSite);
		// get the news html data
		const $ = cheerio.load(data);
		const postTitles = [];
		// extract single titles from the news site DOM 
		$(titleRoot).each((_idx, el) => {
			const postTitle = {
							title : modules.editString($(el).text()), // gets the title text content
							href : newsSite + $(el).attr('href') // gets the complete href address
						}
			if(postTitles.length <= maxTitles){	// limit num of titles to send
				postTitles.push(postTitle)
			}
		});
		return postTitles;
	} catch (error) {
		throw error;
	}
};

// async..await is not allowed in global scope, must use a wrapper
async function Send() {
	// Generate test SMTP service account from real email account
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

//Schedule sending times
// every sunday at 08:30 AM israel time-zone
cron.schedule('30 8 * * *', () => { 
	getPostTitles()
	.then((postTitles) => message.html = modules.createMessage(postTitles)) 
	.then(Send());
	console.log('sending Titles..');
  }, {
	scheduled: true,
	timezone: "Israel"
  });
	


	

