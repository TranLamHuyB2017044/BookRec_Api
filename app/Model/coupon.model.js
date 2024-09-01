const db = require('../config/db')

class Coupons {
    constructor(coupon_id, coupon_name, coupon_percent, start_date, end_date, coupon_status, applying_condition, coupon_type) {
        this.coupon_id = coupon_id
        this.coupon_name = coupon_name
        this.coupon_percent = coupon_percent
        this.start_date = start_date
        this.end_date = end_date
        this.coupon_status = coupon_status
        this.applying_condition = applying_condition
        this.coupon_type = coupon_type
    }

    async CreateCoupon() {
        const query = `INSERT INTO coupons set ? `
        const data = await db.query(query, {
            coupon_id: this.coupon_id,
            coupon_name: this.coupon_name,
            coupon_percent: this.coupon_percent,
            start_date: this.start_date,
            end_date: this.end_date,
            coupon_status: this.coupon_status,
            applying_condition :this.applying_condition,
            coupon_type:this.coupon_type
        })
        return data
    }


    static async createUserCoupon(coupon_id, user_id) {
        const query = `INSERT INTO user_coupons (coupon_id, user_id) VALUES (?, ?)`;
        const data = await db.query(query, [coupon_id, user_id]);
        return data;
    }


    static async getAllcoupons() {
        const query = `SELECT * FROM coupons `
        const results = await db.query(query)
        return results[0]
    }


    static async updateStatuscouponsById(coupon_id, status){
        const query = `update coupons set coupon_status = '${status}' where coupon_id= ${coupon_id} `
        const result = await db.query(query)
        return result[0]
    }

}
module.exports = Coupons