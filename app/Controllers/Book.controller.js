const Book = require('../Model/book.model')
const cloudinary = require("cloudinary").v2;


exports.getAllBooksAndNavigate = async (req, res) => {
    const currentPage = req.query.page || 1
    const itemsPerPage = 20
    const startIndex = (currentPage - 1) * itemsPerPage;
    try {
        const books = await Book.getAllBooksAndNavigate(startIndex, itemsPerPage)
        const countItems = await Book.getCountALLBookQuery()
        const totalItems = countItems[0].total
        const totalPage = Math.ceil(totalItems / itemsPerPage)
        const data = { totalPage: totalPage, currentPage: currentPage, items: books }
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}

exports.getAllBooks = async (req, res) => {
    try {
        const bookList = await Book.getAllBooks()
        res.status(200).json(bookList)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}

exports.getfilterBook = async (req, res) => {
    const { category, rating, price, manufacturer, publisher, author } = req.query;
    let conditions = [];
    const currentPage = req.query.page || 1;
    const itemsPerPage = 20;
    const startIndex = (currentPage - 1) * itemsPerPage;

    try {
        if (category) {
            conditions.push(`category = '${category}'`);

        }

        if (rating) {
            conditions.push(`avg_rating = ${rating}`);
        }

        if (price) {
            const [minPrice, maxPrice] = price.split(',');
            conditions.push(`original_price between ${minPrice} and ${maxPrice}`);
        }

        if (author) {
            // conditions.push(`a.author_id = ${author}`);
            const authors = Array.isArray(author) ? author : [author];
            const authorConditions = authors.map(cat => `a.author_id = '${cat.trim()}'`);
            conditions.push(`(${authorConditions.join(' OR ')})`);
        }

        if (publisher) {
            // conditions.push(`p.publisher_id = ${publisher}`);
            const publishers = Array.isArray(publisher) ? publisher : [publisher];
            const publisherConditions = publishers.map(cat => `p.publisher_id = '${cat.trim()}'`);
            conditions.push(`(${publisherConditions.join(' OR ')})`);
        }

        if (manufacturer) {
            // conditions.push(`m.manufacturer_id = ${manufacturer}`);
            const manufacturers = Array.isArray(manufacturer) ? manufacturer : [manufacturer];
            const manufacturerConditions = manufacturers.map(cat => `m.manufacturer_id = '${cat.trim()}'`);
            conditions.push(`(${manufacturerConditions.join(' OR ')})`);

        }

        if (conditions.length > 0) {
            let query = `AND ${conditions.join(' AND ')}`
            const data = await Book.getFilterBook(query, startIndex, itemsPerPage);
            const countItems = await Book.getCountBookFilterQuery(query);
            const totalItems = countItems[0].total;
            const totalPage = Math.ceil(totalItems / itemsPerPage);
            const pages = { totalPage: totalPage, currentPage: currentPage };
            return res.status(200).json({ data: data[0], pages: pages, query: req.query });
        } else this.getAllBooksAndNavigate(req, res)

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};


exports.getBookById = async (req, res) => {
    const book_id = req.params.slug;
    try {
        const data = await Book.getOneBookByName(book_id)
        res.status(200).json(data[0])
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: error.message })
    }
}

exports.getImageBook = async (req, res) => {
    const book_id = req.params.book_id
    try {
        const data = await Book.getImgBook(book_id)
        res.status(200).json(data[0])
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

exports.AutocompleteSearchBook = async (req, res) => {
    const { title } = req.query;
    try {
        if (title) {
            const data = await Book.searchBookByName(title)
            return res.status(200).json(data[0])
        } else {
            this.getAllBooks(req, res)
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
}

function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



exports.createNewBook = async (req, res) => {
    const book_id = generateRandomNumberWithDigits(7)
    const author_id = generateRandomNumberWithDigits(5)
    const cover_id = generateRandomNumberWithDigits(5)
    const publisher_id = generateRandomNumberWithDigits(5)
    const manufacturer_id = generateRandomNumberWithDigits(5)
    const { title, short_description, original_price, inStock, quantity_sold, category, avg_rating, pages, discount, publication_date, author_name, publisher_name, manufacturer_name } = req.body

    const results = req.files
    const book_info = {
        book_id,
        title,
        short_description,
        original_price,
        inStock,
        quantity_sold,
        category,
        avg_rating,
        pages,
        discount,
        publication_date,
    }
    const author_info = { author_id, author_name }
    const cover_info = { cover_id, thumbnail_url: results[3].path, cover_url_1: results[2].path, cover_url_2: results[1].path, cover_url_3: results[0].path, book_id }
    const publisher_info = { publisher_id, publisher_name }
    const manufacturer_info = { manufacturer_id, manufacturer_name }
    try {
        const data = await Book.createNewBook(book_info, cover_info, author_info, publisher_info, manufacturer_info)
        res.status(200).json(data)
    } catch (error) {
        if (req.files) {
            const cover_id = { thumbnail_url: results[3].filename, cover_url_1: results[2].filename, cover_url_2: results[1].filename, cover_url_3: results[0].filename }
            Object.values(cover_id).forEach(value => {
                cloudinary.uploader.destroy(value)
            })
            res.status(500).json(error.message);
        }
    }


}

exports.deleteBook = async (req, res) => {
    const  book_id  = req.params.slug;
    try {
        const data = await Book.deleteAllAddedData(book_id)
        res.status(200).json({ status: 'success', message: data })
    } catch (error) {
        res.status(500).json(error.message)
    }
}

exports.updateBookAuthorInfo = async (req, res) => {
    const book_id = req.params.book_id
    const author_name = req.body.author_name
    try {
        let author_id = 0
        const existAuthor = await Book.getAuthorId(author_name)
        if(existAuthor.length > 0){
            author_id = existAuthor[0].author_id
            console.log(author_id)
            const authorUpdate = await Book.updateAuthorInfo(book_id, author_id)
            return res.status(200).json({status: 'success', authorUpdate: authorUpdate})
        }else{
            console.log('Them tác giả mới')
            const randomAuthorId = generateRandomNumberWithDigits(5)
            const newAuthor = await Book.AddAuthorInfo(randomAuthorId, author_name)
            author_id = newAuthor.author_id
            const upDateAuthor = await Book.updateAuthorInfo(book_id, author_id)
            return res.status(200).json({status: 'success', authorUpdate: upDateAuthor})

        }
    } catch (error) {
        res.status(404).json({message: error.message})
        console.log(error)
    }
}

