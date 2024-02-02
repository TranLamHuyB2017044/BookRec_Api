const Book = require('../Model/book.model')

exports.getAllBooks = async (req, res) => {
    const currentPage = req.query.page || 1
    const itemsPerPage = 20
    const startIndex = (currentPage - 1) * itemsPerPage;
    try {
        const books = await Book.getAllBooks(startIndex, itemsPerPage)
        const countItems = await Book.getCountBookQuery()
        const totalItems = countItems[0].total
        const totalPage = Math.ceil(totalItems/itemsPerPage)
        const data = {totalPage: totalPage, currentPage: currentPage, items: books}
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(404).json({message: error.message})
    }   
}


exports.getfilterBook = async (req, res) => {
    const {category, rating, price, manufacturer, publisher, author} = req.query
    let query = ''
    const currentPage = req.query.page || 1
    const itemsPerPage = 20
    const startIndex = (currentPage - 1) * itemsPerPage;
    try {
        if(category){
            const slug = category.replace(/-/g, ' ')
            query += ` AND category = '${slug}' `
            const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
            const totalItems = data[0].length
            const totalPage = Math.ceil(totalItems/itemsPerPage)
            const pages = {totalPage: totalPage, currentPage: currentPage}
            return res.status(200).json({data:data[0], pages:pages})
            
        }
        if(rating){
            const [minRating, maxRating] = rating.split(',')
            query += ` AND avg_rating between ${minRating} and ${maxRating} `
            const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
            const totalItems = data[0].length
            const totalPage = Math.ceil(totalItems/itemsPerPage)
            const pages = {totalPage: totalPage, currentPage: currentPage}
            return res.status(200).json({data:data[0], pages:pages})
            
        }
        if(price){
            const [minPrice, maxPrice] = price.split(',')
            query += ` AND original_price between ${minPrice} and ${maxPrice} `
            const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
            const totalItems = data[0].length
            const totalPage = Math.ceil(totalItems/itemsPerPage)
            const pages = {totalPage: totalPage, currentPage: currentPage}
            return res.status(200).json({data:data[0], pages:pages})
            
        }
        if(author){
            query += ` AND a.author_id = ${author} `
            const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
            const totalItems = data[0].length
            const totalPage = Math.ceil(totalItems/itemsPerPage)
            const pages = {totalPage: totalPage, currentPage: currentPage}
            return res.status(200).json({data:data[0], pages:pages})
        }
        if(publisher){
            query += ` AND p.publisher_id = ${publisher} `
            const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
            const totalItems = data[0].length
            const totalPage = Math.ceil(totalItems/itemsPerPage)
            const pages = {totalPage: totalPage, currentPage: currentPage}
            return res.status(200).json({data:data[0], pages:pages})
        }
        if(manufacturer){
            query += ` AND m.manufacturer_id = ${manufacturer} `
            const data = await Book.getFilterBook(query, startIndex, itemsPerPage)
            const totalItems = data[0].length
            const totalPage = Math.ceil(totalItems/itemsPerPage)
            const pages = {totalPage: totalPage, currentPage: currentPage}
            return res.status(200).json({data:data[0], pages:pages})
        }
        this.getAllBooks(req, res)
    } catch (error) {
        console.log(error)
        res.status(404).json({message: error.message})
    }   
}