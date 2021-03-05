const express = require('express');
const logger = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const postRouter=require('./routes/postsRoutes')
const methodOverride=require('method-override');
const { nextTick } = require("process")


const app = express()
app.set("view engine", "ejs")
app.set('views', 'views');
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  methodOverride((req,res)=>{
    if(req.body && req.body._method){
      const method=req.body._method
      return method;
    }
  })
  
)


app.get("/", (req, res) => {
  res.render("host")
})





app.use("/cohorts",postRouter);


const PORT = process.env.PORT || 3000
const ADDRESS = "localhost" 
const ENVIRONMENT = app.get('env') 

app.listen(PORT, ADDRESS, () => {
  console.log(`Server is listenning on http://${ADDRESS}:${PORT} in ${ENVIRONMENT}.`)
})
