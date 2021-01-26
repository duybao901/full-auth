const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadController = {
    uploadAvatar: async (req, res) => {
        try {

            const file = req.files.file;

            // upload image cloudinary in folder fullauth
            cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: 'fullauth', width: 250, height: 250, crop: "fill"
            }, (err, result) => {
                if (err) throw err;

                removeTempFile(req.files.file.tempFilePath);
                return res.json({ url: result.secure_url });
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

const removeTempFile = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}
module.exports = uploadController;