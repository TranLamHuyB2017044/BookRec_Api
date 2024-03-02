
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
        this.order_date = order.order_date 
    }

    createUserOrder(){
        const order = {
            order_id: this.order_id,
            user_id: this.user_id,
            address: this.address,
            phone: this.phone,
            shipping_method:this.shipping_method,
            payment_method:this.payment_method,
            total_price: this.total_price,
            order_date: this.order_date
        }
        const data = db.query(`insert into orders set ?`, order)
        return data
    }

}


class OrderItem extends Order {
    constructor(items){
        super(order_id),
        this.item_id = items.item_id,
        this.book_id = items.book_id,
        this.quantity = items.quantity,
        this.total_price = items.total
    }
}

module.exports = {Order, OrderItem}