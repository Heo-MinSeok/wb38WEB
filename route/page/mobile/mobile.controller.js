//mobile.cotroller.js
const jwt = require('jsonwebtoken');
const config = require("../../../config.json").jwt;
const cookieJwtAuth = require("../../../middleware/cookieJwtAuth.js");

exports.GetLogin = (req, res) => {
    console.log("GET : /mobile/login");
    res.sendFile(__dirname + "/mobile_login.html");
};

exports.GetLogOut = (req, res) => {
    console.log("GET : /logout")
    res.clearCookie('token');
    res.redirect('/');
};

exports.GetMain = (req, res) => {
    console.log("GET : /mobile/main/" + req.params.stunum);

    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum){
        if(user.stunum == 202403838) 
          res.sendFile(__dirname + "/mobile_main_admin.html");
       else 
          res.sendFile(__dirname + "/mobile_main.html");
      }
     else{
      res.sendFile(__dirname + '/autherr.html');
     }
      
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
};

exports.GetJoin = (req, res) => {
    console.log("GET : /mobile/join")
    res.sendFile(__dirname + "/mobile_join.html");
};

exports.GetEditinfo = (req, res) => {
    console.log("GET : /mobile/main/"+req.params.stunum+"/editinfo")

    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum){
        if(user.stunum == 202403838) 
            res.sendFile(__dirname + "../admin/mobile_editinfo_admin.html");
        else
            res.sendFile(__dirname + "/mobile_editinfo.html");
       }
      else{
        res.sendFile(__dirname + '/autherr.html');
      }
     
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
};

exports.GetCheck = (req, res) => {
    console.log("GET : /mobile/main/"+req.params.stunum+"/check")
    
    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum){
        if(user.stunum == 202403838) 
         res.sendFile(__dirname + "../admin/mobile_check_admin.html");
        else
         res.sendFile(__dirname + "/mobile_check.html");
      }
     else{
      res.sendFile(__dirname + '/autherr.html');
     }
      
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
};

exports.GetAllcheck = (req, res) => {
    console.log("GET : /mobile/main/"+req.params.stunum+"/allcheck")
    
    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum && user.stunum == 202403838){
        res.sendFile(__dirname + "/mobile_allcheck.html");
       }
      else{
        res.sendFile(__dirname + '/autherr.html');
      }
     
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
};

exports.GetFiles = (req, res) => {
    console.log("GET : /mobile/main/"+req.params.stunum+"/files")

    const { token } = req.cookies;
    try {
      const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
      console.log(user);
      if (req.params.stunum == user.stunum){
        if(user.stunum == 202403838) 
        res.sendFile(__dirname + "../admin/mobile_file_admin.html");
       else 
        res.sendFile(__dirname + "/mobile_file.html");
      }
     else{
      res.sendFile(__dirname + '/autherr.html');
     }
      
    } catch (err) {
      console.log(err);
      res.clearCookie('token');
      return res.redirect('/');
    }
};
