const db = require('../config/db')

class Promotions {
    constructor(promotion_id, promotion_name, promotion_percent, start_date, end_date) {
        this.promotion_id = promotion_id
        this.promotion_name = promotion_name
        this.promotion_percent = promotion_percent
        this.start_date = start_date
        this.end_date = end_date
    }

    async CreatePromotion() {
        const query = `INSERT INTO promotions set ? `
        const data = await db.query(query, {
            promotion_id: this.promotion_id,
            promotion_name: this.promotion_name,
            promotion_percent: this.promotion_percent,
            start_date: this.start_date,
            end_date: this.end_date
        })
        return data
    }


    static async createBookPromotion(promotion_id, book_id) {
        const query = `INSERT INTO book_promotions (promotion_id, book_id) VALUES (?, ?)`;
        const data = await db.query(query, [promotion_id, book_id]);
        return data;
    }

    static async createUserPromotions(promotion_id, user_id) {
        const query = `INSERT INTO user_promotions set ? `
        const data = await db.query(query, [user_id, promotion_id])
        return data
    }

    static async getAllPromotions(){
        const query = `SELECT * FROM promotions `
        const results = await db.query(query) 
        return results[0]
    }



}
module.exports = Promotions