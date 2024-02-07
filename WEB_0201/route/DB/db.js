//db.js

const config = require("../../config.json");
const jwt = require("jsonwebtoken");
const mariadb = require('mariadb')

const pool = mariadb.createPool({
    host: config.db_server.host,
    user: config.db_server.user,
    password: config.db_server.password,
    database: config.db_server.database,
    dateStrings: config.db_server.dateStrings,
    connectionLimit: config.db_server.connectionLimit
});


exports.Login =  async (req, res) => {
    console.log("POST : Login");
    const conn = await pool.getConnection();
    try {
        const { id, pw } = req.body;

        console.log("쿼리작업중...");
        const rows = await conn.query(
            `SELECT pw FROM USER WHERE stunum=${id};`
        );

        if (rows[0].pw == pw) {
            const user = 
            {
                stunum: id,
                pw: pw
            };
            const token = jwt.sign(user, config.jwt.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); // 토큰 생성
            res.cookie('token', token); //쿠키에 토큰설정
            res.json({ success: true, message: '로그인 성공.' });
        }
        else {
            res.json({ success: false, message: '로그인 실패.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
    finally { conn.release(); }
};

exports.Join = async (req,res) => {
    console.log("POST : insert");
    const { stunum, pw, name, birthday, gender, faceimg } = req.body;

    try {
        const connection = await pool.getConnection();
        const result = await connection.query('INSERT INTO user (stunum, pw, name, birthday, gender, faceimg) VALUES (?,?,?,?,?,?)', [stunum, pw, name, birthday, gender, faceimg]);
        connection.release();

        res.json({ success: true, message: '회원가입이 완료되었습니다.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
}

exports.Mypage = async (req,res) => {
    console.log("POST : mypage");
    try {
        const stunum = req.params.stunum;
        const conn = await pool.getConnection();
        console.log("쿼리작업중...");
        const rows = await conn.query(
            `SELECT * FROM USER  WHERE stunum=${stunum};`
        );

        // 주어진 이미지 데이터 (Buffer 형태로 가정)
        const imageBuffer = Buffer.from(rows[0].faceimg); // 데이터의 배열
        //URI로 변환
        const dataUri = `${imageBuffer}`;

        rows[0].faceimg = dataUri;
        console.log(rows);
        conn.release();

        const jsonS = JSON.stringify(rows);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(jsonS);
    }
    catch (e) { console.log(e); }
}

exports.Update = async (req,res) => {
    console.log("POST : update");
    const { stunum, pw, newpw, name, gender, birthday, faceimg } = req.body;

    try {
        if (stunum != null && pw != null && name != null && gender != null && newpw != null && faceimg != null) {
            const connection = await pool.getConnection();
            const result = await connection.query(
                `UPDATE user SET pw = ${newpw}, name = '${name}', gender = '${gender}', birthday = '${birthday}', faceimg = '${faceimg}' WHERE stunum = ${stunum} and pw='${pw}'`);
            connection.release();

            console.log(result);
            res.json({ success: true, message: '수정 완료되었습니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
}

exports.Check = async (req,res) => {
    console.log("POST : check");
    try {
        const stunum = req.params.stunum;
        const connection = await pool.getConnection();
        const result = await connection.query(`SELECT * FROM USER_check  WHERE stunum=${stunum};`);
        connection.release();
        console.log(result);
        const jsonS = JSON.stringify(result);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(jsonS);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
}

exports.CheckLog = async (req,res) => {
    console.log("POST : check");
    try {
        const connection = await pool.getConnection();
        const result = await connection.query(`SELECT user_check.stunum, user.name, user_check.date, user_check.state
        FROM user_check
        INNER JOIN user ON user_check.stunum = ${req.params.stunum}
        WHERE user_check.date >= '${req.body.startdate} 00:00:00'
          AND user_check.date <= '${req.body.enddate} 23:59:59';`);
        connection.release();
        console.log(result);
        const jsonS = JSON.stringify(result);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(jsonS);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
}

exports.AllCheck = async (req, res) => {
    console.log("POST : attendanceall :" + req.body.startdate +"~"+req.body.enddate);
    console.log(req.params)
    try {
        const connection = await pool.getConnection();

        const result = await connection.query(
            `SELECT user_check.stunum, user.name, user_check.date, user_check.state
            FROM user_check
            INNER JOIN user ON user_check.stunum = user.stunum
            WHERE user_check.date >= '${req.body.startdate} 00:00:00'
              AND user_check.date <= '${req.body.enddate} 23:59:59';`);

        connection.release();
        console.log(result);
        const jsonS = JSON.stringify(result);
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(jsonS);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
}