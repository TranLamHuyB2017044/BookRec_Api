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
        this.pages = BookDetails.pages
        this.discount = BookDetails.discount
        this.publication_date = BookDetails.publication_date
        this.created_at = BookDetails.created_at
    }

    static async getAllBooksAndNavigate(startIndex, itemsPerPage) {
        const query = `SELECT b.book_id, b.title, b.quantity_sold, b.avg_rating, b.original_price, b.discount, c.thumbnail_url FROM books b left join cover_books c on b.book_id = c.book_id LIMIT ${startIndex}, ${itemsPerPage}`
        const result = await db.query(query)
        return result[0]
    }

    static async getAllBooks() {
        const query = `SELECT book_id, title, original_price, discount, inStock FROM books `
        const result = await db.query(query)
        return result[0]
    }

    
    static async getCountALLBookQuery(){
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

    static async searchBookByName(book_title){
        const query = `SELECT book_id, title, original_price, discount, inStock FROM books where title like '%${book_title}%'`
        const result = await db.query(query)
        return result
    }
     
    
    static async createNewBook(book_info, cover_info, author_info, publisher_info, manufacturer_info) {
        try {
            let author_id;
            let publisher_id;
            let manufacturer_id;
    
            const [existingAuthor] = await db.query("SELECT author_id FROM authors WHERE author_name = ?", [author_info.author_name]);
            if (existingAuthor.length > 0) {
                author_id = existingAuthor[0].author_id;
            } else {
                var authorResult = await db.query("INSERT INTO authors SET ?", author_info);
                author_id = author_info.author_id;
            }
    
            const [existingPublisher] = await db.query("SELECT publisher_id FROM publishers WHERE publisher_name = ?", [`${publisher_info.publisher_name}\r`]);
            if (existingPublisher.length > 0) {
                publisher_id = existingPublisher[0].publisher_id;
            } else {
                var publisherResult = await db.query("INSERT INTO publishers SET ?", publisher_info);
                publisher_id = publisher_info.publisher_id;
            }
    
            const [existingManufacturer] = await db.query("SELECT manufacturer_id FROM manufacturer WHERE manufacturer_name = ?", [`${manufacturer_info.manufacturer_name}\r`]);
            if (existingManufacturer.length > 0) {
                manufacturer_id = existingManufacturer[0].manufacturer_id;
            } else {
                var manufacturerResult = await db.query("INSERT INTO manufacturer SET ?", manufacturer_info);
                manufacturer_id = manufacturer_info.manufacturer_id;
            }
    
            // Thêm thông tin sách vào bảng books
            const [bookResult] = await db.query("INSERT INTO books SET ?", book_info);
    
            // Thêm thông tin về bìa sách vào bảng cover_books
            const [coverResult] = await db.query("INSERT INTO cover_books SET ?", cover_info);
    
            // Thêm thông tin về tác giả và sách vào bảng book_authors
            await db.query("INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)", [book_info.book_id, author_id]);
    
            // Thêm thông tin về nhà xuất bản và sách vào bảng book_publishers
            await db.query("INSERT INTO book_publishers (book_id, publisher_id) VALUES (?, ?)", [book_info.book_id, publisher_id]);
    
            // Thêm thông tin về nhà sản xuất và sách vào bảng book_manufacturers
            await db.query("INSERT INTO book_manufacturers (book_id, manufacturer_id) VALUES (?, ?)", [book_info.book_id, manufacturer_id]);
    
            return {
                book: bookResult,
                cover: coverResult,
                author: authorResult || null, 
                publisher: publisherResult || null, 
                manufacturer: manufacturerResult || null 
            };
        } catch (error) {
            throw error;
        }
    }
    

    static async deleteAllAddedData(book_id) {
        try {
            // Xóa thông tin từ bảng book_authors
            await db.query("DELETE FROM book_authors WHERE book_id = ?", [book_id]);
    
            // Xóa thông tin từ bảng book_publishers
            await db.query("DELETE FROM book_publishers WHERE book_id = ?", [book_id]);
    
            // Xóa thông tin từ bảng book_manufacturers
            await db.query("DELETE FROM book_manufacturers WHERE book_id = ?", [book_id]);
    
            // Xóa thông tin từ bảng cover_books
            await db.query("DELETE FROM cover_books WHERE book_id = ?", [book_id]);
            // Xóa thông tin từ bảng books
            await db.query("DELETE FROM books WHERE book_id = ?", [book_id]);
            return `Book_id đã xóa: ${book_id}`
        } catch (error) {
            throw error;
        }
    }

}

module.exports = Book