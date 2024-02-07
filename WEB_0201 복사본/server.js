// server.js
// 서버 실행 -> nodemon server.js

const express = require('express')
const cors = require('cors');               // CORS 처리
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');  // body 파싱
const path = require('path');               // static 폴더 관리
const config = require("./config.json").server;
const pageRouter = require('./route/page/page.js');
const mobileRouter = require('./route/page/mobile/mobile.js');

const app = express()

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }), bodyParser.json({ limit: '10mb' }));
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use('/', pageRouter);
app.use('/mobile', mobileRouter);

app.listen(config.port, () => {
    console.log(`Express Server started ${config.port}`)
})

