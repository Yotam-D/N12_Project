const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const cors = require('cors')
const cheerio = require('cheerio')
const cron = require('node-cron')
const nodemailer = require('nodemailer');
const app = express()
dotenv.config()
// const knex = require('knex')
// const bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.use(cors())
// app.use('/',express.static(__dirname + '/public'))
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// app.listen (process.env.PORT, ()=>{
//     console.log(`listening on port ${process.env.PORT}`);
// })


const getPostTitles = async () => {
	try {
		const { data } = await axios.get(
			'https://www.n12.co.il/'
		);
        // console.log(data);
		const $ = cheerio.load(data);
		const postTitles = [];

		$('ul > li > p > strong').each((_idx, el) => {
            // console.log(el);
			const postTitle = reverseString($(el).text())
            // const postDate;
			postTitles.push(postTitle)
		});

		return postTitles;
	} catch (error) {
		throw error;
	}
};
getPostTitles()
    .then((postTitles) => console.log(postTitles));

function reverseString(string) {
    return string.split("").reverse().join("").replace(/(\r\n|\n|\r|\t)/gm, "");  //reverses the string, remove string operations
};

let mailOptions = {
	from: 'd.yotam@gmail.com',
	to: 'd.yotam@gmail.com',
	subject: 'Email from Node-App: A Test Message!',
	text: 'Some content to send',
	html: '<b>The html content</b>'
  };
  
  // Mail transport configuration
  let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'd.yotam@gmail.com',
	  pass: process.env.PASS,
	},
	tls: {
	  rejectUnauthorized: false,
	},
  });
  
  // Delivering mail with sendMail method
//   transporter.sendMail(mailOptions, (error, info) => {
// 	if (error) console.log(error);
// 	else console.log('Email sent: ' + info.response);
//   });