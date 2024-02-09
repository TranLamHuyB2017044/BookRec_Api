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
        const query = `SELECT b.book_id, b.title, b.quantity_sold, b.avg_rating, b.original_price, b.discount, c.thumbnail_url FROM books b left join cover_books c on b.book_id = c.book_id LIMIT ${startIndex}, ${itemsPerPage}`
        const result = await db.query(query)
        return result[0]
    }

    
    static async getCountALLBookQuery(startIndex, itemsPerPage){
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'

        const countQuery = `SELECT count(b.book_id) as total from books b ${cover_book_query} `
        const countResult = await db.query(countQuery)
        const data = countResult[0]
        return data
    }

    static async getCountBookFilterQuery(condition){
        const authorQuery = 'left Join book_authors ba on b.book_id = ba.book_id left join authors a on ba.author_id = a.author_id' 
        const publisherQuery = 'left Join book_publishers bp on b.book_id = bp.book_id left join publishers p on bp.publisher_id = p.publisher_id' 
        const manufacturerQuery = 'left Join book_manufacturers bm on b.book_id = bm.book_id left join manufacturer m on bm.manufacturer_id = m.manufacturer_id' 
        const cover_book_query = 'left Join cover_books c on b.book_id = c.book_id'
        const countQuey = `SELECT count(*) as total from books b ${cover_book_query} ${authorQuery} ${publisherQuery} ${manufacturerQuery}  where 1=1 ${condition} `
        const countResults = await db.query(countQuey)
        const data = countResults[0]
        return data

    }

    static async getFilterBook(condition, startIndex, itemsPerPage){
        const authorQuery = ' left Join book_authors ba on b.book_id = ba.book_id left join authors a on ba.author_id = a.author_id' 
        const publisherQuery = ' left Join book_publishers bp on b.book_id = bp.book_id left join publishers p on bp.publisher_id = p.publisher_id' 
        const manufacturerQuery = ' left Join book_manufacturers bm on b.book_id = bm.book_id left join manufacturer m on bm.manufacturer_id = m.manufacturer_id' 
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
        let query = `SELECT distinct b.book_id, b.title, b.quantity_sold, b.avg_rating, b.original_price, b.discount, c.thumbnail_url FROM books b ${cover_book_query}  ${authorQuery} ${publisherQuery} ${manufacturerQuery}  where 1=1 ${condition}`
        query += ` LIMIT ${startIndex}, ${itemsPerPage}`;
        const filterResult = await db.query(query)
        return filterResult
    }


    static async getOneBookByName(id){
        const authorQuery = ' left Join book_authors ba on b.book_id = ba.book_id left join authors a on ba.author_id = a.author_id' 
        const publisherQuery = ' left Join book_publishers bp on b.book_id = bp.book_id left join publishers p on bp.publisher_id = p.publisher_id' 
        const manufacturerQuery = ' left Join book_manufacturers bm on b.book_id = bm.book_id left join manufacturer m on bm.manufacturer_id = m.manufacturer_id' 
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
        const query = `SELECT * FROM books b ${cover_book_query}  ${authorQuery} ${publisherQuery} ${manufacturerQuery} where b.book_id = ${id}`
        const result = db.query(query)
        return result
    }
}

module.exports = Book