const {Order, OrderItem} = require('../Model/order.model')

function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.createOrder = async (req,res) => {
    const OrderInfo = new Order({
        order_id: generateRandomNumberWithDigits(5),
        user_id: req.body.user_id,
        customer_name: req.body.customer_name,
        address: req.body.address,
        phone: req.body.phone,
        shipping_method: req.body.shipping_method,
        payment_method: req.body.payment_method,
        total_price: req.body.total_price
    })
    
    try {
        await OrderInfo.createUserOrder()
        const items = req.body.items
        const orderItemsValues = items.map(item => [generateRandomNumberWithDigits(5), OrderInfo.order_id, item.book_id, item.quantity]);
        await OrderItem.addOrderItems(orderItemsValues)
        res.status(200).json({status: 'success', message: 'Created order successfully'}) 
    } catch (error) {
        res.status(404).json({message: error.message});
    }
}

exports.getAllUserOrder = async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const AllOrder = await Order.getAllUserOrders(user_id)
        const orderIds = AllOrder.map(order => order.order_id)
        const orderItems = await OrderItem.getAllOrderItems(orderIds)
        const data = AllOrder.map((order, id) => {
            return {
                ...order,
                items: orderItems[id]
            }

        })

        res.status(200).json(data)
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}