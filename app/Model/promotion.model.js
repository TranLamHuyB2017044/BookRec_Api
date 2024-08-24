const db = require('../config/db')

class Promotions {
    constructor(promotion_id, promotion_name, promotion_percent, start_date, end_date, promotion_status) {
        this.promotion_id = promotion_id
        this.promotion_name = promotion_name
        this.promotion_percent = promotion_percent
        this.start_date = start_date
        this.end_date = end_date
        this.promotion_status = promotion_status
    }

    async CreatePromotion() {
        const query = `INSERT INTO promotions set ? `
        const data = await db.query(query, {
            promotion_id: this.promotion_id,
            promotion_name: this.promotion_name,
            promotion_percent: this.promotion_percent,
            start_date: this.start_date,
            end_date: this.end_date,
            promotion_status: this.promotion_status
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


    static async getAllPromotions() {
        const query = `SELECT * FROM promotions `
        const results = await db.query(query)
        return results[0]
    }


    static async getBookPromotions(promotion_id) {
        const book_query = `left join books b on bp.book_id = b.book_id `
        const cover_book_query = `left join cover_books cv on cv.book_id = b.book_id`;
        const select_query = ` bp.promotion_id, promotion_name, promotion_status, start_date, end_date, promotion_percent, b.title, cv.thumbnail_url`;
        const query = `select ${select_query} from book_promotions bp join promotions p on bp.promotion_id = p.promotion_id ${book_query} ${cover_book_query} where p.promotion_id = ? `
        const results = await db.query(query, [promotion_id])
        return results[0]
    }


    static async updateStatusPromotions() {
        const query = `UPDATE promotions
        SET status = CASE
            WHEN start_date <= NOW() AND status = 'Chưa áp dụng' THEN 'Đang áp dụng'
            WHEN NOW() >= end_date AND status = 'Đang áp dụng' THEN 'Ngừng áp dụng'
            ELSE status
        END`
        const results = await db.query(query)
        return results[0]
    }


    static async updateStatusPromotionsById(promotion_id, status){
        const query = `update promotions set promotion_status = '${status}' where promotion_id= ${promotion_id} `
        const result = await db.query(query)
        return result[0]
    }

}
module.exports = Promotions