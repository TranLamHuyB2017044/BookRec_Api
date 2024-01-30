const db = require('../config/db');
const crypto = require('crypto-js');

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

    static hashPassword(password) {
        const hashedPassword = crypto.SHA256(password).toString(crypto.enc.Hex);
        return hashedPassword;
    }

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
        const userDataWithHashedPassword = { ...newUser, pass_word: this.hashPassword(newUser.pass_word) };
        const result = await db.query(query, userDataWithHashedPassword);
        return result;
    }

    static async getOneUser(email, password, cb) {
        const query = 'SELECT * FROM users WHERE email = ? AND password = ?'
        await db.query(query,[email, password], (err, result) => {
            if(err) return cb(err, null);
            cb(null, result);
        })
    }

}

module.exports = User