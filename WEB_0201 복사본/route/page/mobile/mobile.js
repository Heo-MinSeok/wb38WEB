//mobile.js

const express = require('express');

const userRouter = require('../../user/user.js');
const filesRouter = require('../../files/files.js');
const mobileMid = require('./mobile.controller.js');
const router = express.Router();

module.exports = router;

// 로그인 페이지 //
router.get('/login', mobileMid.GetLogin);
router.post('/login', userRouter)

// 가입 페이지 //
router.get('/join', mobileMid.GetJoin);
router.post('/join', userRouter) 

// 메인 페이지 //
router.get('/main/:stunum', mobileMid.GetMain);

// 정보수정 페이지 //
router.get('/main/:stunum/editinfo', mobileMid.GetEditinfo);

router.post('/main/:stunum/editinfo', userRouter) 
router.post('/main/:stunum/editinfo/update', userRouter)

// 출석 페이지 //
router.get('/main/:stunum/check',mobileMid.GetCheck);

router.post('/main/:stunum/check', userRouter)
router.post('/attendanceall', userRouter) 

// 전체출석 페이지 //
router.get('/main/:stunum/allcheck', mobileMid.GetAllcheck);

// 파일 페이지 //
router.get('/main/:stunum/files', mobileMid.GetFiles);

router.post('/filelist', filesRouter.GetFileList);
router.post('/fileupload', filesRouter.UploadFile);
router.post('/filedelete', filesRouter.DeleteFile);