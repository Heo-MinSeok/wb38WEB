//user.js
const express = require('express');
const router = express.Router();
const db = require('../DB/db.js');

module.exports = router;

// 가입
router.post('/join', db.Join)

// 로그인
router.post('/login', db.Login)

// 정보 조회
router.post('/main/:stunum/editinfo', db.Mypage)
router.post('/mobile/main/:stunum/eitinfo', db.Mypage)

// 정보 수정
router.post('/main/:stunum/editinfo/update', db.Update)
router.post('/mobile/main/:stunum/editinfo/update', db.Update)


// 출석 조회
router.post('/attendanceall', db.AllCheck)
router.post('/main/:stunum/check', db.Check)
router.post('/mobile/main/:stunum/check', db.Check)
