const User = require("../model/user.model");

const authAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.role !== 1) {
            return res.status(400).json({ msg: "You're not admin, access denied" });
        }

        next();

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

module.exports = authAdmin;