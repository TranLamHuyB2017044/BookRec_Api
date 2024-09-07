const db = require('../config/db');
const CryptoJS = require('crypto-js');
require("dotenv").config();
const nodemailer = require('nodemailer');

class User {
    constructor(UserDetail) {
        this.fullname = UserDetail.fullname;
        this.user_ava = UserDetail.user_ava;
        this.email = UserDetail.email;
        this.verify = UserDetail.verify === 'true' ? 1 : 0;
        this.phone = UserDetail.phone;
        this.pass_word = UserDetail.pass_word;
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
            throw new Error('Email đã được sử dụng.');
        }
        const query = 'INSERT INTO USERS SET ?';
        const userDataWithHashedPassword = { ...newUser, pass_word: this.encryptPassword(newUser.pass_word, process.env.SECRET_AESKEY, { iv: process.env.iv }) };
        const result = await db.query(query, userDataWithHashedPassword);
        return result;
    }


    static async getOneUser(email) {
        const query = 'SELECT * FROM users WHERE email = ? '
        const result = await db.query(query, [email])
        const [data] = result[0].map(user => user)
        if (data === undefined) {
            throw new Error('Could not find your email address')
        }
        return data
    }

    static async getOneUserAdmin(email) {
        const query = 'SELECT * FROM users WHERE email = ?'
        const result = await db.query(query, [email])
        const [data] = result[0].map(user => user)
        if (data === undefined) {
            throw new Error('Could not find your email address')
        }
        if (data.admin_role !== 1) {

            throw new Error('You are not an administrator to do this')
        }
        return data
    }

    static async VerifyEmail(user, verifyNumber) {
        // const verifyLink = 'http://localhost:3000/login'
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "tlhuy02@gmail.com",
                pass: process.env.MailPass,
            },
        })
        const mailOptions = {
            from: '"BookRec" <tlhuy02@gmail.com>',
            to: user.email,
            subject: 'Xác thư email của bạn',
            html: `<p>Xin chào 👋 ${user.fullname}, mã số xác thực của bạn là ${verifyNumber}</p>`
        }
        transporter.sendMail(mailOptions)
    }

    static async updateVerify(email){
        const query = `UPDATE users SET verify = 1 WHERE email = '${email}' `
        await db.query(query)
        return {message: 'success'}
    }

    static async getAllUsers(){
        const orderQuery = `LEFT JOIN orders od ON u.user_id = od.user_id `;
        const query = `SELECT u.user_id, fullname, email, u.phone, COUNT(od.user_id) AS num_orders, SUM(od.total_price) AS total_amount, u.created_at FROM users u
                       ${orderQuery}
                       GROUP BY u.user_id, fullname, email, phone, u.created_at`;        
        const data = await db.query(query)
        return data[0]
    }

    static async updateUser(updateInfo){
        const query = `UPDATE users 
        SET 
            fullname = ?,
            user_ava = ?
        WHERE 
            user_id = ? ;`

        const rs = await db.query(query, [updateInfo.fullname,  updateInfo.user_ava, updateInfo.user_id])
        return {
            rs,
            newUser:{
                fullname: updateInfo.fullname,
                user_ava : updateInfo.user_ava
            }
        }
    }


    static async getUserByName(fullname){
        const query = `select fullname, user_id, user_ava, email from users where fullname like '%${fullname}%' and verify = 1 `    
        const rs = await db.query(query)
        return rs[0]

    }
    
    static async getUserById(user_id){
        const query = `select fullname, email from users where user_id = ${user_id} `    
        const rs = await db.query(query)
        return rs[0][0]

    }


    static async SendCouponEmail(user, coupon_info) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, 
            auth: {
                user: "tlhuy02@gmail.com",
                pass: process.env.MailPass,
            },
        })
        const mailOptions = {
            from: '"Bookrec book store" <bookrecstore@gmail.com>', 
            to: user.email, 
            subject: 'Bạn nhận được mã khuyến mãi từ cửa hàng chúng tôi', 
            html: `
                <p>Xin chào 👋 ${user.fullname}, chúng tôi vui mừng thông báo với bạn rằng</p>
                <p>Bạn nhận được một mã khuyến mãi <strong>${coupon_info.coupon_name}</strong> từ cửa hàng chúng tôi.</p>
                <p>Loại khuyến mãi <strong>${coupon_info.coupon_type}</strong> từ đơn hàng có giá trị từ ${coupon_info.applying_condition} vnđ</p>
                <p>Để sử dụng, vui lòng chọn ở mục khuyến mãi trong phần thanh toán.</p>
                <p>Ngày khuyến mãi là <strong>${coupon_info.start_date}</strong> và hạn sử dụng của khuyến mãi là <strong>${coupon_info.end_date}</strong>.</p>
                <p>Chúc bạn có một trải nghiệm mua sắm tuyệt vời!</p>
            `
        };
        transporter.sendMail(mailOptions)
    }

}






module.exports = User