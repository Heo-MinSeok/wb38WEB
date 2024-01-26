//page.controller.js
const jwt = require('jsonwebtoken');
const config = require("../../config.json").jwt;
const cookieJwtAuth = require("../../middleware/cookieJwtAuth.js");

exports.GetRoot = (req, res) => {
    // User-Agent 헤더에서 모바일 여부를 확인
    const isMobile = /Mobile/i.test(req.headers['user-agent']);

    // 모바일인 경우 모바일 버전 출력, 그렇지 않으면 PC 버전 출력
    const version = isMobile ? 'Mobile' : 'PC';

    if (version == 'Mobile') {
        res.redirect('/mobile/login');
    }
    else {
        res.redirect('/login');
    }
    console.log("GET: / [" + version + "]");
};

exports.GetLogOut = (req, res) => {
  console.log("GET : /logout")
  res.clearCookie('token');
  res.redirect('/');
};

exports.GetLogin = (req, res) => {
    console.log("GET : /login");
    res.sendFile(__dirname + "/pc/login.html");
};

exports.GetMain = (req, res) => {
  console.log("GET : /main/login/" + req.params.stunum);
  const { token } = req.cookies;
  try {
    const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
    console.log(user);
    if (req.params.stunum == user.stunum){
      if(user.stunum == 202403838) 
        res.sendFile(__dirname + "/pc/main_admin.html");
     else 
        res.sendFile(__dirname + "/pc/main.html");
    }
   else{
    res.sendFile(__dirname + '/pc/autherr.html');
   }
    
  } catch (err) {
    console.log(err);
    res.clearCookie('token');
    return res.redirect('/');
  }

};

exports.GetJoin = (req, res) => {
    console.log("GET : /join")
    res.sendFile(__dirname + "/pc/join.html");
};

exports.GetEditinfo = (req, res) => {
    console.log(`GET : /main/${req.params.stunum}/editinfo"`)
    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum){
        res.sendFile(__dirname + '/pc/editinfo.html');
       }
      else{
        res.sendFile(__dirname + '/pc/autherr.html');
      }
   
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
    
};

exports.GetCheck = (req, res) => {
    console.log(`GET: /main/${req.params.stunum}/check`);
    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum){
        res.sendFile(__dirname + '/pc/check.html');
       }
      else{
        res.sendFile(__dirname + '/pc/autherr.html');
      }
     
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
  
};

exports.GetAllcheck = (req, res) => {
    console.log("GET : /main/"+req.params.stunum+"/allcheck")
    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum && user.stunum == 202403838){
        res.sendFile(__dirname + '/pc/allcheck.html');
       }
      else{
        res.sendFile(__dirname + '/pc/autherr.html');
      }
     
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
    
};

exports.GetFiles = (req, res) => {
    console.log("GET : /main/"+req.params.stunum+"/files")

    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum){
        if(user.stunum == 202403838) 
        res.sendFile(__dirname + '/pc/file_admin.html');
       else 
        res.sendFile(__dirname + '/pc/file.html');
      }
     else{
      res.sendFile(__dirname + '/pc/autherr.html');
     }
      
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
    
};