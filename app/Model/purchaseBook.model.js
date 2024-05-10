const db = require('../config/db');


class bookPurchase{
    constructor(purchase_id, user_id){
        this.purchase_id = purchase_id;
        this.user_id = user_id;
    }

    static async CreateBookPurchase(PurchaseInfo){
        const query = `insert into book_purchase set ? `
        const data = await db.query(query, [PurchaseInfo])
        return data[0]
    }

    static async getAllOrdersPurchase(){
        const user_query = `join users us on bp.user_id = us.user_id `
       const query = `select bp.purchase_id, bp.order_date, us.fullname from book_purchase bp ${user_query}`
       const data = await db.query(query)
       return data[0]
    }


}




class bookPurchaseDetails extends bookPurchase{
    constructor(purchase_detail_id, book_id, quantity_ordered, unit_price, publisher_id){
        super(purchase_id)
        this.purchase_detail_id = purchase_detail_id;
        this.book_id = book_id;
        this.quantity_ordered = quantity_ordered;
        this.unit_price = unit_price;
        this.publisher_id = publisher_id;
    }


    static async createPurchaseDetail(DetailInfo){
        console.log(DetailInfo)
        const query = `insert into book_purchase_detail values (${DetailInfo.purchase_detail_id}, ${DetailInfo.purchase_id}, ${DetailInfo.book_id}, ${DetailInfo.quantity_ordered}, ${DetailInfo.unit_price}, ${DetailInfo.publisher_id})`
        const data = await db.query(query)
        return data[0]
    }

    static async getAllPurchaseDetail(purchaseIds){
        const promises = purchaseIds.map(orderId => {
            const publisher_query = `join publishers p on bpd.publisher_id = p.publisher_id`
            const book_query = ` join books b on bpd.book_id = b.book_id `
            const select_query = ` p.publisher_name, b.title, bpd.unit_price, bpd.quantity_ordered `
            const query = `select ${select_query} from book_purchase_detail bpd  ${book_query} ${publisher_query} where bpd.purchase_id = ${orderId}`
            return db.query(query)
        })
        const results = await Promise.all(promises);
        return results.map(result => result[0]);
    }


}


module.exports = {bookPurchase, bookPurchaseDetails}