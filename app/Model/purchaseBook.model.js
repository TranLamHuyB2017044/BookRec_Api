const db = require('../config/db');


class bookPurchase{
    constructor(purchase_id, publisher_id, user_id){
        this.purchase_id = purchase_id;
        this.publisher_id = publisher_id;
        this.user_id = user_id;
    }

    static async CreateBookPurchase(PurchaseInfo){
        const query = `insert into book_purchase values (?, ?, ?) `
        const data = await db.query(query, [PurchaseInfo.purchase_id, PurchaseInfo.publisher_id, PurchaseInfo.user_id])
        return data[0]
    }

}




class bookPurchaseDetails extends bookPurchase{
    constructor(purchaseDetail_id, book_id, quantity_ordered, unit_price){
        super(purchase_id)
        this.purchaseDetail_id = purchaseDetail_id;
        this.book_id = book_id;
        this.quantity_ordered = quantity_ordered;
        this.unit_price = unit_price;
    }


    static async createPurchaseDetail(DetailInfo){
        const query = `insert into book_purchase_detail values (?, ?, ?, ?, ?)`
        const data = await db.query(query, [DetailInfo.purchase_detail_id, DetailInfo.purchase_id, DetailInfo.book_id, DetailInfo.quantity_ordered, DetailInfo.unit_price])
        return data[0]
    }
}


module.exports = {bookPurchase, bookPurchaseDetails}