const db = require('../config/db')
const nodemailer = require('nodemailer');

class Reply {
    constructor(reply_id,  rating_id, content) {
        this.reply_id = reply_id
        this.rating_id = rating_id
        this.content = content
    }

     async createReplyComment(){
        const query = `INSERT INTO reply set ? `
        const data = await db.query(query, {
            reply_id: this.reply_id,
            rating_id: this.rating_id,
            content: this.content,
        })
        return data
    }



}
module.exports = { Reply }