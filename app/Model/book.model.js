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


    static async getFilterBook(condition, startIndex, itemsPerPage){
        const authorQuery = 'Join book_authors ba on b.book_id = ba.book_id join authors a on ba.author_id = a.author_id' 
        const publisherQuery = 'Join book_publishers bp on b.book_id = bp.book_id join publishers p on bp.publisher_id = p.publisher_id' 
        const manufacturerQuery = 'Join book_manufacturers bm on b.book_id = bm.book_id join manufacturer m on bm.manufacturer_id = m.manufacturer_id' 
        let query = `SELECT a.author_name, p.publisher_name, b.title, b.quantity_sold, b.avg_rating, b.original_price, b.discount, c.thumbnail_url FROM books b join cover_books c on b.book_id = c.book_id ${authorQuery} ${publisherQuery} ${manufacturerQuery}  where 1=1 ${condition}`
        query += ` LIMIT ${startIndex}, ${itemsPerPage}`;
        // const hidden = 'TRIM(TRAILING '\r' FROM a.author_name) as author_name, p.publisher_name'
        const filterResult = await db.query(query)
        return filterResult
    }
}

module.exports = Book