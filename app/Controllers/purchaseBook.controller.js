const { bookPurchase, bookPurchaseDetails } = require('../Model/purchaseBook.model')
const BookModel = require('../Model/book.model')
const cloudinary = require("cloudinary").v2;


function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.CreatePurchaseOrder = async (req, res) => {
    const db = require('../config/db');
    const connection = await db.getConnection();
    try {
        const { user_id } = req.params;
        let books = req.body;

        if (!Array.isArray(books)) {
            books = [books];
        }

        const purchase_info = {
            purchase_id: generateRandomNumberWithDigits(5),
            user_id: parseInt(user_id),
        };

        await connection.beginTransaction();

        await connection.query('INSERT INTO book_purchase SET ?', [purchase_info]);

        for (const bookData of books) {
            let book_id = generateRandomNumberWithDigits(7);
            const { title, short_description, original_price, inStock, category, pages, publication_date, author_name, publisher_name, manufacturer_name } = bookData;

            const book_info = { book_id, title, short_description, original_price, inStock, quantity_sold: 0, category, avg_rating: 0, pages, publication_date };

            const author_id = generateRandomNumberWithDigits(5);
            const author_info = { author_id, author_name };
            let publisher_id = generateRandomNumberWithDigits(5);
            const publisher_info = { publisher_id, publisher_name };
            const manufacturer_id = generateRandomNumberWithDigits(5);
            const manufacturer_info = { manufacturer_id, manufacturer_name };

            const [bookExist] = await connection.query('SELECT * FROM books WHERE title = ?', [title]);
            const [publisherExist] = await connection.query('SELECT * FROM publishers WHERE publisher_name = ?', [publisher_name]);
            if (publisherExist.length > 0) {
                publisher_id = publisherExist[0].publisher_id;
            }
            if (bookExist.length > 0) {
                book_id = bookExist[0].book_id;
                const newInStock = bookExist[0].inStock + parseInt(inStock);
                await connection.query('UPDATE books SET inStock = ? WHERE book_id = ?', [newInStock, book_id]);
            } 
            else {
                await connection.query('INSERT INTO books SET ?', [book_info]);
                await connection.query('INSERT INTO authors SET ?', [author_info]);
                
                await connection.query('INSERT INTO publishers SET ?', [publisher_info]);
                await connection.query('INSERT INTO manufacturer SET ?', [manufacturer_info]);
            }

            const detailInfo = {
                purchase_detail_id: generateRandomNumberWithDigits(5),
                purchase_id: purchase_info.purchase_id,
                book_id: book_id,
                quantity_ordered: parseInt(inStock),
                unit_price: parseInt(original_price),
                publisher_id: publisher_id,
            };

            await connection.query('INSERT INTO book_purchase_detail SET ?', [detailInfo]);
        }

        await connection.commit();

        res.status(200).json({ success: true, message: 'Hóa đơn mua hàng được tạo thành công' });
    } catch (error) {
        await connection.rollback();
        console.error('Lỗi khi tạo hóa đơn:', error);
        res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi tạo hóa đơn mua hàng', error: error.message });
    } finally {
        connection.release();
    }
};


exports.GetAllPurchaseOrders = async (req, res) => {
    try {
        const AllPurchaseOrders = await bookPurchase.getAllOrdersPurchase();
        const purchase_id = AllPurchaseOrders.map(order => order.purchase_id);

        const PurchaseDetail = await bookPurchaseDetails.getAllPurchaseDetail(purchase_id);
        const PurchaseDetailMap = {};
        PurchaseDetail.forEach(detail => {
            const id = detail.purchase_id;
            if (!PurchaseDetailMap[id]) PurchaseDetailMap[id] = [];
            PurchaseDetailMap[id].push(detail);
        });

        const data = AllPurchaseOrders.map(order => ({
            ...order,
            items: PurchaseDetailMap[order.purchase_id] || [],
        }));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch purchase orders',
            error: error.message,
            stack: error.stack,
        });
    }
};


exports.getTotalMountSpent = async (req, res) => {
    try {
        const typeFilter = req.query.type;
        const data = await bookPurchaseDetails.getTotalAmountSpent(typeFilter)
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error.message);
        
    }
}

exports.getMonthlyStatistics = async (req, res) => {
    try {
        const data = await bookPurchaseDetails.getMonthlyRevenueAndExpenseQuery();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};