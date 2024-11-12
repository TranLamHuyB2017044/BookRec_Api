const User = require('../Model/user.model')
const cloudinary = require("cloudinary").v2;
const crypto = require('crypto-js');
require("dotenv").config();


function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.UpdateVerify = async (req, res) => {
    const {email} = req.body;
    try {
        const data = await User.updateVerify(email)
        res.status(200).json(data);
    } catch (error) {
        res.status(401).json({ message: error.message})
    }
}

exports.SendEmailVerify = async (req, res) => {
    const UserInfo = {
        email: req.body.email,
        fullname: req.body.fullname
    }
    try {
        const verifyNumber = generateRandomNumberWithDigits(6)
        await User.VerifyEmail(UserInfo, verifyNumber)
        res.status(200).json({verify: verifyNumber});
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
}

exports.Register = async (req, res) => {

    const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        verify: req.body.verify,
        phone: req.body.phone,
        pass_word: req.body.password,
        admin_role: req.body.admin_role,
    });
    const verifyNumber = generateRandomNumberWithDigits(6)
    try {
        await User.createUser(newUser);
        await User.VerifyEmail(newUser, verifyNumber)
        const { pass_word, ...others } = newUser
        res.status(200).json({others: others, verify: verifyNumber});
    } catch (err) {
        if (err.message == 'Email đã được sử dụng.') {
            res.status(400).json({ message: err.sqlMessage || 'Email đã được sử dụng.' });
        } else {
            res.status(400).json({ message: err.message});
        }
    }
};

exports.Login = async (req, res) => {
    const { email, password } = req.body
    try {
        const data = await User.getOneUser(email)
        const passwordEncrypt = data.pass_word
        const DecryptText = crypto.AES.decrypt(passwordEncrypt, process.env.SECRET_AESKEY, { iv: process.env.iv })
        const passwordDecrypted = DecryptText.toString(crypto.enc.Utf8)
        if (passwordDecrypted !== password) {
            return res.status(401).json('Sai mật khẩu')
        }
        const { pass_word, ...other } = data
        res.status(200).json(other)
    } catch (error) {
        if (error.message === "Could not find your email address") {
            return res.status(500).json("Không tìm thấy địa chỉ email của bạn");
        }
        return res.status(500).json(error.message);
    }
}

exports.LoginAdmin = async (req, res) => {
    const { email, password } = req.body
    try {
        const data = await User.getOneUserAdmin(email)
        const passwordEncrypt = data.pass_word
        const DecryptText = crypto.AES.decrypt(passwordEncrypt, process.env.SECRET_AESKEY, { iv: process.env.iv })
        const passwordDecrypted = DecryptText.toString(crypto.enc.Utf8)
        if (passwordDecrypted !== password) {
            return res.status(401).json('Sai mật khẩu')
        }
        const { pass_word, ...other } = data
        res.status(200).json(other)
    } catch (error) {
        if (error.message === "Could not find your email address") {
            return res.status(500).json("Không tìm thấy địa chỉ email của bạn");
        }
        return res.status(500).json(error.message);
    }
}



exports.getAllUsersAdmin = async (req, res ) => {
    try {
        const userList = await User.getAllUsers()
        res.status(200).json(userList) 
    } catch (error) {
        res.status(404).json(error.message)
    }
}


exports.updateUserInfo = async (req, res) => {
    try {
        const userId = req.params.userid
        const email = req.body.email
        const existedUser = await User.getOneUser(email)
        const userInfo = {
            user_id: userId,
            fullname: req.body.fullname ,
        }
        if (req.file){
            userInfo.user_ava = req.file.path
        }else{
            userInfo.user_ava = existedUser.user_ava
        }
        const updatedUser = await User.updateUser(userInfo)
        const userUpdated = {
            user_id: existedUser.user_id,
            fullname: updatedUser.newUser.fullname,
            user_ava: updatedUser.newUser.user_ava,
            email,
            verify: existedUser.verify,
            phone: existedUser.phone,
            pass_word: existedUser.pass_word,
            admin_role: existedUser.admin_role,
            created_at: existedUser.created_at,
        }
        res.status(200).json(userUpdated)
    } catch (error) {
        if(req.file){
            cloudinary.uploader.destroy(req.file.filename)
            return res.status(404).json(error.message)
        }
        return res.status(404).json(error.message)
    }


}

exports.autoCompleteSearchUserByName = async (req, res) =>{
    const { fullname } = req.query;

    try {
        if (fullname){
            const data = await User.getUserByName(fullname)
            return res.status(200).json(data)

        }else{
            this.getAllUsersAdmin()
        }
    } catch (error) {
        return res.status(404).json(error.message)
    }
}



