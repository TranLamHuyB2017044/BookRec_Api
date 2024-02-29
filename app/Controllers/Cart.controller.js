const {Cart, CartItems} = require('../Model/cart.model')
function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.CreateCartUser = async (req,res) => {
    const user_id = req.body.user_id
    const cart_id = generateRandomNumberWithDigits(5)  
    try {
        const userCart = await Cart.getUserCart(user_id)
        if(userCart.length > 0){
            return res.status(301).json({message: 'User đã có giỏ hàng rồi'})
        }else{
            const data = await Cart.createUserCart(cart_id, user_id)
            return res.status(201).json(data)
        }
    } catch (error) {
        res.status(401).json( {message: error.message})
    }
}

exports.addToCart = async (req, res) =>{
    const {user_id, book_id, quantity} = req.body
    const newItem = {
        book_id,
        quantity,
    }
    try {
        const userCart = await Cart.getUserCart(user_id)
        const CartID = userCart[0].cart_id

        // kiểm tra sách thêm vào đã tồn tại trong cartItem chưa
        const existingItems = await CartItems.checkExistingBook(CartID, book_id)
        if(existingItems !== null){
            // nếu có cập nhật số lượng
            existingItems.quantity += quantity
            // console.log(existingItems.quantity, quantity, newQuantity)
            const data = await CartItems.updateQuantityItem(existingItems)
            return res.status(200).json(data)
        }else{
            // nếu chưa thêm mới
            const data = await CartItems.addToCart(CartID, newItem)
            return res.status(200).json(data)
        }
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

exports.getUserCart = async (req, res) => {
    const user_id = req.params.user_id
    const userCart = await Cart.getUserCart(user_id)
    const cart_id = userCart[0].cart_id
    try {
        const data = await CartItems.getCartItems(cart_id)
        res.status(200).json(data)
    } catch (error) {
        res.status(401).json({message: error.message})
    }
}

exports.updateItemsQuantity = async (req, res) => {
    const {item_id, quantity} = req.body
    const updateItem = {item_id, quantity}
    try {
        const data = await CartItems.updateQuantityItem(updateItem)
        res.status(200).json(data)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

exports.deleteItems = async (req, res) => {
    const item_id = req.body.item_id
    try {
        const response = await CartItems.deleteCartItem(item_id)
        res.status(200).json(response)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}