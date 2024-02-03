const db = require('../config/db');
const CryptoJS = require('crypto-js');
require("dotenv").config();

class User {
    constructor(UserDetail) {
        this.fullname = UserDetail.fullname;
        this.email = UserDetail.email;
        this.phone = UserDetail.phone;
        this.pass_word = UserDetail.pass_word;
        this.avatar = UserDetail.avatar;
        this.avatar_id = UserDetail.avatar_id;
        this.admin_role = UserDetail.admin_role === 'true' ? 1 : 0
    }

    static encryptPassword = (plaintextPassword, secretKey, iv) => {
        const encryptedPassword = CryptoJS.AES.encrypt(plaintextPassword, secretKey, { iv: iv }).toString();
        return encryptedPassword;
    };

    static isEmailUnique(email) {
        const query = 'SELECT email FROM USERS WHERE email = ?';
        const existingUser = db.query(query, [email]);
        return existingUser
    }

    static async createUser(newUser) {
        const isUnique = await this.isEmailUnique(newUser.email);
        if (isUnique[0].length > 0) {
            console.log('email is not unique')
            throw new Error('Email already exists.');
        }
        console.log('isunique')
        const query = 'INSERT INTO USERS SET ?';
        const userDataWithHashedPassword = { ...newUser, pass_word: this.encryptPassword(newUser.pass_word, process.env.SECRET_AESKEY, {iv: process.env.iv}) };
        const result = await db.query(query, userDataWithHashedPassword);
        return result;
    }

    static async getOneUser(email) {
        const query = 'SELECT * FROM users WHERE email = ?'
        const result = await db.query(query,[email])
        const [data] = result[0].map(user => user)
        if(data === undefined){
            throw new Error('Could not find your email address')
        }
        return data
    }

}

module.exports = User