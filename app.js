// require packages used in the project
const express = require('express')
const app = express()
const port = 3001

// require express-handlebars here
const exphbs = require('express-handlebars')

//載入restaurant list資料
const restaurantList = require('./restaurant.json')
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  const restaurants = restaurantList.results
  res.render('index', { restaurants: restaurants })
})

//打造show頁面 設定動態路由
app.get('/restaurants/:restaurant_id', (req, res) =>{

  const restaurants = restaurantList.results.find( item =>  item.id.toString() === req.params.restaurant_id )

  res.render('show', { restaurant: restaurants })
})

//queryString
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const trimKeyword = keyword.trim().toLowerCase()
  //search by name  name_en or category
  const restaurantsSearch = restaurantList.results.filter(restaurant => {
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
  console.log(`Express is listening on localhost:${port}`)
})