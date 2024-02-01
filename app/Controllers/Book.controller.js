const Book = require('../Model/book.model')

exports.getAllBooks = async (req, res) => {
    try {
        const currentPage = req.query.page || 1
        const itemsPerPage = 20
        const startIndex = (currentPage - 1) * itemsPerPage;
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


exports.getCategory = async (req, res) => {
    try {
        
        const data = await Book.getBookQuery()
        

        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(404).json({message: error.message})
    }   
}