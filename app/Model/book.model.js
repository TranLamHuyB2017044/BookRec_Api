const db = require('../config/db');

class Book{
    constructor(BookDetails){
        this.book_id = BookDetails.book_id
        this.title = BookDetails.title
        this.short_description = BookDetails.short_description
        this.original_price = BookDetails.original_price
        this.inStock = BookDetails.inStock
        this.quantity_sold = BookDetails.quantity_sold
        this.category = BookDetails.category
        this.avg_rating = BookDetails.avg_rating
        this.page = BookDetails.page
        this.discount = BookDetails.discount
        this.publication_date = BookDetails.publication_date
        this.createdAt = BookDetails.createdAt
    }

    static async getAllBooks(startIndex, itemsPerPage) {
        const query = `SELECT b.title, b.quantity_sold, b.avg_rating, b.original_price, b.discount, c.thumbnail_url FROM books b join cover_books c on b.book_id = c.book_id LIMIT ${startIndex}, ${itemsPerPage}`
        const result = await db.query(query)
        return result[0]
    }

    
    static async getCountBookQuery(){
        const countQuery = 'SELECT count(*) as total from books'
        const countResult = await db.query(countQuery)
        const data = countResult[0]
        return data
    }


    static async getCategory(){
        const query = `SELECT DISTINCT category FROM books `
        const result = await db.query(query)
        return result[0]
    }
}

module.exports = Book