const { bookPurchase, bookPurchaseDetails } = require('../Model/purchaseBook.model')
const BookModel = require('../Model/book.model')
const cloudinary = require("cloudinary").v2;


function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.CreatePurchaseOrder = async (req, res) => {
    try {
        const { user_id } = req.params;
        const books = req.body;
        const purchase_info = {
            purchase_id: generateRandomNumberWithDigits(5),
            user_id: parseInt(user_id)
        };
        
        await bookPurchase.CreateBookPurchase(purchase_info);
        for (const bookData of books) {
            const book_id = generateRandomNumberWithDigits(7);
            const { title, short_description, original_price, inStock, quantity_sold, category, avg_rating, pages, discount, publication_date, author_name, publisher_name, manufacturer_name } = bookData;
            const book_info = { book_id, title, short_description, original_price: original_price + original_price * 0.1, inStock, quantity_sold, category, avg_rating, pages, discount, publication_date };

            // Tạo thông tin tác giả, nhà xuất bản, nhà sản xuất
            const author_id = generateRandomNumberWithDigits(5);
            const author_info = { author_id, author_name };
            const publisher_id = generateRandomNumberWithDigits(5);
            const publisher_info = { publisher_id, publisher_name };
            const manufacturer_id = generateRandomNumberWithDigits(5);
            const manufacturer_info = { manufacturer_id, manufacturer_name };

            // Tạo thông tin chi tiết đơn hàng mua
            const detailInfo = {
                purchase_detail_id: generateRandomNumberWithDigits(5),
                purchase_id: purchase_info.purchase_id,
                book_id: book_id,
                quantity_ordered: inStock,
                unit_price: original_price,
                publisher_id: publisher_id,
            };
            const bookExist = await BookModel.checkExistBook(title);
            if (bookExist.length > 0) {
                await BookModel.updateInstock(bookExist[0].inStock, book_id);
            } else {
                await BookModel.createNewBookWithoutMedia(book_info,  author_info, publisher_info, manufacturer_info);
                await bookPurchaseDetails.createPurchaseDetail(detailInfo);
            }
        }
        res.status(200).json({ success: true, message: 'Hóa đơn mua hàng được tạo thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi tạo hóa đơn mua hàng' });
    }
};

exports.GetAllPurchaseOrders = async (req, res) => {
    try {
        const AllPurchaseOrders = await bookPurchase.getAllOrdersPurchase()
        const purchase_id = AllPurchaseOrders.map(order => order.purchase_id)
        const PurchaseDetail = await bookPurchaseDetails.getAllPurchaseDetail(purchase_id)
        const data = AllPurchaseOrders.map((item, id) => {
            return {
                ...item,
                items: PurchaseDetail[id],
            }

        })

        res.status(200).json(data)
    } catch (error) {
        res.status(404).json(error.message);
    }
}