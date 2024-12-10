const { Reply } = require('../Model/reply.model.js')
const cloudinary = require("cloudinary").v2;

function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.createNewReplyPost = async (req, res) => {
    const post = new Reply(
        generateRandomNumberWithDigits(5),
        parseInt(req.body.rating_id),
        parseInt(req.body.book_id),
        req.body.content,
    )
    try {
        const data = await post.createReplyComment()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error })
    }

}

