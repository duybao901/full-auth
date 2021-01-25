const fs = require('fs');

const uploadController = {
    uploadAvatar: async (req, res) => {
        try {
            removeTempFile(req.files.file.tempFilePath);
            return res.json({ msg: "Upload success ☘️" });
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