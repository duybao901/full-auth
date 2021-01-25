const fs = require('fs');

const uploadImage = (req, res, next) => {
    try {
        if (!req.files || Object.keys(req.files) === 0) {
            removeTempFile(req.files.file.tempFilePath)
            return res.status(400).json({ msg: "No files were uploaded" });
        }

        const file = req.files.file;
        console.log(file);

        if (file.size > 1024 * 1024) {// 1mb
            removeTempFile(file.tempFilePath)
            return res.status(400).json({ msg: "Size too large" });
        }

        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
            removeTempFile(file.tempFilePath)
            return res.status(400).json({ msg: "Files format is incorrect" });
        }

        next();
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

const removeTempFile = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = uploadImage