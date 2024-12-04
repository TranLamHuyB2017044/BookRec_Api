const { Ratings, Ratingimages } = require('../Model/rating.model')
const cloudinary = require("cloudinary").v2;

function generateRandomNumberWithDigits(digits) {
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


exports.createPost = async (req, res) => {
    const post = new Ratings(
        generateRandomNumberWithDigits(5),
        parseInt(req.body.user_id),
        parseInt(req.body.book_id),
        req.body.content,
        parseInt(req.body.n_star),
        req.body.user_status
    )
    try {
        const newPost = await post.createRating()
        if (req.files && req.files.length > 0) {
            const images = [];
            for (const file of req.files) {
                const image_post = new Ratingimages(
                    generateRandomNumberWithDigits(5),
                    file.path,
                    post.rating_id,
                );

                const newImage = await image_post.createRatingImage();
                images.push(newImage);
            }

            return res.status(200).json({ newPost, images });
        } else {
            return res.status(200).json({ newPost });
        }
    } catch (error) {
        if (req.files) {
            for (const file of req.files) {
                cloudinary.uploader.destroy(file.filename, { resource_type: 'video' })
                cloudinary.uploader.destroy(file.filename, { resource_type: 'image' })

            }
            return res.status(404).json({ messages: error.message })
        }
        return res.status(404).json({ messages: error.message })
    }

}

exports.getALLUserPost = async (req, res) => {
    const book_id = req.params.book_id
    try {
        const posts = await Ratings.getUserRating(book_id)
        if (posts.length > 0) {
            return res.status(200).json(posts)
        } else {
            return res.status(203).json({ messages: 'Chưa có bình luận nào' })
        }
    } catch (error) {
        res.status(404).json({ messages: error.message })
    }
}

exports.Statistic_Rating = async (req, res) => {
    try {
        const book_id = req.params.book_id
        const data = await Ratings.countRating(book_id)
        const numRating = await Ratings.countNumRating(book_id)
        const all_Img = await Ratings.getAllImagebyBookId(book_id)
        const rating_per_star = await Ratings.countRatingPerNStar(book_id)
        res.status(200).json({ info: data[0], all_media: all_Img, rating_per_star: rating_per_star, numRating: numRating })
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

exports.GetStatisticRatingByStatus = async (req, res) => {
    try {
        const data = await Ratings.getAllRatingsByStatus()
        res.status(200).json(data)

    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

exports.GetFilterRatingByStar = async (req, res) => {
    try {

        const book_id = req.params.book_id
        const {n_star} = req.query
        const data = await Ratings.filterRatingsByStar(book_id, n_star)
        res.status(200).json(data)

    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}

