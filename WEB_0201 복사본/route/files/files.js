// files.js

const fs = require('fs');                   // 서버 파일 관리
const formidable = require('formidable');   // 파일 Up & down 
const path = require('path');


exports.GetFileList = async (req, res) => {
    console.log('POST: /filelist')
    var testFolder = './public/files'
    try {
        fs.readdir(testFolder, function (error, filelist) {
            res.writeHead(200, { 'Content-Type': 'routerlication/json; charset=utf-8' });
            res.end(JSON.stringify(filelist));
        })
    }
    catch (e) { console.log(e); }
};

exports.DeleteFile = async (req, res) => {
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
};

exports.UploadFile = async (req, res) => {

    try{
        const form = new formidable.IncomingForm();
        form.multiples = false;

        form.parse(req, (err, fields, files) => {
            if (err) {
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return
            }
            const file = files.file
            const newPath = path.join("./public/files/" + `${file[0].originalFilename}`) //__dirname : 현재경로 가져오기
            fs.renameSync(file[0].filepath, newPath)
            res.status(200).json({success: true, message: "업로드 성공."})
        })

    }catch(err){
        console.log('err : ',err)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }    console.log("POST : upload");
   
};
