import express from 'express';
import * as authCtrl from './auth.ctrl';

const api = express.Router();

api.post('/register', authCtrl.register);
api.post('/login', authCtrl.login);
api.get('/check', authCtrl.check);
api.post('/logout', authCtrl.logout);

export default api;
