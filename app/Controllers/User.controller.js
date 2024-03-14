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

exports.Register = async (req, res) => {

    const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        verify: req.body.verify,
        phone: req.body.phone,
        pass_word: req.body.password,
        admin_role: req.body.admin_role,
    });
    const verifyNumber = generateRandomNumberWithDigits(5)
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
        if (passwordDecrypted !== password.toString()) {
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