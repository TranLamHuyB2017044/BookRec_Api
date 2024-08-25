const User = require('../Model/user.model');
const Coupons = require('../Model/coupon.model');


function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.createUser_Coupon = async (req, res) => {
    const { coupon_percent, date_start, date_end, coupon_name, applying_condition, user_ids } = req.body;
    const currentDate = new Date();

    let coupon_status;
    if (new Date(date_start) > currentDate) {
        coupon_status = 'Chưa áp dụng';
    } else if (new Date(date_end) < currentDate) {
        coupon_status = 'Ngừng áp dụng';
    } else {
        coupon_status = 'Đang áp dụng';
    }

    const coupon = new Coupons(
        generateRandomNumberWithDigits(5),
        coupon_name,
        coupon_percent,
        date_start,
        date_end,
        coupon_status,
        applying_condition,
    );

    try {
        await coupon.CreateCoupon()
        for (const user_id of user_ids){
            await Coupons.createUserCoupon(coupon.coupon_id, user_id)
        }
        res.status(200).json({message: 'Tạo mã coupon thành công !'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra! Vui lòng thử lại' });
    }
}


