const db = require('../config/db')
const nodemailer = require('nodemailer');

class Ratings{
    constructor(rating_id, user_id, book_id, content, n_star){
        this.rating_id = rating_id
        this.user_id = user_id
        this.book_id = book_id
        this.content = content
        this.n_star = n_star
    }

    async createRating(){
        const query = `INSERT INTO ratings set ? `
        const data = await db.query(query, {
            rating_id: this.rating_id,
            user_id: this.user_id,
            book_id: this.book_id,
            content: this.content,
            n_star: this.n_star
        })
        return data
    }

    static async getUserRating(book_id){
        const userquery = `left join users us on us.user_id = rt.user_id`;
        const imageRatingQuery = `left join ratingimages ri on rt.rating_id = ri.rating_id`;
        const groupbyRatingQuery = `GROUP BY rt.rating_id, us.fullname, rt.content, rt.n_star`;
        const orderByQuery = `ORDER BY rt.created_at DESC`; 
        const query = `Select us.user_id, us.fullname, us.user_ava, rt.content, rt.n_star,rt.created_at, GROUP_CONCAT(ri.url) as urls from ratings rt ${imageRatingQuery} ${userquery} where rt.book_id = ${book_id} ${groupbyRatingQuery} ${orderByQuery}`;
        const data = await db.query(query);
        return data[0];
    }

    static async countRating(book_id){
        const rating_image_query = `join ratingimages rti on rt.rating_id = rti.rating_id`
        const rating_query = `select avg(rt.n_star) as avg_star, count(rti.url) as all_media from ratings rt ${rating_image_query} where rt.book_id = ? ;`
        const data = await db.query(rating_query, [book_id]);
        return data[0]
    }

    static async countNumRating(book_id){
        const query = `select count(rating_id) as number_rating from ratings where book_id = ? ;`
        const data = await db.query(query, [book_id]);
        return data[0]
    }

    static async getAllImagebyBookId(book_id){
        const rating_image_query = `join ratingimages rti on rt.rating_id = rti.rating_id`
        const rating_query = `select rti.url from ratings rt ${rating_image_query} where rt.book_id = ? ;`
        const data = await db.query(rating_query, [book_id]);
        return data[0]
    }

    static async countRatingPerNStar(book_id){
        const query = `select count(rt.rating_id) as num_rating , rt.n_star from ratingimages ri join ratings rt on ri.rating_id = rt.rating_id where book_id = ? group by rt.n_star order by rt.n_star desc;`
        const data = await db.query(query, book_id)
        return data[0]
    }
}

class Ratingimages{
    constructor(ratingImg_id, url, rating_id) {
        this.ratingImg_id = ratingImg_id;
        this.url = url; 
        this.rating_id = rating_id
    }

    async createRatingImage(){
        const query = `INSERT INTO ratingimages set ? `
        const data = await db.query(query, {
            ratingImg_id: this.ratingImg_id,
            url: this.url,
            rating_id: this.rating_id
        })
        return data
    }



 
}

module.exports = {Ratings, Ratingimages}