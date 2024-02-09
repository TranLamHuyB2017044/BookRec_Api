const Book = require('../Model/book.model')

exports.getAllBooks = async (req, res) => {
    const currentPage = req.query.page || 1
    const itemsPerPage = 20
    const startIndex = (currentPage - 1) * itemsPerPage;
    try {
        const books = await Book.getAllBooks(startIndex, itemsPerPage)
        const countItems = await Book.getCountALLBookQuery()
        const totalItems = countItems[0].total
        const totalPage = Math.ceil(totalItems/itemsPerPage)
        const data = {totalPage: totalPage, currentPage: currentPage, items: books}
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(404).json({message: error.message})
    }   
}


// exports.getfilterBook = async (req, res) => {
//     const {category, rating, price, manufacturer, publisher, author} = req.query
//     let query = ''
//     const currentPage = req.query.page || 1
//     const itemsPerPage = 20
//     const startIndex = (currentPage-1) * itemsPerPage;
//     try {
//         if(category){
//             // const slug = category.replace(/-/g, ' ')
//             query += ` AND category = '${category}' `
//             console.log(query)
//             const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
//             const countItems = await Book.getCountBookFilterQuery(query)
//             const totalItems = countItems[0].total
//             const totalPage = Math.ceil(totalItems/itemsPerPage)
//             const pages = {totalPage: totalPage, currentPage: currentPage}
//             return res.status(200).json({data:data[0], pages:pages})
            
//         }
//         if(rating){
//             query += ` AND avg_rating = ${rating} `
//             console.log(query)
//             const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
//             const countItems = await Book.getCountBookFilterQuery(query)
//             const totalItems = countItems[0].total
//             const totalPage = Math.ceil(totalItems/itemsPerPage)
//             const pages = {totalPage: totalPage, currentPage: currentPage}
//             return res.status(200).json({data:data[0], pages:pages})
            
//         }
//         if(price){
//             const [minPrice, maxPrice] = price.split(',')
//             query += ` AND original_price between ${minPrice} and ${maxPrice} `
//             const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
//             const countItems = await Book.getCountBookFilterQuery(query)
//             const totalItems = countItems[0].total
//             const totalPage = Math.ceil(totalItems/itemsPerPage)
//             const pages = {totalPage: totalPage, currentPage: currentPage}
//             return res.status(200).json({data:data[0], pages:pages})
            
//         }
//         if(author){
//             query += ` AND a.author_id = ${author} `
//             const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
//             const countItems = await Book.getCountBookFilterQuery(query)
//             const totalItems = countItems[0].total
//             const totalPage = Math.ceil(totalItems/itemsPerPage)
//             const pages = {totalPage: totalPage, currentPage: currentPage}
//             return res.status(200).json({data:data[0], pages:pages})
//         }
//         if(publisher){
//             query += ` AND p.publisher_id = ${publisher} `
//             const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
//             const countItems = await Book.getCountBookFilterQuery(query)
//             const totalItems = countItems[0].total
//             const totalPage = Math.ceil(totalItems/itemsPerPage)
//             const pages = {totalPage: totalPage, currentPage: currentPage}
//             return res.status(200).json({data:data[0], pages:pages})
//         }
//         if(manufacturer){
//             query += ` AND m.manufacturer_id = ${manufacturer} `
//             const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
//             const countItems = await Book.getCountBookFilterQuery(query)
//             const totalItems = countItems[0].total
//             const totalPage = Math.ceil(totalItems/itemsPerPage)
//             const pages = {totalPage: totalPage, currentPage: currentPage}
//             return res.status(200).json({data:data[0], pages:pages})
//         }
//         this.getAllBooks(req, res)
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({message: error.message})
//     }   
// }

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

        if(conditions.length > 0){
            let query = `AND ${conditions.join(' AND ')}`
            const data = await Book.getFilterBook(query, startIndex, itemsPerPage);
            const countItems = await Book.getCountBookFilterQuery(query);
            const totalItems = countItems[0].total;
            const totalPage = Math.ceil(totalItems / itemsPerPage);
            const pages = { totalPage: totalPage, currentPage: currentPage };
            return res.status(200).json({ data: data[0], pages: pages, query:req.query });
        }else this.getAllBooks(req,res)

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
};


// exports.convertStringToSlug = (string) => {
//     return string.trim()
//                 .toLowerCase()
//                 .replace(/\s+/g, '-')
//                 .replace(/[^\w-]/g, '');
// }



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