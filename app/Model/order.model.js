
const db = require('../config/db')
const nodemailer = require('nodemailer');
class Order {
    constructor(order) {
        this.order_id = order.order_id,
            this.user_id = order.user_id,
            this.customer_name = order.customer_name
        this.address = order.address,
            this.phone = order.phone || '',
            this.shipping_method = order.shipping_method,
            this.payment_method = order.payment_method,
            this.total_price = order.total_price,
            this.payment_status = order.payment_status
    }
    createUserOrder() {
        const orderInfo = {
            order_id: this.order_id,
            user_id: this.user_id,
            customer_name: this.customer_name,
            address: this.address,
            phone: this.phone,
            shipping_method: this.shipping_method,
            payment_method: this.payment_method,
            total_price: this.total_price
        }
        const data = db.query(`insert into orders set ?`, orderInfo)
        return data
    }

    static async getAllOrders() {
        const query = `select * from orders `
        const data = await db.query(query)
        return data[0]
    }
    static async getOrdersById(order_id) {
        const query = `select * from orders where order_id = ?`
        const data = await db.query(query, order_id)
        return data[0]
    }

    static async getAllUserOrders(user_id) {
        const query = `select * from orders where user_id = ? `
        const data = await db.query(query, user_id)
        return data[0]
    }

    static async sendVerifyEmail(info) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "tlhuy02@gmail.com",
                pass: process.env.MailPass,
            },
        })
        const mailOptions = {
            from: '"BookRec" <tlhuy02@gmail.com>',
            to: info.email,
            subject: 'Xác nhận đơn hàng !!',
            html: `<p> Hello 👋 ${info.customer_name}, Cảm ơn bạn đã đặt hàng tại công ty chúng tôi
                <div>Bạn có thể theo dõi đơn hàng của bạn trên website <a href='http://localhost:3000/yourOrders'>Tại đây</a> </div>
                <div>
                    <h3>Thông tin đơn hàng:</h3>
                    <p>Tên khách hàng: ${info.customer_name}</p>
                    <p>Ngày đặt: ${info.order_date}</p>
                    <p>Tổng cộng: ${(info.total)} vnđ</p>
                </div>
                <strong>Địa chỉ giao hàng: ${info.address}</strong>
                <p>Chúng tôi hi vọng bạn có trãi nghiệm mua sắm tuyệt vời tại website và bạn sẽ quay lại trong những lần tiếp theo.</p>

                <p>Mọi thắc mắc xin đừng ngần ngại liên hệ qua sđt: 0939419860 hoặc phản hồi email này.</p>

                <strong>Tiếp tục mua sắm tại <a href='http://localhost:3000/collections'>BookRec</a></strong>
            `
        }
        transporter.sendMail(mailOptions)
    }

    static async updateStatusOrder(orderId, status) {
        const query = `update orders set payment_status = '${status}' where order_id = ${orderId} `
        const data = await db.query(query)
        return data[0]
    }

    static async cancelStatusOrder(orderId) {
        const query = `update orders set payment_status = 'Đã hủy' where order_id = ${orderId} `
        const data = await db.query(query)
        return data[0]
    }


    static async getStatisticsOrderToday() {
        const query = `SELECT DATE(order_date) AS ngay, COUNT(*) AS tong_so_don, SUM(total_price) AS tong_doanh_thu FROM orders WHERE DATE(order_date) = CURDATE() and payment_status = 'Đã giao' GROUP BY DATE(order_date)`
        const data = await db.query(query)
        return data[0]
    }

    static async getStatisticsOrderThisMonth() {
        const query = `SELECT 
            COUNT(*) AS tong_so_don, 
            SUM(total_price) AS tong_doanh_thu
        FROM 
            orders
        WHERE 
            payment_status = 'Đã giao' 
            AND YEAR(order_date) = YEAR(CURDATE()) 
            AND MONTH(order_date) = MONTH(CURDATE())`
        const data = await db.query(query)
        return data[0]
    }

    static async getCountOrderThisMonth() {
        const query = `
            WITH filtered_orders AS (
                SELECT * 
                FROM orders 
                WHERE YEAR(order_date) = YEAR(CURDATE()) 
                  AND MONTH(order_date) = MONTH(CURDATE())
            )
            SELECT 
                (SELECT COUNT(*) FROM filtered_orders) AS tong_so_don,
                (SELECT COUNT(*) FROM filtered_orders WHERE payment_status = 'Đã giao') AS so_don_da_giao,
                (SELECT COUNT(*) FROM filtered_orders WHERE payment_status = 'Đã hủy') AS so_don_da_huy,
                (SELECT SUM(total_price) FROM filtered_orders WHERE payment_status = 'Đã giao') AS tong_doanh_thu,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'ten_sach', book_stats.ten_sach,
                            'so_luong_da_ban', book_stats.so_luong_da_ban,
                            'tong_gia_tien', book_stats.tong_gia_tien
                        )
                    ), 
                    JSON_ARRAY()
                ) AS danh_sach_sach
            FROM (
                SELECT 
                    b.title AS ten_sach,
                    SUM(oi.quantity) AS so_luong_da_ban,
                    SUM(oi.quantity * b.original_price) AS tong_gia_tien
                FROM 
                    orderitems oi
                INNER JOIN 
                    filtered_orders o ON oi.order_id = o.order_id
                INNER JOIN 
                    books b ON oi.book_id = b.book_id
                WHERE 
                    o.payment_status = 'Đã giao'
                GROUP BY 
                    b.title
            ) AS book_stats;
        `;
        try {
            const data = await db.query(query);
            if (!data || data.length === 0) {
                return {
                    tong_so_don: 0,
                    so_don_da_giao: 0,
                    so_don_da_huy: 0,
                    tong_doanh_thu: 0,
                    danh_sach_sach: []
                };
            }
    
            return data[0];
        } catch (error) {
            console.error('Lỗi khi thực hiện truy vấn:', error);
            throw new Error('Không thể lấy dữ liệu thống kê');
        }
    }
    


    static async getBestSellerBooks() {
        const selectOption = `b.book_id, b.title, MAX(cv.thumbnail_url) AS thumbnail_url,b.original_price, SUM(ot.quantity) AS so_luong_ban`
        const orderItemsQuery = `JOIN orderitems ot ON od.order_id = ot.order_id `
        const bookQuery = `JOIN books b ON ot.book_id = b.book_id `
        const coverBookQuery = `JOIN cover_books cv ON b.book_id = cv.book_id`
        const groupByQuery = `GROUP BY b.book_id, b.title, b.original_price, b.quantity_sold `
        const conditonQuery = `Where od.payment_status = 'Đã thanh toán' `
        const query = `SELECT ${selectOption} FROM orders od ${orderItemsQuery} ${bookQuery} ${coverBookQuery} ${conditonQuery} ${groupByQuery} ORDER BY so_luong_ban DESC LIMIT 5;`
        const data = await db.query(query)
        return data[0]
    }


    static async StatisticsOrder7DayAgo() {
        const query = `SELECT 
        ROW_NUMBER() OVER () AS id,
        date_range.date AS ngay,
        COALESCE(COUNT(orders.order_id), 0) AS so_luong_don_hang,
        COALESCE(SUM(orders.total_price), 0) AS tong_so_tien
        FROM 
            (
                SELECT 
                    ROW_NUMBER() OVER () AS a, 
                    DATE_SUB(CURDATE(), INTERVAL (a.a) DAY) AS date
                FROM 
                    (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6) AS a
            ) AS date_range 
        LEFT JOIN 
            orders ON DATE(orders.order_date) = date_range.date - 1 AND orders.payment_status = 'Đã thanh toán'
        GROUP BY 
            date_range.date 
        ORDER BY 
            date_range.date;`
        const data = await db.query(query)
        return data
    }
}


class OrderItem extends Order {
    constructor(items) {
        super(order_id),
            this.item_id = items.item_id,
            this.book_id = items.book_id,
            this.quantity = items.quantity
    }

    static async addOrderItems(orderItemsValues) {
        orderItemsValues.map(items => {
            const query = `insert into orderitems (item_id, order_id, book_id, quantity) values (${items}) `
            db.query(query)
            return {
                status: 'Create Order successfully',
            }
        })
    }


    static async getAllOrderItems(orderIds) {
        const promises = orderIds.map(orderId => {
            const promotion_book_query = ' left Join book_promotions bp on b.book_id = bp.book_id left Join promotions p on bp.promotion_id = p.promotion_id'
            const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
            const book_query = ' left Join books b on b.book_id = ot.book_id'
            const selectQuery = `c.thumbnail_url, b.title, b.original_price, ot.quantity, p.promotion_percent`
            const Query = `select ${selectQuery}  from orderitems ot ${book_query} ${cover_book_query} ${promotion_book_query} where order_id = ${orderId} `
            return db.query(Query)
        })
        const results = await Promise.all(promises);
        return results.map(result => result[0]);
    }

    static async getOrderItemsById(orderId) {
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
        const book_query = ' left Join books b on b.book_id = ot.book_id'
        const promotion_query = ' left Join book_promotions bp on b.book_id = bp.book_id left join promotions p on bp.promotion_id = p.promotion_id'
        const selectQuery = `c.thumbnail_url, b.title, b.original_price, ot.quantity, p.promotion_percent`
        const Query = `select ${selectQuery}  from orderitems ot ${book_query} ${cover_book_query} ${promotion_query} where order_id = ${orderId} `
        return db.query(Query)
    }




}

module.exports = { Order, OrderItem }