const { Order, OrderItem } = require('../Model/order.model')
const BookModel = require('../Model/book.model');
const Book = require('../Model/book.model');
function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.createOrder = async (req, res) => {
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
    const now = new Date();
    const currentDate = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();
    const email_info = {
        email: req.body.email,
        customer_name: OrderInfo.customer_name,
        order_date: `${currentDate} - ${currentMonth} - ${currentYear} / ${currentHour}h:${currentMinute}m:${currentSecond}s`,
        total: OrderInfo.total_price.toLocaleString(),
        address: OrderInfo.address
    }
    try {
        await OrderInfo.createUserOrder()
        const items = req.body.items
        items.map(async (item) => {
            const book_for_placement = await Book.getBookById(item.book_id)
            console.log(book_for_placement[0])
            const updateInfo = {
                inStock: book_for_placement[0].inStock - item.quantity,
                quantity_sold: book_for_placement[0].quantity_sold + item.quantity
            }
            await BookModel.updateQuantityBook(updateInfo.inStock, updateInfo.quantity_sold, item.book_id)
        });
        const orderItemsValues = items.map((item) => [generateRandomNumberWithDigits(5), OrderInfo.order_id, item.book_id, item.quantity]);
        await OrderItem.addOrderItems(orderItemsValues)
        await OrderItem.sendVerifyEmail(email_info)
        res.status(200).json({ status: 'success', message: 'Created order successfully' })
    } catch (error) {
        res.status(404).json({ message: error.message });
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

exports.getAllOrders = async (req, res) => {
    try {
        const AllOrder = await Order.getAllOrders()
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


exports.getOrderById = async (req, res) => {
    const order_id = req.params.order_id
    try {
        const one_order = await Order.getOrdersById(order_id)
        const orderItems = await OrderItem.getOrderItemsById(order_id)
        const data = {
            ...one_order[0],
            orderItems: orderItems[0]
        }
        res.status(200).json(data)
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}


exports.updateOrderStatus = async (req, res) => {
    try {
        const order_id = req.params.order_id
        const status = req.body.status
        const updateOrder = await Order.updateStatusOrder(order_id, status)
        res.status(200).json({ status: 'success', data: updateOrder })
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
}

exports.getStatisticsOrder = async (req, res) => {
    try {
        const typeOfStatistics = req.params.type
        let data = null
        if (typeOfStatistics === 'day') {
            data = await Order.getStatisticsOrderToday()
            if (data.length > 0) {
                return res.status(200).json(data[0])
            } else {
                return res.status(200).json({ tong_so_don: 0, tong_gia_tien: 0 })
            }
        } else {
            data = await Order.getStatisticsOrderThisMonth()
            if (data.length > 0) {
                return res.status(200).json(data[0])
            } else {
                return res.status(200).json({ tong_so_don: 0, tong_gia_tien: 0 })
            }
        }
    } catch (error) {
        return res.status(404).json(error.message)
    }
}


exports.getTop5BestSellerBooks = async (req, res) => {
    try {
        const data = await Order.getBestSellerBooks()
        res.status(200).json(data)
    } catch (error) {
        res.status(404).json(error.message)
    }
}

exports.getStatistic7DayAgo = async (req, res) => {
    try {
        const data = await Order.StatisticsOrder7DayAgo()
        res.status(200).json(data[0])
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}