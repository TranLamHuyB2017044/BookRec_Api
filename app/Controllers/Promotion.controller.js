const Book = require('../Model/book.model');
const Promotions = require('../Model/promotion.model');


function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.createBook_Promotion = async (req, res) => {
    const { type_promotion, value, date_start, date_end, promotion_name, category_name, book_ids } = req.body;
    const currentDate = new Date();

    let promotion_status; 
    if (new Date(date_start) > currentDate) {
        promotion_status = 'Chưa áp dụng';
    } else if (new Date(date_end) < currentDate) {
        promotion_status = 'Ngừng áp dụng';
    } else {
        promotion_status = 'Đang áp dụng';
    }
    const promotion = new Promotions(
        generateRandomNumberWithDigits(5),
        promotion_name,
        value,
        date_start,
        date_end,
        promotion_status 
    );
    const createPromotionsForBooks = async (bookIds) => {
        await promotion.CreatePromotion();
        for (const bookId of bookIds) {
            await Promotions.createBookPromotion(promotion.promotion_id, bookId);
        }
    };

    try {
        if (type_promotion === 'all') {
            const BookIdArray = await Book.getAllBooksId();
            const allBookId = BookIdArray.map(id => id.book_id);
            await createPromotionsForBooks(allBookId);
            res.status(200).json({ message: 'Tạo mã khuyến mãi thành công' });
        } else if (type_promotion === 'book') {
            await createPromotionsForBooks(book_ids);
            res.status(200).json({ message: 'Tạo mã khuyến mãi thành công' });
        } else {
            const BookIdArray = await Book.getBooksIdByCategory(category_name);
            const categoryBookId = BookIdArray.map(id => id.book_id);
            await createPromotionsForBooks(categoryBookId);
            res.status(200).json({ message: `Tạo mã khuyến mãi theo danh mục ${category_name} thành công` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Có lỗi xảy ra! Vui lòng thử lại' });
    }
}

exports.getAllPromotions = async (req, res) => {
    try {
        const promotionList = await Promotions.getAllPromotions()
        res.status(200).json(promotionList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}