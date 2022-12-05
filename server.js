const express = require('express')
const dotenv = require('dotenv')
const axios = require('axios')
const cors = require('cors')
const cheerio = require('cheerio')
const app = express()
dotenv.config()
// const knex = require('knex')
// const bodyParser = require('body-parser')

app.set('view engine', 'ejs')
app.use(cors())
// app.use('/',express.static(__dirname + '/public'))
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.listen (process.env.PORT, ()=>{
    console.log(`listening on port ${process.env.PORT}`);
})


// axios
// 	.get('https://www.reddit.com/r/programming.json')
// 	.then((response) => {
// 		console.log(response)
// 	})
// 	.catch((error) => {
// 		console.error(error)
// 	});

const $ = cheerio.load('<h2 class="title">Hello world</h2>')

$('h2.title').text('Hello there!')
$('h2').addClass('welcome')

$.html()
console.log($);