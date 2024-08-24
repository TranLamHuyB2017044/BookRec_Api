const {updateStatusPromotion} = require('./Promotion.controller')
const cron = require('node-cron');


cron.schedule('0 0 * * *', () => {
    console.log('Đang chạy tác vụ theo lịch để cập nhật trạng thái khuyến mãi...');
    updateStatusPromotion();
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh" 
});
