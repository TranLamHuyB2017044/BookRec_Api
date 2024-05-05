const { bookPurchase, bookPurchaseDetails } = require('../Model/purchaseBook.model')
const Book = require('./Book.controller')
const BookModel = require('../Model/book.model')


function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.CreatePurchaseOrder = async (req, res) => {
    try {
        const purchaseInfo = {
            purchase_id: generateRandomNumberWithDigits(5),
            publisher_id: req.body.publisher_id,
            user_id: req.body.user_id
        }
        const purchaseDetailInfo = {
            book_detail_id: req.body.purchase_detail_id,
            purchase_id: purchaseInfo.purchase_id,
            book_id: req.body.book_id,
            quantity_ordered: req.body.quantity_ordered,
            unit_price: req.body.unit_price
        }
        const createPurchaseOrder = await bookPurchase.CreateBookPurchase(purchaseDetailInfo)
        const createPurchaseDetails = await bookPurchaseDetails.CreateBookPurchase(purchaseDetailInfo)
        
        res.status(200).json()
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}