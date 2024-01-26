const jwt = require('jsonwebtoken');
const config = require("../config.json").jwt;

exports.cookieJwtAuth = (req, res, next) => {
  const { token } = req.cookies;
  try {
    const user = jwt.verify(token, config.ACCESS_TOKEN_SECRET); // 검증
    console.log(req.params.stunum + user.stunum);
    req.params.stunum = user.stunum;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.redirect('/');
  }
};