require('dotenv').config()

const path = require('path')
const express = require('express')
const { config, engine } = require('express-edge')
// const request = require('request')
// const cheerio = require('cheerio')
// const encoding = require('encoding')
const fs = require('fs')
const cors = require('cors')
const restaurant = require('./utils/restu');

const app = express()

config({ cache: process.env.NODE_ENV === 'production' })

// Define paths for Express config
const publicDir = path.join(__dirname, './public')
const viewsDir = path.join(__dirname, './views')

app.use(engine)
app.use(express.static(publicDir))
app.set('views', viewsDir)

app.use(cors())

// endpoints for daily_menu data object
app.get('/menu', function(req, res, next) {
  res.send(data)
})

app.get('/json', function(req, res, next) {
  // save parsed json into file
  let json = JSON.stringify(data, null, 2)
  fs.writeFileSync('parsed-menu.json', json)
  res.sendFile(__dirname + '/parsed-menu.json')
})

app.get('/', function(req, res, next) {
  res.render('index', {
    title: 'lunch api'
  })
})

app.get('/restaurant', (req, res) => {
    if (!req.query.menu) {
    return res.send({
      error: 'You must provide an restaurant ID'
    })
  }

  restaurant(req.query.menu, (error, { menu } = {}) => {
    if (error) {
      return res.send({ error })
    }
    console.log(menu)
    res.send({
      menu,
      restaurant: req.query.restaurant
    })
  })
})


// listening on port from .env
app.listen(process.env.PORT, function() {
  console.log('app listening on port ' + `${process.env.PORT}`)
})