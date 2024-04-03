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
        req.body.content,
        parseInt(req.body.n_star)
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
        if (req.files){
            for (const file of req.files){
                cloudinary.uploader.destroy(file.filename, {resource_type: 'video'})
                cloudinary.uploader.destroy(file.filename, {resource_type: 'image'})
                
            }
            return res.status(404).json({messages: error.message})
        }
        return res.status(404).json({messages: error.message})
    }

}

exports.getALLUserPost = async (req, res) => {
    try {
        let posts = await Ratings.getUserRating()
        const url_img = posts[0].urls.split(',')
        posts[0].urls = url_img
        res.status(200).json(posts[0])
    } catch (error) {
        res.status(404).json({messages: error.message})
    }
}