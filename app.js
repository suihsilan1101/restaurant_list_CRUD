// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
//載入restaurant list資料
const restList = require('./models/seeds/restaurant.json')

const app = express()
const port = 3001

//資料庫連線設定
mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true } )

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

//樣版引擎設定
  //新增hbs的樣版引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname:'.hbs' }))
  //掛載hbs在app.js正式啟用
app.set('view engine', 'hbs')
  // setting static files
app.use(express.static('public'))


// 路由設定
//restaurant 首頁路由
app.get('/', (req, res) => {
  const restaurants = restList.results
  res.render('index', { restaurants: restaurants })
})


//打造show頁面 設定動態路由
app.get('/restaurants/:restaurant_id', (req, res) =>{

  const restaurants = restList.results.find( item =>  item.id.toString() === req.params.restaurant_id )

  res.render('show', { restaurant: restaurants })
})

//queryString
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const trimKeyword = keyword.trim().toLowerCase()
  //search by name  name_en or category
  const restaurantsSearch = restList.results.filter(restaurant => {
    //包含中文名稱 英文名稱 類別等關鍵字搜尋
    return (
      restaurant.name.toLowerCase().includes(trimKeyword) ||
      restaurant.name_en.toLowerCase().includes(trimKeyword) ||
      restaurant.category.toLowerCase().includes(trimKeyword) 
    )
  })
  res.render('index', { restaurants: restaurantsSearch, keyword: keyword })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on localhost:${port}`)
})