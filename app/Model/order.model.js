
const db = require('../config/db')

class Order{
    constructor(order){
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
    createUserOrder(){
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

    static async getAllUserOrders(user_id){
        const query = `select * from orders where user_id = ? `
        const data = await db.query(query, user_id)
        return data[0]
    }


}


class OrderItem extends Order {
    constructor(items){
        super(order_id),
        this.item_id = items.item_id,
        this.book_id = items.book_id,
        this.quantity = items.quantity
    }

    static async addOrderItems(orderItemsValues){
        orderItemsValues.map(items => {
            const query = `insert into orderitems (item_id, order_id, book_id, quantity) values (${items}) `
            db.query(query)
            return {
                status: 'Create Order successfully', 
            }
        })
    }


    static async getAllOrderItems(orderIds){
        const promises = orderIds.map(orderId => {
            const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
            const book_query = ' left Join books b on b.book_id = ot.book_id'
            const selectQuery = `c.thumbnail_url, b.title, b.original_price, b.discount, ot.quantity `
            const Query = `select ${selectQuery}  from orderitems ot ${book_query} ${cover_book_query} where order_id = ${orderId} `
            return db.query(Query)
        })
        const results = await Promise.all(promises);
        return results.map(result => result[0]);
    }
}

module.exports = {Order, OrderItem}