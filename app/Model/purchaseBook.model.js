const db = require('../config/db');


class bookPurchase {
    constructor(purchase_id, user_id) {
        this.purchase_id = purchase_id;
        this.user_id = user_id;
    }

    static async CreateBookPurchase(PurchaseInfo) {
        const query = `insert into book_purchase set ? `
        const data = await db.query(query, [PurchaseInfo])
        return data[0]
    }

    static async getAllOrdersPurchase() {
        const user_query = `join users us on bp.user_id = us.user_id `
        const query = `select bp.purchase_id, bp.order_date, us.fullname from book_purchase bp ${user_query}  ORDER BY order_date DESC `
        const data = await db.query(query)
        return data[0]
    }


}




class bookPurchaseDetails extends bookPurchase {
    constructor(purchase_detail_id, book_id, quantity_ordered, unit_price, publisher_id) {
        super(purchase_id)
        this.purchase_detail_id = purchase_detail_id;
        this.book_id = book_id;
        this.quantity_ordered = quantity_ordered;
        this.unit_price = unit_price;
        this.publisher_id = publisher_id;
    }


    static async createPurchaseDetail(DetailInfo) {
        const query = `insert into book_purchase_detail values (${DetailInfo.purchase_detail_id}, ${DetailInfo.purchase_id}, ${DetailInfo.book_id}, ${DetailInfo.quantity_ordered}, ${DetailInfo.unit_price}, ${DetailInfo.publisher_id})`
        const data = await db.query(query)
        return data[0]
    }

    static async getAllPurchaseDetail(purchaseIds) {
        const publisher_query = `JOIN publishers p ON bpd.publisher_id = p.publisher_id`;
        const book_query = `JOIN books b ON bpd.book_id = b.book_id`;
        const select_query = `p.publisher_name, bpd.purchase_id, b.title, bpd.unit_price, bpd.quantity_ordered`;
        const query = `
            SELECT ${select_query}
            FROM books.book_purchase_detail bpd
            ${book_query}
            ${publisher_query}
            WHERE bpd.purchase_id IN (?)
        `;
        const results = await db.query(query, [purchaseIds]);
        return results[0];
    }

    static async getTotalAmountSpent(typeFilter) {
        let dateCondition;
        if (typeFilter === 'day') {
            dateCondition = `DATE(p.order_date) = CURDATE()`;
        } else if (typeFilter === 'month') {
            dateCondition = `DATE_FORMAT(p.order_date, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')`;
        }
        const query = `
            SELECT 
                SUM(pd.quantity_ordered * pd.unit_price) AS total_amount
            FROM 
                book_purchase p
            JOIN 
                book_purchase_detail pd ON p.purchase_id = pd.purchase_id
            WHERE 
                ${dateCondition}
        `;

        const results = await db.query(query);
        return results[0][0]?.total_amount || 0;
    }

    static async getMonthlyRevenueAndExpenseQuery() {
        const calendarQuery = `
            SELECT 
                MONTH(DATE_ADD('2024-01-01', INTERVAL seq MONTH)) AS month,
                YEAR(DATE_ADD('2024-01-01', INTERVAL seq MONTH)) AS year
            FROM (
                SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL 
                SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL 
                SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
            ) AS months
        `;
    
        const purchaseDetailsQuery = `
            SELECT 
                DATE_FORMAT(p.order_date, '%Y-%m') AS month,
                SUM(pd.quantity_ordered * pd.unit_price) AS total_expense
            FROM 
                book_purchase p
            JOIN 
                book_purchase_detail pd ON p.purchase_id = pd.purchase_id
            GROUP BY 
                DATE_FORMAT(p.order_date, '%Y-%m')
        `;
    
        const orderDetailsQuery = `
            SELECT 
                DATE_FORMAT(o.order_date, '%Y-%m') AS month,
                SUM(o.total_price) AS total_revenue
            FROM 
                orders o
            where o.payment_status = 'Đã giao'
            GROUP BY 
                DATE_FORMAT(o.order_date, '%Y-%m')
        `;
    
        const mainQuery = `
            WITH calendar AS (${calendarQuery}),
                purchase_details AS (${purchaseDetailsQuery}),
                order_details AS (${orderDetailsQuery})
            SELECT 
                c.month,
                c.year,
                COALESCE(o.total_revenue, 0) AS total_revenue,
                COALESCE(p.total_expense, 0) AS total_expense
            FROM 
                calendar c
            LEFT JOIN order_details o 
                ON DATE_FORMAT(DATE_ADD('2024-01-01', INTERVAL (c.month - 1) MONTH), '%Y-%m') = o.month
            LEFT JOIN purchase_details p 
                ON DATE_FORMAT(DATE_ADD('2024-01-01', INTERVAL (c.month - 1) MONTH), '%Y-%m') = p.month
            ORDER BY 
                c.year, c.month;
        `;
        const data = await db.query(mainQuery);
        return data[0];

    }
    


}


module.exports = { bookPurchase, bookPurchaseDetails }