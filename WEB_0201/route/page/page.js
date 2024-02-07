//page.js

const express = require('express');

const userRouter = require('../user/user.js');
const filesRouter = require('../files/files.js');
const pageMid = require('./page.controller.js');
const router = express.Router();

module.exports = router;

// 접속환경 확인 및 리다이렉트
router.get('/', pageMid.GetRoot);
router.get('/logout', pageMid.GetLogOut);

// 로그인 페이지 
router.get('/login', pageMid.GetLogin);
router.post('/login', userRouter)

// 가입 페이지
router.get('/join', pageMid.GetJoin);
router.post('/join', userRouter) 

// 메인 페이지npm 
router.get('/main/:stunum', pageMid.GetMain);

// 정보수정 페이지
router.get('/main/:stunum/editinfo', pageMid.GetEditinfo);

router.post('/main/:stunum/editinfo', userRouter) 
router.post('/main/:stunum/editinfo/update', userRouter)

// 출석 페이지
router.get('/main/:stunum/check',pageMid.GetCheck);
router.get('/main/:stunum/checklist',pageMid.GetCheckList);

router.post('/main/:stunum/check', userRouter)
router.post('/main/:stunum/checklist', userRouter)
router.post('/attendanceall', userRouter) 

// 전체출석 페이지
router.get('/main/:stunum/allcheck', pageMid.GetAllcheck);

// 파일 페이지
router.get('/main/:stunum/files', pageMid.GetFiles);

router.post('/filelist', filesRouter.GetFileList);
router.post('/fileupload', filesRouter.UploadFile);
router.post('/filedelete', filesRouter.DeleteFile);
