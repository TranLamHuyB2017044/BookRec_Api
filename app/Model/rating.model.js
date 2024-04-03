const db = require('../config/db')
const nodemailer = require('nodemailer');

class Ratings{
    constructor(rating_id, user_id, content, n_star){
        this.rating_id = rating_id
        this.user_id = user_id
        this.content = content
        this.n_star = n_star
    }

    async createRating(){
        const query = `INSERT INTO ratings set ? `
        const data = await db.query(query, {
            rating_id: this.rating_id,
            user_id: this.user_id,
            content: this.content,
            n_star: this.n_star
        })
        return data
    }

    static async getUserRating(){
        const userquery = `join users us on us.user_id = rt.user_id`
        const imageRatingQuery = `join ratingimages ri on rt.rating_id = ri.rating_id`
        const groupbyRatingQuery = `GROUP BY rt.rating_id, us.fullname, rt.content, rt.n_star`
        const query = `Select us.fullname, rt.content, rt.n_star, GROUP_CONCAT(ri.url) as urls from ratings rt ${imageRatingQuery} ${userquery} ${groupbyRatingQuery}`
        const data = await db.query(query)
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