const db = require('../config/db');

class Cart {
    constructor(cart_id, user_id){
        this.cart_id = cart_id
        this.user_id = user_id
    }


    static async createUserCart(cart_id, user_id){
        const query = `insert into cart (cart_id, user_id) values (?, ?)`
        await db.query(query, [cart_id, cart_id])
        return {
            cart_id: cart_id,
            user_id: user_id
        }
    }

    static async getUserCart(user_id){
        const query = `select cart_id from cart where user_id = ${user_id}`
        const data = await db.query(query, [user_id])
        return data[0]
    }
}


class CartItems extends Cart{
    constructor(items){
        super(cart_id)
        this.items = items
    }

    
    static async getCartItems(cart_id){
        const cover_book_query = ' left Join cover_books c on b.book_id = c.book_id'
        const book_query = ' left Join books b on b.book_id = ct.book_id'
        const itemsQuery = `SELECT b.book_id, ct.item_id, c.thumbnail_url, b.title, ct.quantity, b.original_price, b.discount FROM cartitem ct ${book_query} ${cover_book_query} where ct.cart_id = ?`;
        const items = await db.query(itemsQuery, [cart_id]);
        return items[0];
    }

    static async addToCart(cartId, newItem) {
        const query = `INSERT INTO cartitem (cart_id, book_id, quantity) VALUES (?, ?, ?)`;
        await db.query(query, [cartId, newItem.book_id, newItem.quantity]);
        return {cartId: cartId, newItem}
    }


    static async checkExistingBook(cart_id, book_id){
        const query = `SELECT * FROM cartitem WHERE cart_id = ? AND book_id = ?`;
        const [existingItem] = await db.query(query, [cart_id, book_id]);
        if(existingItem.length === 0){
            return null
            
        }else return {
            item_id: existingItem[0]?.item_id,
            quantity: existingItem[0]?.quantity
        }
    }

    static async updateQuantityItem(updatedItem){
        const {item_id, quantity} = updatedItem
        const query = `UPDATE cartitem SET quantity = ? WHERE item_id = ?`;
        await db.query(query, [quantity, item_id]); 
        return updatedItem
    }


    static async deleteCartItem(item_id){
        const query = `delete from cartitem where item_id = ?`;
        await db.query(query, [item_id]); 
        return `Đã xóa items ${item_id}`
    }
}


module.exports = {Cart, CartItems}