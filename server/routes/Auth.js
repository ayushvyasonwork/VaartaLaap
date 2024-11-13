const express=require('express');
const router=express.Router();
const {login,signup,  findUsers}=require('../controllers/auth');
const {auth,Inuser,Inadmin}=require('../middlewares/auth');

router.post('/login',login);
router.post('/signup',signup);
router.get('/auth',auth)
router.get('/user',auth,Inuser)
router.get('/admin',auth,Inadmin)
router.get('/userfind',auth,findUsers)

module.exports=router;