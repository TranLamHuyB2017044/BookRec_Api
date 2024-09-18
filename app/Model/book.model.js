const db = require('../config/db');

class Book {
    constructor(BookDetails) {
        this.book_id = BookDetails.book_id
        this.title = BookDetails.title
        this.thumbnail_url = BookDetails.thumbnail_url
        this.short_description = BookDetails.short_description
        this.original_price = BookDetails.original_price
        this.inStock = BookDetails.inStock
        this.quantity_sold = BookDetails.quantity_sold
        this.category = BookDetails.category
        this.avg_rating = BookDetails.avg_rating
        this.pages = BookDetails.pages
        this.publication_date = BookDetails.publication_date
        this.created_at = BookDetails.created_at
    }

    static async getAllBooksAndNavigate(startIndex, itemsPerPage) {
        const promotion_book_query = ' LEFT JOIN book_promotions bp ON b.book_id = bp.book_id';
        const promotion_query = ' LEFT JOIN promotions p ON bp.promotion_id = p.promotion_id';
        const query = `
            SELECT b.book_id, b.thumbnail_url, b.title, b.quantity_sold, b.avg_rating, b.original_price, p.promotion_percent, p.promotion_status
            FROM books b
            ${promotion_book_query}
            ${promotion_query}
            LIMIT ${startIndex}, ${itemsPerPage}
        `;
        const result = await db.query(query);
        return result[0];
    }
    
    // static async getAllBooksAndNavigate(startIndex, itemsPerPage) {
    //     const promotion_book_query = ' left Join book_promotions bp on b.book_id = bp.book_id'
    //     const promotion_query = ' left Join promotions p on bp.promotion_id = p.promotion_id'
    //     const query = `SELECT b.book_id, b.title, b.quantity_sold, b.avg_rating, b.original_price, c.thumbnail_url, p.promotion_percent, p.promotion_status FROM books b left join cover_books c on b.book_id  = c.book_id  ${promotion_book_query} ${promotion_query} LIMIT ${startIndex}, ${itemsPerPage}`
    //     const result = await db.query(query)
    //     return result[0]
    // }

    static async getAllBooks() {
        const promotion_book_query = ' left Join book_promotions bp on b.book_id = bp.book_id'
        const promotion_query = ' left Join promotions p on bp.promotion_id = p.promotion_id'
        const query = `SELECT b.book_id, title, original_price, inStock, p.promotion_percent, p.promotion_status FROM books b ${promotion_book_query} ${promotion_query}`
        const result = await db.query(query)
        return result[0]
    }

    static async getAllBooksId() {
        const query = `SELECT book_id FROM books `
        const result = await db.query(query)
        return result[0]
    }

    static async getBooksIdByCategory(book_category) {
        const query = `SELECT book_id FROM books where category ='${book_category}'`
        const result = await db.query(query)
        return result[0]
    }

    static async getBooksCategory() {
        const query = `SELECT DISTINCT category FROM books ;`
        const result = await db.query(query)
        return result[0]
    }

    static async categoryExists(category_name) {
        const query = `SELECT COUNT(book_id) as count FROM books WHERE category = '${category_name}' `
        const result = await db.query(query);
        console.log(result[0], query)
        return result[0][0].count > 0;
    }

    static async getCountALLBookQuery() {
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
        const countQuery = `SELECT count(b.book_id) as total from books b ${cover_book_query} `
        const countResult = await db.query(countQuery)
        const data = countResult[0]
        return data
    }

    static async getCountBookFilterQuery(condition) {
        const authorQuery = 'left Join book_authors ba on b.book_id = ba.book_id left join authors a on ba.author_id = a.author_id'
        const publisherQuery = 'left Join book_publishers bp on b.book_id = bp.book_id left join publishers p on bp.publisher_id = p.publisher_id'
        const manufacturerQuery = 'left Join book_manufacturers bm on b.book_id = bm.book_id left join manufacturer m on bm.manufacturer_id = m.manufacturer_id'
        const cover_book_query = 'left Join cover_books c on b.book_id = c.book_id'
        const countQuey = `SELECT count(*) as total from books b ${cover_book_query} ${authorQuery} ${publisherQuery} ${manufacturerQuery}  where 1=1 ${condition} `
        const countResults = await db.query(countQuey)
        const data = countResults[0]
        return data

    }

    static async getFilterBook(condition, startIndex, itemsPerPage) {
        const promotion_book_query = ' left Join book_promotions bpr on b.book_id = bpr.book_id left Join promotions pr on bpr.promotion_id = pr.promotion_id'
        const authorQuery = ' left Join book_authors ba on b.book_id = ba.book_id left join authors a on ba.author_id = a.author_id'
        const publisherQuery = ' left Join book_publishers bp on b.book_id = bp.book_id left join publishers p on bp.publisher_id = p.publisher_id'
        const manufacturerQuery = ' left Join book_manufacturers bm on b.book_id = bm.book_id left join manufacturer m on bm.manufacturer_id = m.manufacturer_id'
        let query = `SELECT distinct b.book_id, b.title, b.quantity_sold, b.avg_rating, b.original_price, b.thumbnail_url, pr.promotion_percent, pr.promotion_status FROM books b   ${authorQuery} ${publisherQuery} ${manufacturerQuery} ${promotion_book_query}  where 1=1 ${condition}`
        query += ` LIMIT ${startIndex}, ${itemsPerPage}`;
        const filterResult = await db.query(query)
        return filterResult
    }
    // static async getFilterBook(condition, startIndex, itemsPerPage) {
    //     const promotion_book_query = ' left Join book_promotions bpr on b.book_id = bpr.book_id left Join promotions pr on bpr.promotion_id = pr.promotion_id'
    //     const authorQuery = ' left Join book_authors ba on b.book_id = ba.book_id left join authors a on ba.author_id = a.author_id'
    //     const publisherQuery = ' left Join book_publishers bp on b.book_id = bp.book_id left join publishers p on bp.publisher_id = p.publisher_id'
    //     const manufacturerQuery = ' left Join book_manufacturers bm on b.book_id = bm.book_id left join manufacturer m on bm.manufacturer_id = m.manufacturer_id'
    //     const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
    //     let query = `SELECT distinct b.book_id, b.title, b.quantity_sold, b.avg_rating, b.original_price, c.thumbnail_url, pr.promotion_percent, pr.promotion_status FROM books b ${cover_book_query}  ${authorQuery} ${publisherQuery} ${manufacturerQuery} ${promotion_book_query}  where 1=1 ${condition}`
    //     query += ` LIMIT ${startIndex}, ${itemsPerPage}`;
    //     const filterResult = await db.query(query)
    //     return filterResult
    // }


    // static async getOneBookByName(id) {
    //     const bookSelectQuery = `
    //         b.book_id, 
    //         title, 
    //         thumbnail_url,
    //         short_description, 
    //         original_price, 
    //         inStock, 
    //         quantity_sold, 
    //         category, 
    //         avg_rating, 
    //         pages, 
    //         publication_date, 
    //         created_at
    //     `
    //     const authorSelectQuery = `(
    //         SELECT JSON_ARRAYAGG(a.author_name) 
    //         FROM book_authors ba
    //         LEFT JOIN authors a ON ba.author_id = a.author_id
    //         WHERE ba.book_id = b.book_id
    //     ) as authors`
    
    //     const publisherSelectQuery = `p.publisher_name`
    //     const manufacturerSelectQuery = `m.manufacturer_name`
    //     const coverSelectQuery = `JSON_ARRAYAGG(c.url) as cover_urls`
    //     const promotionSelectQuery = `pr.promotion_percent`
    
    //     const promotion_book_query = `LEFT JOIN book_promotions bpr ON b.book_id = bpr.book_id`
    //     const promotion_query = `LEFT JOIN promotions pr ON bpr.promotion_id = pr.promotion_id`
    //     const publisherQuery = `
    //         LEFT JOIN book_publishers bp ON b.book_id = bp.book_id 
    //         LEFT JOIN publishers p ON bp.publisher_id = p.publisher_id
    //     `
    //     const manufacturerQuery = `
    //         LEFT JOIN book_manufacturers bm ON b.book_id = bm.book_id 
    //         LEFT JOIN manufacturer m ON bm.manufacturer_id = m.manufacturer_id
    //     `
    //     const cover_book_query = `LEFT JOIN cover_images_book c ON b.book_id = c.book_id`
    
    //     const query = `
    //         SELECT ${bookSelectQuery}, 
    //                ${authorSelectQuery}, 
    //                ${publisherSelectQuery}, 
    //                ${manufacturerSelectQuery}, 
    //                ${coverSelectQuery}, 
    //                ${promotionSelectQuery}
    //         FROM books b
    //         ${cover_book_query}
    //         ${publisherQuery}
    //         ${manufacturerQuery}
    //         ${promotion_book_query}
    //         ${promotion_query}
    //         WHERE b.book_id = ${id}
    //         GROUP BY b.book_id, 
    //                  b.title, 
    //                  b.thumbnail_url,
    //                  b.short_description, 
    //                  b.original_price, 
    //                  b.inStock, 
    //                  b.quantity_sold, 
    //                  b.category, 
    //                  b.avg_rating, 
    //                  b.pages, 
    //                  b.publication_date, 
    //                  b.created_at, 
    //                  p.publisher_name, 
    //                  m.manufacturer_name, 
    //                  pr.promotion_percent
    //     `
    
    //     const result = await db.query(query)
    //     return result[0]
    // }
    
    
    static async getOneBookByName(id) {
        const bookSelectQuery = 'b.book_id, title, short_description, original_price, inStock, quantity_sold, category, avg_rating, pages, publication_date, created_at'
        const authorSelectQuery = 'a.author_name'
        const publisherSelectQuery = 'publisher_name'
        const manufacturerSelectQuery = 'manufacturer_name'
        const coverSelectQuery = 'b.thumbnail_url, cover_url_1, cover_url_2, cover_url_3'
        const promotionSelectQuery = 'promotion_percent'
        const promotion_book_query = ' left Join book_promotions bpr on b.book_id = bpr.book_id'
        const promotion_query = ' left Join promotions pr on bpr.promotion_id = pr.promotion_id'
        const authorQuery = ' left Join book_authors ba on b.book_id = ba.book_id left join authors a on ba.author_id = a.author_id'
        const publisherQuery = ' left Join book_publishers bp on b.book_id = bp.book_id left join publishers p on bp.publisher_id = p.publisher_id'
        const manufacturerQuery = ' left Join book_manufacturers bm on b.book_id = bm.book_id left join manufacturer m on bm.manufacturer_id = m.manufacturer_id'
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
        const query = `SELECT ${bookSelectQuery}, ${authorSelectQuery}, ${publisherSelectQuery}, ${manufacturerSelectQuery}, ${coverSelectQuery}, ${promotionSelectQuery} FROM books b ${cover_book_query}  ${authorQuery} ${publisherQuery} ${manufacturerQuery} ${promotion_book_query} ${promotion_query} where b.book_id = ${id} `
        const result = db.query(query)
        return result
    }

    static async getBookById(book_id) {
        const query = `SELECT * FROM books where book_id = ${book_id}`
        const result = await db.query(query)
        return result[0]
    }


    static async searchBookByName(book_title) {
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
        const promotion_book_query = ' left Join book_promotions bp on b.book_id = bp.book_id'
        const promotion_query = ' left Join promotions p on bp.promotion_id = p.promotion_id'
        const query = `SELECT distinct p.promotion_percent, p.promotion_status, b.book_id, title, original_price, inStock, c.thumbnail_url FROM books b ${cover_book_query} ${promotion_book_query} ${promotion_query} where title like '%${book_title}%' `
        const result = await db.query(query)
        return result[0]
    }

    static async checkExistBook(book_title) {
        const query = `SELECT book_id, title, inStock FROM books where title = ?`
        const result = await db.query(query, book_title)
        return result[0]
    }

    static async checkExistPublisher(publisher_name) {
        const query = `SELECT * from publishers where publisher_name = ?`
        const result = await db.query(query, [publisher_name])
        return result[0]
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


    static async createNewBookWithoutMedia(book_info, author_info, publisher_info, manufacturer_info) {
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

            // Thêm thông tin về tác giả và sách vào bảng book_authors
            await db.query("INSERT INTO book_authors (book_id, author_id) VALUES (?, ?)", [book_info.book_id, author_id]);

            // Thêm thông tin về nhà xuất bản và sách vào bảng book_publishers
            await db.query("INSERT INTO book_publishers (book_id, publisher_id) VALUES (?, ?)", [book_info.book_id, publisher_id]);

            // Thêm thông tin về nhà sản xuất và sách vào bảng book_manufacturers
            await db.query("INSERT INTO book_manufacturers (book_id, manufacturer_id) VALUES (?, ?)", [book_info.book_id, manufacturer_id]);

            return {
                book: bookResult,
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

    static async updateBook(updateData, book_id) {
        const updateQuery = `title = '${updateData.title}', short_description = '${updateData.short_description}', original_price = ${updateData.original_price}, inStock = ${updateData.inStock}, quantity_sold = ${updateData.quantity_sold}, category = '${updateData.category}', avg_rating = ${updateData.avg_rating}, pages = ${updateData.pages}`
        const updateBookQuery = `update books set ${updateQuery}  where book_id = ${book_id}`
        await db.query(updateBookQuery)
        return {
            book_id: book_id,
            newData: updateData
        }
    }

    static async updateQuantityBook(inStock, quantity_sold, book_id) {
        const updateQuery = ` inStock = ?, quantity_sold = ? `
        const updateBookQuery = `update books set ${updateQuery}  where book_id = ${book_id} `
        const data = await db.query(updateBookQuery, [inStock, quantity_sold])
        return data[0]
    }

    static async updateInstock(inStock, book_id) {
        const updateQuery = ` inStock = ? `
        const updateBookQuery = `update books set ${updateQuery}  where book_id = ${book_id} `
        const data = await db.query(updateBookQuery, [inStock])
        return data[0]
    }

    static async getAuthorId(author_name) {
        const query = `select author_id from authors where author_name = '${author_name}'`
        const data = await db.query(query)
        return data[0]
    }

    static async getBookAuthorInfo(book_id) {
        const query = `select * from book_authors where book_id = '${book_id}'`
        const data = await db.query(query)
        return data[0]
    }
    static async updateAuthorBookInfo(author_id, book_id) {
        const query = `update book_authors set author_id = ${author_id} where book_id = ${book_id}`
        const data = await db.query(query)
        return data[0]
    }

    static async AddAuthorInfo(author_id, author_name) {
        const query = `INSERT INTO authors  (author_id, author_name) values (?, ?) `
        await db.query(query, [author_id, author_name])
        return {
            author_id: author_id,
            author_name: author_name
        }
    }

    static async AddBookAuthors(book_id, author_id) {
        const query = `INSERT INTO book_authors  (book_id, author_id) values (?, ?) `
        const data = await db.query(query, [book_id, author_id]);
        return data[0]

    }

    static async getImgBook(book_id) {
        const query = `SELECT * from cover_books where book_id = '${book_id}'`
        const result = await db.query(query)
        return result[0]
    }


    static async updateImageBook(book_id, book_cover) {
        const updateImageBookQuery = `UPDATE cover_books SET thumbnail_url = ?, cover_url_1 = ?, cover_url_2 = ?, cover_url_3 = ? WHERE book_id = ${book_id}; `
        const data = await db.query(updateImageBookQuery, [book_cover.thumbnail_url, book_cover.cover_url_1, book_cover.cover_url_2, book_cover.cover_url_3])
        return data
    }

    static async addImageBook(cover_id, book_cover, book_id) {
        const query = `INSERT INTO cover_books (cover_id, thumbnail_url, cover_url_1, cover_url_2, cover_url_3, book_id) values (?, ?, ?, ?, ?, ?)`
        const data = await db.query(query, [cover_id, book_cover.thumbnail_url, book_cover.cover_url_1, book_cover.cover_url_2, book_cover.cover_url_3, book_id])
        return data
    }
}

module.exports = Book