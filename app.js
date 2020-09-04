const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000;
const hostname = '127.0.0.1';
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const generateDate = require('./helpers/generateDate').generateDate
const limit = require('./helpers/limit').limit
const wrapText = require("./helpers/wrapText").wrapText
const expressSession = require('express-session')
const connectMongo = require('connect-mongo')
const methodOverride  = require('method-override')



mongoose.connect('mongodb://127.0.0.1/nodeblog_db', {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})

const mongoStore = connectMongo(expressSession)


app.use(expressSession({
    secret:'naberknk',
    resave:false,
    saveUninitialized:true,
    store:new mongoStore({ mongooseConnection:mongoose.connection })
}))




app.use(fileUpload())



app.use(express.static('public'))

app.use(methodOverride('_method'))

const hbs = exphbs.create({
    helpers: {
        generateDate:generateDate,
        limit:limit,
        wrapText:wrapText
    }
})


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({ extended:false }))

app.use(bodyParser.json())

app.use((req, res, next) => {
    const {userId} = req.session
    if (userId) {
        res.locals = {
            displayLink:true
        }

    }
    else {
        res.locals = {
            displayLink: false
        }
    }
    next()
})
app.use((req, res, next) => {
    res.locals.sessionFlash = req.session.sessionFlash
    delete req.session.sessionFlash
    next()
})


const main = require('./routers/main')
const posts = require('./routers/posts')
const users = require('./routers/users')
const admin = require('./routers/admin/index')

app.use('/',main)
app.use('/posts',posts)
app.use('/users',users)
app.use('/admin',admin)


app.listen(port, hostname, () => {
    console.log(`Server Çalışıyor , http://${hostname}:${port}/`)
})
