const User = require('../Model/user.model')
const cloudinary = require("cloudinary").v2;
const crypto = require('crypto-js');
require("dotenv").config();

exports.Register = async (req, res) => {
    const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        pass_word: req.body.password,
        avatar: req.file?.path || 'https://res.cloudinary.com/dfnwnhng8/image/upload/v1706951994/user_ava/cxzxijeadutnj66fjfhq.jpg',
        avatar_id: req.file?.filename || 'user_ava/cxzxijeadutnj66fjfhq',
        admin_role: req.body.admin_role,
    });
    try {
        await User.createUser(newUser);
        const  { pass_word, ...others} = newUser
        res.status(200).json(others);
    } catch (err) {
        if(err.message == 'Email đã được sử dụng.'){
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename);
            }
            res.status(400).json({ message: err.sqlMessage || 'Email đã được sử dụng.' });
        }else{
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename);
            }
            res.status(400).json({ message: err.sqlMessage || 'Có lỗi xảy ra khi đăng ký tài khoản' });
        }
    }
};

exports.Login = async (req, res) => {
    const {email, password} = req.body
    try {
        const data = await User.getOneUser(email)
        const passwordEncrypt = data.pass_word
        const DecryptText = crypto.AES.decrypt(passwordEncrypt, process.env.SECRET_AESKEY, {iv: process.env.iv})
        const passwordDecrypted = DecryptText.toString(crypto.enc.Utf8)
        if(passwordDecrypted !== password){
            return res.status(401).json('Sai mật khẩu')
        }
        const {pass_word, ...other} = data
        res.status(200).json(other)
    } catch (error) {
        if(error.message === "Could not find your email address"){
            return res.status(500).json("Không tìm thấy địa chỉ email của bạn");
        }
        return res.status(500).json(error.message);
    }
}

exports.LoginAdmin = async (req, res) => {
    const {email, password} = req.body
    try {
        const data = await User.getOneUserAdmin(email)
        const passwordEncrypt = data.pass_word
        const DecryptText = crypto.AES.decrypt(passwordEncrypt, process.env.SECRET_AESKEY, {iv: process.env.iv})
        const passwordDecrypted = DecryptText.toString(crypto.enc.Utf8)
        if(passwordDecrypted !== password.toString()){
            return res.status(401).json('Sai mật khẩu')
        }
        const {pass_word, ...other} = data
        res.status(200).json(other)
    } catch (error) {
        if(error.message === "Could not find your email address"){
            return res.status(500).json("Không tìm thấy địa chỉ email của bạn");
        }
        return res.status(500).json(error.message);
    }
}