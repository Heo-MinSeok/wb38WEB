// 서버 실행 -> nodemon server.js

const http = require('http');
const express = require('express'), bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
var cors = require('cors');


const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: '10.101.169.86',
    database: 'wb38',
    user: 'root',
    password: '1234',
    dateStrings: 'date',
    connectionLimit: 10
});

const app = express()
const port = 8080

app.use(cors(), bodyParser.urlencoded({ extended: false, limit: '10mb' }), bodyParser.json({ limit: '10mb' }));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/mobile')));

//----------------
//      요청 처리
//-----------------

http.createServer(app).listen(port, () => {
    console.log(`Express Server started ${port}`)
})

// GET 요청 처리
app.get('/', function (요청, 응답) {
    // User-Agent 헤더에서 모바일 여부를 확인
    const isMobile = /Mobile/i.test(요청.headers['user-agent']);

    // 모바일인 경우 모바일 버전 출력, 그렇지 않으면 PC 버전 출력
    const version = isMobile ? 'Mobile' : 'PC';

    if (version == 'Mobile') {
        응답.sendFile(__dirname + "/mobile/MB_Login.html");
    }
    else {
        응답.sendFile(__dirname + "/pc/login.html");
       
    }
    console.log("GET: / [" + version + "]");
})
app.get('/login/main/:stunum', function (요청, 응답) {
    // User-Agent 헤더에서 모바일 여부를 확인
    const isMobile = /Mobile/i.test(요청.headers['user-agent']);

    // 모바일인 경우 모바일 버전 출력, 그렇지 않으면 PC 버전 출력
    const version = isMobile ? 'Mobile' : 'PC';

    if (version == 'Mobile') {
        응답.sendFile(__dirname + "/mobile/mobile.html");
    }
    else {
        응답.sendFile(__dirname + '/pc/index.html');
    }

    console.log(`GET: /login/main/${요청.params.stunum}[${version}]`);
})

app.get('/join', function (요청, 응답) {
    // User-Agent 헤더에서 모바일 여부를 확인
    const isMobile = /Mobile/i.test(요청.headers['user-agent']);

    // 모바일인 경우 모바일 버전 출력, 그렇지 않으면 PC 버전 출력
    const version = isMobile ? 'Mobile' : 'PC';

    if (version == 'Mobile') {
        응답.sendFile(__dirname + "/mobile/MB_Join.html");
    }
    else {
        응답.sendFile(__dirname + '/pc/join.html');
    }
    console.log(`GET: /join[${version}]`);
})

app.get('/login/main/:stunum/mypage', function (요청, 응답) {
    // User-Agent 헤더에서 모바일 여부를 확인
    const isMobile = /Mobile/i.test(요청.headers['user-agent']);

    // 모바일인 경우 모바일 버전 출력, 그렇지 않으면 PC 버전 출력
    const version = isMobile ? 'Mobile' : 'PC';

    if (version == 'Mobile') {
        응답.sendFile(__dirname + "/pc/mobile/MB_update.html");
    }
    else {
        응답.sendFile(__dirname + '/pc/editinfo.html');
    }

    console.log(`GET: /login/main/${요청.params.stunum}/mypage` + version);

})

app.get('/login/main/:stunum/check', function (요청, 응답) {
    // User-Agent 헤더에서 모바일 여부를 확인
    const isMobile = /Mobile/i.test(요청.headers['user-agent']);

    // 모바일인 경우 모바일 버전 출력, 그렇지 않으면 PC 버전 출력
    const version = isMobile ? 'Mobile' : 'PC';

    if (version == 'Mobile') {
        응답.sendFile(__dirname + "/mobile/MB_attendance.html");
    }
    else {
        응답.sendFile(__dirname + '/pc/attendance.html');
    }
    console.log(`GET: /login/main/${요청.params.stunum}/check[${version}]`);
})

app.get('/login/main/:stunum/allcheck', function (요청, 응답) {
   
    // stunum이 어드민일 경우에만 아레 진행하도록!
   
    // User-Agent 헤더에서 모바일 여부를 확인
   const isMobile = /Mobile/i.test(요청.headers['user-agent']);

   // 모바일인 경우 모바일 버전 출력, 그렇지 않으면 PC 버전 출력
   const version = isMobile ? 'Mobile' : 'PC';

   if (version == 'Mobile') {
       응답.sendFile(__dirname + "/mobile/MB_All_attend.html");
   }
   else {
       응답.sendFile(__dirname + '/pc/attendanceall.html');
   }
    console.log(`GET: /login/main/${요청.params.stunum}/attendanceall[${version}]`);
})

app.get('/login/main/:stunum/files', function (요청, 응답) {

    //stunum이 admin일경우에는 file_admin.html보내도록 추가하기

        // User-Agent 헤더에서 모바일 여부를 확인
        const isMobile = /Mobile/i.test(요청.headers['user-agent']);

        // 모바일인 경우 모바일 버전 출력, 그렇지 않으면 PC 버전 출력
        const version = isMobile ? 'Mobile' : 'PC';
    
        if (version == 'Mobile') {
            응답.sendFile(__dirname + "/mobile/MB_file.html");
            console.log(`GET: /login/main/${요청.params.stunum}/file[${version}]`);
        }
        else {
            응답.sendFile(__dirname + '/pc/file.html');
            console.log(`GET: /login/main/${요청.params.stunum}/file[${version}]`);
        }
})

app.get('/attendanceall/:date', async function (요청, 응답) {
    console.log("POST : attendanceall/"+요청.query.date );
    try {
        const connection = await pool.getConnection();

        const result = await connection.query(
            `SELECT user_check.stunum, user.name, user_check.date
            FROM user_check
            INNER JOIN user ON user_check.stunum = user.stunum
            WHERE user_check.date >= '${요청.query.date} 00:00:00'
              AND user_check.date <= '${요청.query.date} 23:59:59';`);

        connection.release();
        console.log(result);
        const jsonS = JSON.stringify(result);
        응답.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        응답.end(jsonS);
    }
    catch (error) {
        console.error(error);
        응답.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
})

// POST 요청 처리
app.post('/insert', async (req, res) => {

    console.log("POST : insert");
    const { stunum, pw, name, birthday, gender, faceimg } = req.body;

    try {
        const connection = await pool.getConnection();
        const result = await connection.query('INSERT INTO user (stunum, pw, name, birthday, gender, faceimg) VALUES (?,?,?,?,?,?)', [stunum, pw, name, gender, faceimg]);
        connection.release();

        res.json({ success: true, message: '회원가입이 완료되었습니다.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
});

app.post('/login', async function (요청, 응답) {
    console.log("POST : Login");
    const conn = await pool.getConnection();
    try {
        const { id, pw } = 요청.body;

        console.log("쿼리작업중...");
        const rows = await conn.query(
            `SELECT pw FROM USER WHERE stunum=${id};`
        );

        if (rows[0].pw == pw) {
            응답.json({ success: true, message: '로그인 성공.' });
        }
        else {
            응답.json({ success: false, message: '로그인 실패.' });
        }
    }
    catch (error) {
        console.error(error);
        응답.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
    finally { conn.release(); }
})

app.post('/login/main/:stunum/mypage', async function (요청, 응답) {
    console.log("POST : Mypage");
    try {
        const stunum = 요청.params.stunum;
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
        응답.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        응답.end(jsonS);
    }
    catch (e) { console.log(e); }

})

// Update Post 요청 처리
app.post('/login/main/:stunum/mypage/update', async (req, res) => {
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
});

app.post('/login/main/:stunum/check', async (req, res) => {
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
});

app.post('/login/main/:stunum/files/upload', async (req, res) => {
    console.log("POST : upload");

    const form = new formidable.IncomingForm();
    form.multiples = false;
    form.uploadDir = './public/files';
    form.maxFileSize = 10 * 1024 * 1024, // 10MB

    form.parse(req, (err, fields, files) => {

        if (err) {
            console.error('Error parsing form:', err);
            return res.end('Internal Server Error');
        } else {
            const filedata = files.file;
            newPath = path.join(form.uploadDir, filedata[0].originalFilename)
            fs.rename(filedata[0].filepath, newPath, (renameErr) => {
                if (renameErr) {
                    console.error('Error moving file:', renameErr);
                    return res.end('Internal Server Error');
                }
            })
        }
        res.json({ success: true, message: '업로드 성공.' });

    });
});

app.post('/filelist', async (요청, res) => {
    console.log('POST: /filelist')
    var testFolder = './public/files'
    try {
        fs.readdir(testFolder, function (error, filelist) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(filelist));
        })
    }
    catch (e) { console.log(e); }

});

app.post('/filedelete', async (req, res) => {
    console.log('POST: /filedelete')
    filePath = req.body.link;
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            res.json({ success: false, message: '삭제 실패.' });
        } else {
            console.log('File deleted successfully : ' + filePath);
            res.json({ success: true, message: '삭제 성공.' });
        }
    });
});





app.get('/test1', function (req, res) {

    res.sendFile(__dirname + '/cssfile/3D.html');
})