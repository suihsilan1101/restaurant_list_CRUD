//restaurant.js檔案會代表 Restaurant model

//載入 ODM: mongoose 
const mongoose = require('mongoose')

//載入mongoose.Schema 模組 資料庫綱要
const Schema = mongoose.Schema

//定義資料結構
const restaurantSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  }
})

//透過 module.exports 把 Schema 輸出
  //把這份 schema 命名為 Restaurant，在其他的檔案直接使用 Restaurant 就可以操作和「餐廳清單」有關的資料
module.exports = mongoose.model('Restaurant', restaurantSchema)