// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
//載入restaurant list資料
const restList = require('./models/seeds/restaurant.json')
const Restaurant = require('./models/restaurant') //// 載入 restaurant model

// 引用 body-parser
const bodyParser = require('body-parser')

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
// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 路由設定
// index (瀏覽頁)
app.get('/', (req, res) => {
  Restaurant.find()// 取出 Restaurant model 裡的所有資料
    .lean() //// 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(restaurants => res.render('index', { restaurants })) //// 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
  // const restaurants = restList.results
  // res.render('index', { restaurants: restaurants })
})

//new create頁面路由
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

//create功能-接住表單資料，並且把資料送往資料庫。這個步驟就是 CRUD 裡的 Create 動作
app.post('/restaurants', (req, res) => {
  const name = req.body.name // 從 req.body 拿出表單裡的 name 資料
  return Restaurant.create({ name })// 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

//show頁面 設定動態路由
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show',{restaurant}))
    .catch(error => console.log(error))
})

//修改餐廳頁面
app.get('/restaurants/:id/edit', (req,res) =>{
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', {restaurant}))
    .catch(error => console.log(error))
})

//Update 功能：資料庫修改特定 restaurant 的資料
app.post('/restaurants/:id/edit/update', (req,res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = req.body.name
      restaurant.category = req.body.category
      restaurant.image = req.body.image
      restaurant.location = req.body.location
      restaurant.phone = req.body.phone
      restaurant.rating = req.body.rating
      restaurant.google_map = req.body.google_map
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//queryString
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const trimKeyword = keyword.trim().toLowerCase()
  //search by name  name_en or category
  const restaurants = restList.results.filter(restaurant => {
    //包含中文名稱 英文名稱 類別等關鍵字搜尋
    return (
      restaurant.name.toLowerCase().includes(trimKeyword) ||
      restaurant.name_en.toLowerCase().includes(trimKeyword) ||
      restaurant.category.toLowerCase().includes(trimKeyword) 
    )
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

//delete
app.post('/restaueants/:id/delete', (req,res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on localhost:${port}`)
})