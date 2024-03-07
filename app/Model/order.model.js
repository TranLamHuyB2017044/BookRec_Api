
const db = require('../config/db')

class Order{
    constructor(order){
        this.order_id = order.order_id,
        this.user_id = order.user_id,
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
            address: this.address,
            phone: this.phone,
            shipping_method: this.shipping_method,
            payment_method: this.payment_method,
            total_price: this.total_price
        }
        const data = db.query(`insert into orders set ?`, orderInfo)
        return data
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

    static async getAllUserOrders(user_id){
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
        const book_query = ' left Join books b on b.book_id = ot.book_id'
        const orderItemsQuery = `left join orderitems ot on od.order_id = ot.order_id`
        const selectQuery = `c.thumbnail_url, b.title, b.original_price, b.discount, ot.quantity, od.order_date, od.payment_status, od.total_price, od.address`
        const orderQuery = `select ${selectQuery}  from orders od ${orderItemsQuery} ${book_query} ${cover_book_query} where user_id = ${user_id}`
        const data = await db.query(orderQuery)
        return data
    }
}

module.exports = {Order, OrderItem}