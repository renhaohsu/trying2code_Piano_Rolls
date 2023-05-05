// // 從 secrets拿到值 相當於從.env檔取值
// const PORT = process.env['PORT']

// const express = require('express')

// // express app
// const app = express()

// // routes
// app.get('/', (req, res) => {
//   res.json({mssg: '測測看replit能不能當api server'})
// })

// // listen for requests
// app.listen(PORT, () => {
//   console.log('正在聽 port 4000 =) ')
//   console.log(PORT)
// })



// 從 secrets拿到值 相當於從.env檔取值
const MONGO_URI = process.env['MONGO_URI']
const PORT = process.env['PORT']

const express = require('express')
const mongoose = require('mongoose')
const workourRoutes = require('./routes/workouts')

// express app
const app = express()

// middleware
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/workouts', workourRoutes)

// 連上db
mongoose.connect(MONGO_URI)
  .then(() => {
    // 監聽 requests
    app.listen(PORT, () => {
      console.log('連上db 而且正在聽 PORT', PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })

// 把前端的檔案們 傳給瀏覽器
app.use(express.static('frontend'));
const path = require('path');
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/frontend/index.html'));
})