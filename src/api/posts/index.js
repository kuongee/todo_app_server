import express from 'express';
import * as postsCtrl from './posts.ctrl';
import checkLoggedIn from '../../lib/checkLoggedIn';

const api = express.Router();

api.get('/', postsCtrl.list);
api.post('/', checkLoggedIn, postsCtrl.write);

export default api;

// req.body는 body-parser를 사용하기 전에는 undefined로 설정
