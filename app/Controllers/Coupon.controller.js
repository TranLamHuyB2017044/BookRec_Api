const User = require('../Model/user.model');
const Coupons = require('../Model/coupon.model');


function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.createUser_Coupon = async (req, res) => {
    const { coupon_percent, date_start, date_end, coupon_name, applying_condition, user_ids, coupon_type } = req.body;
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
        coupon_type
    );

    try {
        await coupon.CreateCoupon()
        for (const user_id of user_ids){
            await Coupons.createUserCoupon(coupon.coupon_id, user_id)
            const user = await User.getUserById(user_id)
            await User.SendCouponEmail(user, coupon)
        }
        res.status(200).json({message: 'Tạo mã coupon thành công !'})
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Có lỗi xảy ra! Vui lòng thử lại' });
    }
}


exports.getAllCoupon = async (req, res) => {
    try {
        const couponList = await Coupons.getAllcoupons()
        res.status(200).json(couponList)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.updateStatusCouponById = async (req, res) => {
    const coupon_id = req.body.coupon_id;
    const update_status = req.body.coupon_status;
    try {
        const updateCoupon = await Coupons.updateStatuscouponsById(coupon_id, update_status)
        res.status(200).json(updateCoupon)
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}


exports.getUserCoupon = async (req, res) => {
    const user_id = req.query.user_id

    try {
        const userCoupons = await Coupons.getUserCoupons(user_id) 
        res.status(200).json(userCoupons)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}