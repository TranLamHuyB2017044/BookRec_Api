const User = require('../Model/user.model')
const cloudinary = require("cloudinary").v2;

exports.Register = async (req, res) => {
    const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        pass_word: req.body.pass_word,
        avatar: req.file?.path,
        avatar_id: req.file?.filename,
        admin_role: req.body.admin_role,
    });
    try {
        const result = await User.createUser(newUser);
        res.status(200).json(result);
    } catch (err) {
        if(err.message == 'Email already exists.'){
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename);
            }
            res.status(400).json({ message: err.sqlMessage || 'Email already exists.' });
        }else{
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename);
            }
            res.status(400).json({ message: err.sqlMessage || 'Error creating user.' });
        }
    }
};

exports.Login = async (req, res) => {
    const {email, password} = req.body
    User.getOneUser(email, password, (err, user) => {
        
    })

}