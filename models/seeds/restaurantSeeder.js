//seeder 是種子資料產生器

//設定資料庫連線
const mongoose = require('mongoose')
//一併載入 Restaurant model，因為這裡要操作的資料和 Restaurant有關
const Restaurant = require('../restaurant') //載入 Restaurant model
//載入restaurant.json資料 做為種子資料
const restList = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () =>{
  console.log('mongodb error!')
})

db.once('open', () =>{
  console.log('mongodb connected!')
  //成功連線之後匯入資料 restaurant.json種子資料
  for(let i = 0; i < restList.results.length; i++) {
    Restaurant.create(restList.results[i])
  }  
  console.log('done!Add restaurant.json data in database!')
})